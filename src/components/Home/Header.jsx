import React, { useState, useEffect } from "react";
import { getDistance } from 'geolib'; // Import geolib for distance calculations
// import StationData from '../Map/StationList.json'; // Import station data
import { getStationData, addVisitor } from "../../api/index.js";
import { useTranslation } from 'react-i18next';

function Header({ coordinates, setCoordinates }) {
  const { t, i18n } = useTranslation();
  const [StationData, setStationData] = useState([]);
  const [nearestStation, setNearestStation] = useState(null);
  const [stationsWithinRadius, setStationsWithinRadius] = useState([]);
  const [selectedStation, setSelectedStation] = useState("");

  useEffect(() => {
    const fetchStationData = async () => {
      const data = await getStationData();  // Fetch station data
      setStationData(data);  // Update state with fetched station data
    };

    fetchStationData();
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };



  useEffect(() => {
    if (coordinates.lat && coordinates.lng) {
      const { lat, lng } = coordinates;

      // Find stations within the radius
      const filteredStations = StationData.filter(station => {
        const distance = getDistance(
          { latitude: lat, longitude: lng },
          { latitude: station.Station_Latitude, longitude: station.Station_Longitude }
        );
        return distance <= 1000; // Filter stations within 1000 meters
      });

      // If there are any stations within the radius, find the closest one
      if (filteredStations.length > 0) {
        const nearest = filteredStations.reduce((prev, curr) => {
          const prevDistance = getDistance(
            { latitude: lat, longitude: lng },
            { latitude: prev.Station_Latitude, longitude: prev.Station_Longitude }
          );
          const currDistance = getDistance(
            { latitude: lat, longitude: lng },
            { latitude: curr.Station_Latitude, longitude: curr.Station_Longitude }
          );
          return currDistance < prevDistance ? curr : prev;
        });
        // console.log(nearest);
        addVisitor(nearest); // Increment visitor count for the nearest station
        setNearestStation(nearest);
        setStationsWithinRadius(filteredStations);
        setSelectedStation(nearest.Station_Code); // Set selected station to nearest one
      } else {
        // No station within the radius
        setNearestStation(null);
        setStationsWithinRadius([]);
        setSelectedStation("no-station"); // Use a unique value to indicate no station
      }
    }
  }, [coordinates]);

  const handleStationChange = (event) => {
    const selectedStationCode = event.target.value;
    if (selectedStationCode !== "no-station") {
      const selectedStation = StationData.find(station => station.Station_Code === selectedStationCode);
      if (selectedStation) {
        setCoordinates({
          lat: selectedStation.Station_Latitude,
          lng: selectedStation.Station_Longitude,
        });
      }
    }
  };

  return (
    <header className="flex gap-5 justify-between items-center h-[60px]">
      <div className="flex flex-col self-start">
        <div className="flex gap-10 items-center mt-2 w-full">
          <div className="flex flex-1 shrink gap-2.5 items-center w-full basis-0">
            <div className="flex gap-2 items-center self-stretch p-2 my-auto w-10 h-10 rounded bg-black bg-opacity-10">
              <img loading="lazy" src="location.svg" alt="" className="object-contain w-6 aspect-square" />
            </div>
            <div className="flex flex-col flex-1 shrink self-stretch my-auto basis-4">
              <div className="flex gap-1 items-start self-start text-xs tracking-normal text-zinc-600">
                <div>Current location</div>
                {/* <img loading="lazy" src="arrow.svg" alt="" className="object-contain shrink-0 aspect-square w-[18px]" /> */}
              </div>
              <div className="mt-1">
                <select 
                  onChange={handleStationChange} 
                  value={selectedStation}
                  className="border rounded bg-white text-sm font-semibold leading-tight text-stone-950 w-[70%]"
                >
                  <option value="" disabled>Select a station</option>
                  <option value="no-station" disabled>No station within 1000 meters</option>
                  {StationData.map(station => (
                    <option key={station.Station_Code} value={station.Station_Code}>
                      {station.Station_Code} - {station.Station_Commercial_Name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <img loading="lazy" src="MMRC.png" alt="MMRC" className="object-contain w-[5rem]" />
      </div>
    </header>
  );
}

export default Header;
