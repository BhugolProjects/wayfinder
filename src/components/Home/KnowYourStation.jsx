import React from "react";

const KnowYourStation = ({ selectedStation, StationData, setCenterThisStation }) => {
  // Early returns to handle missing data
  if (!selectedStation || !StationData) return null;

  const stationInfo = StationData.find(
    (station) => station.Station_Code === selectedStation
  );

  if (!stationInfo) return null;

  // Function to handle the click and update count
  const handleStationClick = () => {
    // Create a new object with all existing stationInfo properties plus the count
    const updatedStationInfo = {
      ...stationInfo,
      clickCount: stationInfo.clickCount ? stationInfo.clickCount + 1 : 0
    };
    setCenterThisStation(updatedStationInfo);
  };

  // JSX rendering with onClick handler
  return (
    <div className="p-2">
      <h3 className="text-xl font-bold mt-2 mb-4">Know Your Station</h3>
      <div
        className="border shadow-lg rounded-lg p-6"
        onClick={handleStationClick}
        style={{ cursor: "pointer" }}
      >
        <div className="flex items-stretch gap-24 justify-center">
          {/* Entry/Exit Gates */}
          <div className="flex flex-col items-center">
            <h4 className="text-lg font-semibold mb-2">Entry/Exit</h4>
            <img
              src="./Entry_Exit_Gates.svg"
              alt="Entry/Exit Gates"
              className="w-16 h-16"
            />
            <p className="mt-2 text-center text-gray-700">
              {stationInfo.Entry_Exit_Gates}
            </p>
          </div>
          {/* Lift Status */}
          <div className="flex flex-col items-center">
            <h4 className="text-lg font-semibold mb-2">Lift</h4>
            <img
              src="./Lift_Status.svg"
              alt="Lift Status"
              className="w-16 h-16"
            />
            <p className="mt-2 text-center text-gray-700">
              {stationInfo.Lift_Status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowYourStation;