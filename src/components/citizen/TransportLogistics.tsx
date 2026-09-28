import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  Truck,
  Navigation,
  ArrowLeft
} from 'lucide-react';

export const TransportLogistics: React.FC = () => {
  const {
    trucks,
    user,
    upgradeTruck,
    buyTruck,
    dispatchTruck,
    navigate
  } = useGame();

  const [selectedRoute, setSelectedRoute] = useState<{ name: string; distanceKm: number; cargoKg: number }>({
    name: 'Sector 4 Residential -> Materials Recovery Facility',
    distanceKm: 8,
    cargoKg: 120
  });

  const routes = [
    { name: 'Sector 4 Residential -> Materials Recovery Facility', distanceKm: 8, cargoKg: 120 },
    { name: 'Downtown Commercial Strip -> Biogas Cogeneration Plant', distanceKm: 14, cargoKg: 280 },
    { name: 'Silicon Tech Park -> Urban E-Waste Refinery', distanceKm: 22, cargoKg: 450 },
    { name: 'Harbor Shipping Docks -> Circular Aggregates Foundry', distanceKm: 30, cargoKg: 850 }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-24 space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
        <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-semibold font-mono-numbers">
          Zero-Emission Fleet Active
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
          Logistics & Vehicle Fleet
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg">
          Upgrade electric and bio-CNG collection haulers, dispatch routes between municipal districts, and earn transit rewards.
        </p>
      </div>

      {/* Route Selector Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2 shadow-xs">
        <span className="text-xs font-semibold text-slate-700">Select Collection Route:</span>
        <select
          value={selectedRoute.name}
          onChange={(e) => {
            const found = routes.find(r => r.name === e.target.value);
            if (found) setSelectedRoute(found);
          }}
          className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600 cursor-pointer"
        >
          {routes.map((r) => (
            <option key={r.name} value={r.name}>
              {r.name} ({r.distanceKm} km · {r.cargoKg} kg load)
            </option>
          ))}
        </select>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trucks.map((truck) => {
          const canAffordUpgrade = user.ecoCoins >= truck.upgradeCost;
          const isBusy = !!truck.activeTrip;

          return (
            <div
              key={truck.id}
              className={`rounded-3xl p-5 border flex flex-col justify-between space-y-4 shadow-xs transition-all ${
                truck.isOwned
                  ? 'bg-white border-slate-200/90'
                  : 'bg-slate-50 border-dashed border-slate-300 opacity-90'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display font-bold text-slate-900 text-base">
                      {truck.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono-numbers mt-0.5">
                      <span>Tier {truck.tier}</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-medium">{truck.energyType}</span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono-numbers ${
                      truck.isOwned
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {truck.isOwned ? 'OWNED' : 'LOCKED'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 bg-slate-50 p-3 rounded-2xl border border-slate-200 font-mono-numbers text-center">
                  <div>
                    <div className="text-[10px] text-slate-500">Max Speed</div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">{truck.speedKmH} km/h</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">Capacity</div>
                    <div className="text-xs font-bold text-emerald-700 mt-0.5">{truck.capacityKg} kg</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">CO₂ Saved</div>
                    <div className="text-xs font-bold text-teal-700 mt-0.5">-{truck.co2SavedPerTrip} kg</div>
                  </div>
                </div>
              </div>

              <div>
                {truck.isOwned ? (
                  isBusy ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 space-y-2">
                      <div className="flex justify-between text-xs font-mono-numbers">
                        <span className="text-emerald-800 font-bold flex items-center gap-1.5">
                          <Navigation className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                          <span>Delivering...</span>
                        </span>
                        <span className="text-slate-600 font-medium">
                          {truck.activeTrip?.remainingSeconds}s remaining
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full transition-all duration-1000"
                          style={{
                            width: `${Math.round(
                              ((truck.activeTrip!.durationSeconds - truck.activeTrip!.remainingSeconds) /
                                truck.activeTrip!.durationSeconds) *
                                100
                            )}%`
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() =>
                          dispatchTruck(
                            truck.id,
                            selectedRoute.name,
                            Math.min(truck.capacityKg, selectedRoute.cargoKg)
                          )
                        }
                        className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wide shadow-xs active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Dispatch on Selected Route</span>
                      </button>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-500">
                          Upgrade (+10 km/h, +25% cargo)
                        </span>
                        <button
                          onClick={() => upgradeTruck(truck.id)}
                          disabled={!canAffordUpgrade}
                          className={`px-3 py-1 rounded-xl text-[11px] font-bold font-mono-numbers cursor-pointer transition-colors ${
                            canAffordUpgrade
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          Upgrade · 🪙 {truck.upgradeCost}
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => buyTruck(truck.id)}
                    disabled={!canAffordUpgrade}
                    className={`w-full h-10 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      canAffordUpgrade
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-98'
                        : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <span>Purchase Vehicle</span>
                    <span className="font-mono-numbers">· 🪙 {truck.upgradeCost}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
