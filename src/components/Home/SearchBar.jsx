import React from "react";

function SearchBar() {
  return (
    <form className="flex gap-3 px-4 py-3.5 mt-3 text-sm font-light tracking-wide text-black rounded-3xl border border-solid border-neutral-500">
      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/cfdccf3b5e9bd811057a27a5bb7fb10b898413324bc30c0e76f5bd43a4d5e0fc?placeholderIfAbsent=true&apiKey=7ef89099c3de4c4cb9202978a6aad4e3" alt="" className="object-contain shrink-0 self-start aspect-square w-[17px]" />
      <label htmlFor="stationSearch" className="sr-only">Search for a station</label>
      <input
        type="text"
        id="stationSearch"
        className="flex-auto w-[291px] bg-transparent border-none outline-none"
        placeholder="Search for a station"
      />
    </form>
  );
}

export default SearchBar;