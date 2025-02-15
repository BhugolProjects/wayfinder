import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

function Header({
  coordinates = { lat: 0, lng: 0 },
  setCoordinates = { lat: 0, lng: 0 },
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
    <header className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <img
          loading="lazy"
          src="MMRC.png"
          alt="MMRC"
          className="object-contain w-[4rem]"
        />
        <button
          className="flex items-center gap-2 bg-cyan-500 rounded-full px-4 py-2 hover:opacity-90 transition"
          style={{ backgroundColor: "#2DA2C3" }}
        >
          <img
            loading="lazy"
            src="Language_Change.svg"
            alt="Language Change Button"
            className="object-contain w-[1.5rem]"
          />
          <span className="font-medium">ENG</span>
        </button>
      </div>

      {/* Navigation Box */}
      <div className="relative flex flex-row items-center gap-4 bg-gray-100 p-3 rounded-lg shadow-md w-full max-w-lg">
        {/* Location Icon */}
        <div className="flex items-center justify-center w-10 h-10 rounded bg-black bg-opacity-10 overflow-hidden">
          <img
            loading="lazy"
            src="location.svg"
            alt="Location Icon"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Dropdown Selection */}
        <div className="flex flex-col flex-1 relative">
          <div className="text-xs text-gray-600">Current location</div>

          {/* Station Name Button */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full min-h-[3rem] border rounded bg-white text-sm font-semibold leading-tight text-gray-900 px-3 py-3 shadow-sm flex items-center"
          >
            <span className="w-full text-left overflow-hidden text-ellipsis whitespace-normal break-words">
              {selectedStation === "no station"
                ? "No station within 1000 meters"
                : selectedStation
                ? `${
                    StationData.find(
                      (station) => station.Station_Code === selectedStation
                    )?.Station_Name || "Station Name Not Found"
                  }`
                : "Select a station"}
            </span>
          </button>

          {/* Dropdown List */}
          {isDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-1 z-10 bg-white border rounded shadow-lg max-h-60 overflow-auto w-full max-w-full">
              {/* Search Input with Clear Button */}
              <div className="sticky top-0 bg-white z-20 p-3 flex items-center">
                <input
                  type="text"
                  placeholder="Search station"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 border rounded text-sm pr-8"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-5 text-gray-500 text-lg"
                  >
                    ❌
                  </button>
                )}
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
                    className={`px-3 py-3 cursor-pointer hover:bg-gray-100 ${
                      station.Functional_Status === "Non-functional"
                        ? "text-gray-400 pointer-events-none"
                        : "text-black"
                    }`}
                    onClick={() => {
                      if (station.Functional_Status !== "Non-functional") {
                        setSelectedStation(station.Station_Code);
                        setCoordinates({
                          lat: Number(station.Station_Latitude),
                          lng: Number(station.Station_Longitude),
                        });
                        setIsDropdownOpen(false);
                      }
                    }}
                  >
                    {station.Station_Name}
                  </li>
                ))}
                {StationData.filter(
                  (station) =>
                    !searchQuery ||
                    station.Station_Commercial_Name.toLowerCase().includes(
                      searchQuery.toLowerCase()
                    )
                ).length === 0 && (
                  <li className="px-3 py-3 text-gray-400 text-sm">
                    No stations found
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
