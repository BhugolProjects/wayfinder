import React from "react";

function SplashScreen({ stationName }) {
  return (
    <main className="flex overflow-hidden flex-col items-center p-5 mx-auto w-full h-[100vh] bg-white max-w-[480px]">
      <header className="flex gap-4 self-start text-neutral-900">
        <img
          loading="lazy"
          src="MMRC.png"
          alt="Mumbai Metro Rail Corporation Logo"
          className="object-contain shrink-0 aspect-square w-[60px]"
        />
        <div className="flex flex-col my-auto">
          <h2 className="text-base font-semibold tracking-tight">
            Mumbai Metro Rail Corporation Ltd.
          </h2>
          <p className="self-start mt-3.5 text-base font-medium tracking-tighter">
            मुंबई मेट्रो रेल कॉर्पोरेशन मर्यादित
          </p>
        </div>
      </header>

      <h1 className="mt-16 text-lg font-bold tracking-tighter text-black">
        {stationName ? (
          <>
            WELCOME TO{" "}
            <span className="italic">{stationName.toUpperCase()}</span> METRO
            STATION
          </>
        ) : (
          "WELCOME TO MUMBAI METRO LINE 3"
        )}
      </h1>

      <img
        src="splash.gif"
        alt="Splash image"
        className="px-6 mt-10 w-40 h-40 text-base tracking-tighter text-center rounded-full bg-zinc-300 text-stone-400 object-cover"
      />

      <div className="mt-16 text-md font-medium tracking-tighter text-center text-mmbutton italic">
        I agree to the{" "}
        <a href="terms" className="underline">
          terms and conditions
        </a>
        <br />
        <a href="/home">
          <button className="px-4 py-2 mt-4 text-sm font-semibold tracking-tighter text-white bg-mmbutton rounded-lg">
            I agree
          </button>
        </a>
      </div>

      <div className="flex gap-3 self-end mt-20 mb-5 text-xs font-semibold tracking-tight text-center text-neutral-600">
        <p className="grow my-auto">Developed by</p>
        <img
          loading="lazy"
          src="bhugol.png"
          alt="Developer logo"
          className="object-contain shrink-0 max-w-full rounded-lg aspect-[4.74] w-[152px]"
        />
      </div>
    </main>
  );
}

export default SplashScreen;
