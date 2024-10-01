import React from 'react';

function SplashScreen({ stationName }) {
  return (
    <main className="flex overflow-hidden flex-col items-center p-5 mx-auto w-full bg-white max-w-[480px]">

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

      <h1 className="mt-48 text-xl font-bold tracking-tighter text-black">
        WELCOME TO LINE 3 WAYFINDER
      </h1>

      <div className="px-6 mt-16 w-40 h-40 text-base tracking-tighter text-center rounded-full bg-zinc-300 text-stone-400">
        LOGO
        <br />
        PLACEHOLDER
      </div>

      <p className="mt-16 text-lg font-medium tracking-tighter text-center text-violet-900">
        {stationName ? `YOU ARE AT ${stationName.toUpperCase()} METRO STATION` : ''}
      </p>

      <footer className="flex gap-3 self-end mt-52 text-xs font-semibold tracking-tight text-center text-neutral-600">
        <p className="grow my-auto">Developed by</p>
        <img
          loading="lazy"
          src="bhugol.png"
          alt="Developer logo"
          className="object-contain shrink-0 max-w-full rounded-lg aspect-[4.74] w-[152px]"
        />
      </footer>

    </main>
  );
}

export default SplashScreen;
