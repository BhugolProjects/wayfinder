import React from "react";

function ProgressBar() {
  return (
    <div className="flex items-start self-end mt-48">
      <div className="flex shrink-0 mt-1.5 bg-emerald-200 h-[29px] w-[154px]" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
      <div className="flex shrink-0 self-stretch w-0.5 bg-slate-300 h-[35px]"></div>
      <div className="flex shrink-0 mt-1.5 bg-stone-200 h-[29px] w-[49px]" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
  );
}

export default ProgressBar;