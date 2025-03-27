import React from "react";

const KnowYourStation = ({ selectedStation, StationData, setCenterThisStation, fullMapViewRef, showLift, setShowLift }) => {
  // Early return if StationData is missing
  if (!StationData) return null;

  // Check if no station is selected
  if (!selectedStation || selectedStation === "no-station") {
    return (
      <div className="p-2">
        <h3 className="text-xl font-bold mt-2 mb-4">Know Your Station</h3>
        <div className="border shadow-lg rounded-lg p-6 text-center">
          <p className="text-gray-700">Please select a Station</p>
        </div>
      </div>
    );
  }

  // Find station info if a valid station is selected
  const stationInfo = StationData.find(
    (station) => station.id === selectedStation
  );

  if (!stationInfo) return null;

  // Function to handle the click and update count
  const handleStationClick = () => {
    const updatedStationInfo = {
      ...stationInfo,
      clickCount: stationInfo.clickCount ? stationInfo.clickCount + 1 : 0,
    };
    if (fullMapViewRef.current) {
      fullMapViewRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setCenterThisStation(updatedStationInfo);
    console.log(updatedStationInfo)
  };

  // JSX rendering with station details
  return (
    <div className="p-2">
      <h3 className="text-xl font-bold mt-2 mb-4">Know Your Station</h3>
      <div
        className="border shadow-lg rounded-lg p-6"

        style={{ cursor: "pointer" }}
      >
        <div className="flex items-stretch gap-24 justify-center">
          {/* Entry/Exit Gates */}
          <div className="flex flex-col items-center" onClick={handleStationClick}>
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
          <div className="flex flex-col items-center" onClick={() => {
            handleStationClick();
            setShowLift(true);
          }}>
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
