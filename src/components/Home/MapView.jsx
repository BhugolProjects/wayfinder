import React from "react";
import { useNavigate } from "react-router-dom";

function MapView() {
  const navigate = useNavigate();
  const handleViewMap = () => {
    navigate("/map");
  };
  return (
    <section className="flex overflow-hidden relative flex-col items-start pt-32 pr-4 pb-4 pl-16 mt-5 font-medium rounded-lg aspect-[1.209]">
      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/6314604d9afe6a96c21b0e7018b624984fca41271c0f3e8997c7be94e63bd086?placeholderIfAbsent=true&apiKey=7ef89099c3de4c4cb9202978a6aad4e3" alt="Map background" className="object-cover absolute inset-0 size-full" />
      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/79761cab4045b2959738e9e1d6b00b6b14a34f13ae01786fcd8d18c89f090aa5?placeholderIfAbsent=true&apiKey=7ef89099c3de4c4cb9202978a6aad4e3" alt="" className="object-contain ml-5 w-10 aspect-[0.87]" />
      {/* <div className="relative text-xs text-black border-2 border-white border-solid">
        Aarey Colony
      </div> */}
      <button className="relative self-end px-3 py-1 text-xs text-white rounded-lg bg-black bg-opacity-80"  onClick={handleViewMap}>
        View Map
      </button>
    </section>
  );
}

export default MapView;