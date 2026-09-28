import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  Truck,
  BatteryCharging,
  MapPin,
  CheckCircle2,
  Scale,
  QrCode
} from 'lucide-react';
import { PickupRequest } from '../../types';

export const CollectorPortal: React.FC = () => {
  const {
    pickups,
    acceptPickup,
    updatePickupStatus,
    completePickup,
    user
  } = useGame();

  const [activeJobId, setActiveJobId] = useState<string | null>(() => {
    const enRoute = pickups.find(p => p.status === 'en_route' || p.status === 'accepted' || p.status === 'weighing');
    return enRoute ? enRoute.id : null;
  });

  const [scaleInputWeight, setScaleInputWeight] = useState<number>(18.5);
  const [showQrVerified, setShowQrVerified] = useState<boolean>(false);

  const activeJob = pickups.find(p => p.id === activeJobId);
  const pendingRequests = pickups.filter(p => p.status === 'pending');
  const completedJobs = pickups.filter(p => p.status === 'completed');

  const handleAccept = (req: PickupRequest) => {
    acceptPickup(req.id, user.name);
    updatePickupStatus(req.id, 'en_route');
    setActiveJobId(req.id);
    setScaleInputWeight(req.estimatedWeightKg);
  };

  const handleArrived = (jobId: string) => {
    updatePickupStatus(jobId, 'weighing');
  };

  const handleVerifyAndFinish = (jobId: string) => {
    completePickup(jobId, scaleInputWeight);
    setActiveJobId(null);
    setShowQrVerified(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-24 space-y-6">
      {/* Collector Telemetry Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-800 font-bold uppercase tracking-wider">
              <Truck className="w-4 h-4 text-amber-600" />
              <span>Certified Eco-Hauler Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-1">
              Collector Dispatch Command
            </h1>
            <p className="text-xs text-slate-500">
              Sector 4 & 5 Urban Zone · Assigned Unit: VoltTrike Cargo Pod #204
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 shrink-0 font-mono-numbers">
            <div>
              <div className="text-[10px] text-slate-500">Today's Bounty</div>
              <div className="text-base font-bold text-amber-800">🪙 +860 coins</div>
            </div>
            <div className="h-7 w-px bg-slate-200" />
            <div>
              <div className="text-[10px] text-slate-500">Truck Battery</div>
              <div className="text-base font-bold text-emerald-700 flex items-center gap-1">
                <BatteryCharging className="w-4 h-4 text-emerald-600" />
                <span>88%</span>
              </div>
            </div>
            <div className="h-7 w-px bg-slate-200" />
            <div>
              <div className="text-[10px] text-slate-500">Runs Done</div>
              <div className="text-base font-bold text-slate-900">
                {completedJobs.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Assignment */}
      {activeJob && (
        <div className="bg-white border-2 border-emerald-400 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs uppercase font-bold text-emerald-800 font-mono-numbers">
                Active Assignment #{activeJob.id}
              </span>
            </div>
            <span className="text-xs text-amber-800 font-bold font-mono-numbers">
              🪙 +{activeJob.coinsReward} Bounty
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-display font-bold text-slate-900 capitalize">
                  {activeJob.category} Waste Collection
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{activeJob.pickupAddress}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Resident:</span>
                  <span className="font-bold text-slate-900">{activeJob.citizenName}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Phone:</span>
                  <span className="text-emerald-700 font-mono-numbers font-medium">{activeJob.citizenPhone}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Estimated Volume:</span>
                  <span className="font-bold text-slate-900 font-mono-numbers">{activeJob.estimatedWeightKg} kg</span>
                </div>
              </div>

              {activeJob.status === 'en_route' && (
                <button
                  onClick={() => handleArrived(activeJob.id)}
                  className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Mark Arrived & Open Bluetooth Scale</span>
                </button>
              )}
            </div>

            {/* Bluetooth Scale card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  <span>Digital Scale Tare & Measure</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold font-mono-numbers">
                  Calibrated ✓
                </span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 text-center">
                <div className="text-[10px] text-slate-500 font-mono-numbers">Verified Weight</div>
                <div className="text-3xl font-bold text-slate-900 font-mono-numbers mt-0.5">
                  {scaleInputWeight.toFixed(1)} <span className="text-sm font-normal text-slate-500">kg</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="0.5"
                  value={scaleInputWeight}
                  onChange={(e) => setScaleInputWeight(parseFloat(e.target.value))}
                  className="w-3/4 mx-auto accent-emerald-600 mt-2 cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowQrVerified(true)}
                  className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                    showQrVerified
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-white border-slate-300 text-slate-700'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{showQrVerified ? 'Resident QR Signed ✓' : 'Scan Resident QR'}</span>
                </button>

                <button
                  onClick={() => handleVerifyAndFinish(activeJob.id)}
                  disabled={activeJob.status === 'en_route'}
                  className={`px-4 py-2 rounded-xl font-semibold text-xs font-mono-numbers transition-all cursor-pointer ${
                    activeJob.status === 'weighing'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-95'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Complete & Earn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Available Requests Pool */}
      <div className="space-y-3">
        <h2 className="text-base font-display font-bold text-slate-900">
          Available Pickup Requests Nearby ({pendingRequests.length})
        </h2>

        {pendingRequests.length === 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 text-center text-xs text-slate-500 shadow-xs">
            No pending requests in your sector currently. All neighborhood bins serviced!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-xs"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono-numbers">
                      {req.category}
                    </span>
                    <span className="text-xs font-bold text-amber-800 font-mono-numbers">
                      🪙 +{req.coinsReward} Bounty
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mt-2">
                    {req.citizenName} · {req.estimatedWeightKg} kg
                  </h4>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{req.pickupAddress}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono-numbers">
                    {req.scheduledTime}
                  </span>
                  <button
                    onClick={() => handleAccept(req)}
                    disabled={!!activeJob}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      !activeJob
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Accept & Dispatch
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed log */}
      {completedJobs.length > 0 && (
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            Shift Completion Log
          </h3>
          {completedJobs.slice(0, 3).map((cj) => (
            <div
              key={cj.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between text-xs font-mono-numbers shadow-xs"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-900 font-medium capitalize">
                  {cj.category} Pickup ({cj.verifiedWeightKg || cj.estimatedWeightKg} kg)
                </span>
                <span className="text-slate-500">· {cj.pickupAddress.slice(0, 20)}...</span>
              </div>
              <span className="text-emerald-700 font-bold">🪙 +{cj.coinsReward}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
