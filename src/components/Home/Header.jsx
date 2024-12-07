import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function Header({
  coordinates,
  setCoordinates,
  StationData,
  nearestStation,
  setNearestStation,
  setSelectedStation,
  selectedStation,
}) {
  const { t, i18n } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleStationChange = (station) => {
    setSelectedStation(station.Station_Code);
    setCoordinates({
      lat: station.Station_Latitude,
      lng: station.Station_Longitude,
    });
    setIsDropdownOpen(false);
  };

  const filteredStations = StationData.filter((station) =>
    station.Station_Commercial_Name.toLowerCase().includes(
      searchQuery.toLowerCase()
    )
  );

  return (
    <header className="flex gap-5 justify-between items-center h-[60px]">
      <div className="flex flex-col self-start">
        <div className="flex gap-10 items-center mt-2 w-full">
          <div className="flex flex-1 shrink gap-2.5 items-center w-full basis-0">
            <div className="flex gap-2 items-center self-stretch p-2 my-auto w-10 h-10 rounded bg-black bg-opacity-10">
              <img
                loading="lazy"
                src="location.svg"
                alt=""
                className="object-contain w-6 aspect-square"
              />
            </div>
            <div className="flex flex-col flex-1 shrink self-stretch my-auto basis-4">
              <div className="flex gap-1 items-start self-start text-xs tracking-normal text-zinc-600">
                <div>Current location</div>
              </div>
              <div className="relative w-full max-w-xs">
                {/* Dropdown Button */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-80 h-8 truncate border rounded bg-white text-sm font-semibold leading-tight text-stone-950 px-3 py-2 shadow-md"
                >
                  {selectedStation === "no station"
                    ? "No station within 1000 meters"
                    : selectedStation
                    ? `${selectedStation} - ${
                        StationData.find(
                          (station) => station.Station_Code === selectedStation
                        )?.Station_Commercial_Name || "Station Name Not Found"
                      }`
                    : "Select a station"}
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div
                    className="absolute w-80 z-10 mt-2 bg-white border rounded shadow-lg max-h-60 overflow-auto"
                    // style={{ width: "100%" }} // Matches the button width
                  >
                    {/* Search Input */}
                    <div className="sticky top-0 bg-white z-20 p-2">
                      <input
                        type="text"
                        placeholder="Search station"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                      />
                    </div>
                    {/* Station List */}
                    <ul className="divide-y divide-gray-200">
                      {StationData.filter(
                        (station) =>
                          !searchQuery ||
                          station.Station_Commercial_Name.toLowerCase().includes(
                            searchQuery.toLowerCase()
                          )
                      ).map((station) => (
                        <li
                          key={station.Station_Code}
                          className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                            station.Functional_Status === "Non-functional"
                              ? "text-gray-400 pointer-events-none"
                              : "text-black"
                          }`}
                          onClick={() => {
                            if (
                              station.Functional_Status !== "Non-functional"
                            ) {
                              setSelectedStation(station.Station_Code);
                              setCoordinates({
                                lat: station.Station_Latitude,
                                lng: station.Station_Longitude,
                              });
                              setIsDropdownOpen(false);
                            }
                          }}
                        >
                          {station.Station_Code} -{" "}
                          {station.Station_Commercial_Name}
                        </li>
                      ))}
                      {StationData.filter(
                        (station) =>
                          !searchQuery ||
                          station.Station_Commercial_Name.toLowerCase().includes(
                            searchQuery.toLowerCase()
                          )
                      ).length === 0 && (
                        <li className="px-3 py-2 text-gray-400 text-sm">
                          No stations found
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <img
          loading="lazy"
          src="MMRC.png"
          alt="MMRC"
          className="object-contain w-[5rem]"
        />
      </div>
    </header>
  );
}

export default Header;

// #######

// import React, { useState, useEffect } from "react";
// import { getDistance } from "geolib"; // Import geolib for distance calculations
// // import StationData from '../Map/StationList.json'; // Import station data
// import { getStationData, addVisitor } from "../../api/index.js";
// import { useTranslation } from "react-i18next";

// function Header({
//   coordinates,
//   setCoordinates,
//   StationData,
//   nearestStation,
//   setNearestStation,
//   setSelectedStation,
//   selectedStation,
// }) {
//   const { t, i18n } = useTranslation();
//   // const [StationData, setStationData] = useState([]);

//   const changeLanguage = (lng) => {
//     i18n.changeLanguage(lng);
//   };

//   const handleStationChange = (event) => {
//     const selectedStationCode = event.target.value;
//     if (selectedStationCode !== "no-station") {
//       const selectedStation = StationData.find(
//         (station) => station.Station_Code === selectedStationCode
//       );
//       if (selectedStation) {
//         setCoordinates({
//           lat: selectedStation.Station_Latitude,
//           lng: selectedStation.Station_Longitude,
//         });
//       }
//     }
//   };

//   return (
//     <header className="flex gap-5 justify-between items-center h-[60px]">
//       <div className="flex flex-col self-start">
//         <div className="flex gap-10 items-center mt-2 w-full">
//           <div className="flex flex-1 shrink gap-2.5 items-center w-full basis-0">
//             <div className="flex gap-2 items-center self-stretch p-2 my-auto w-10 h-10 rounded bg-black bg-opacity-10">
//               <img
//                 loading="lazy"
//                 src="location.svg"
//                 alt=""
//                 className="object-contain w-6 aspect-square"
//               />
//             </div>
//             <div className="flex flex-col flex-1 shrink self-stretch my-auto basis-4">
//               <div className="flex gap-1 items-start self-start text-xs tracking-normal text-zinc-600">
//                 <div>Current location</div>
//                 {/* <img loading="lazy" src="arrow.svg" alt="" className="object-contain shrink-0 aspect-square w-[18px]" /> */}
//               </div>
//               <div className="mt-1">
//                 <select
//                   onChange={handleStationChange}
//                   value={selectedStation}
//                   className="border rounded bg-white text-sm font-semibold leading-tight text-stone-950 w-[70%]"
//                 >
//                   <option value="" disabled>
//                     Select a station
//                   </option>
//                   <option value="no-station" disabled>
//                     No station within 1000 meters
//                   </option>
//                   {StationData.map((station) => (
//                     <option
//                       key={station.Station_Code}
//                       value={station.Station_Code}
//                       disabled={station.Functional_Status === "Non-functional"}
//                     >
//                       {station.Station_Code} - {station.Station_Commercial_Name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="flex flex-col">
//         <img
//           loading="lazy"
//           src="MMRC.png"
//           alt="MMRC"
//           className="object-contain w-[5rem]"
//         />
//       </div>
//     </header>
//   );
// }

// export default Header;
