import React from "react";

const KnowYourStation = ({ selectedStation, StationData }) => {
  if (!selectedStation || !StationData) return null;

  // Find the selected station's data from StationData
  const stationInfo = StationData.find(
    (station) => station.Station_Code === selectedStation
  );

  if (!stationInfo) return null;

  return (
    <div className="p-2">
      <h3 className="text-xl font-bold mt-2 mb-4">Know Your Station</h3>

      {/* Card container */}
      <div className="border shadow-lg rounded-lg p-6">
        <div className="flex items-center gap-24 justify-center">
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
