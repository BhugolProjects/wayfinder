import React from "react";

function StationInfo() {
  return (
    <section className="flex relative flex-col pl-5 mt-28 w-full" aria-label="Station Information">
      <div className="flex gap-10 items-start self-start text-sm tracking-wide text-center text-black">
        <div className="self-end mt-10 border border-white border-solid">
          Grant Road <br /> Metro
        </div>
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/24015e7ea3780863379024c607c98f894262352427aefa8da6a3dde37b2c1621?placeholderIfAbsent=true&apiKey=7ef89099c3de4c4cb9202978a6aad4e3" alt="Station location marker" className="object-contain shrink-0 self-start rounded-none aspect-square shadow-[0px_4px_4px_rgba(0,0,0,0.25)] w-[46px]" />
      </div>
    </section>
  );
}

export default StationInfo;