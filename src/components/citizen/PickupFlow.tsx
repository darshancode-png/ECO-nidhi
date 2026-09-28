import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  Truck,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  Navigation,
  Scale
} from 'lucide-react';
import { WasteCategory, PickupRequest } from '../../types';

export const PickupFlow: React.FC = () => {
  const { pickups, requestPickup, updatePickupStatus, completePickup, navigate } = useGame();

  const [activeTab, setActiveTab] = useState<'create' | 'tracking'>('create');
  const [selectedCategory, setSelectedCategory] = useState<WasteCategory>('plastic');
  const [weightKg, setWeightKg] = useState<number>(15);
  const [address, setAddress] = useState<string>('742 Evergreen Terrace, Sector 4');
  const [scheduledSlot, setScheduledSlot] = useState<string>('Today, Express (Within 2 Hours)');

  const categories: { id: WasteCategory; label: string; icon: string }[] = [
    { id: 'plastic', label: 'Plastics', icon: '🧴' },
    { id: 'ewaste', label: 'E-Waste', icon: '💻' },
    { id: 'metal', label: 'Metals', icon: '🥫' },
    { id: 'organic', label: 'Compost', icon: '🥬' },
    { id: 'paper', label: 'Cardboard', icon: '📦' },
    { id: 'glass', label: 'Glass', icon: '🍾' },
    { id: 'construction', label: 'Debris', icon: '🧱' }
  ];

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    requestPickup(selectedCategory, weightKg, address, scheduledSlot);
    setActiveTab('tracking');
  };

  const activePickups = pickups.filter(p => p.status !== 'completed' && p.status !== 'cancelled');
  const completedPickups = pickups.filter(p => p.status === 'completed');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-24 space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'create' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            New Request
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'tracking' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Tracking ({activePickups.length})
          </button>
        </div>
      </div>

      {activeTab === 'create' ? (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
              Schedule Doorstep Eco-Pickup
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Select category and volume. A verified electric hauler will arrive with digital scales and credit your Eco Coins.
            </p>
          </div>

          <form onSubmit={handleCreateRequest} className="space-y-5">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                1. Select Waste Stream
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {categories.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      selectedCategory === c.id
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-xl">{c.icon}</span>
                    <span className="text-xs font-bold">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Weight */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                <span>2. Estimated Weight</span>
                <span className="text-emerald-700 font-mono-numbers font-bold">{weightKg} kg</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={weightKg}
                onChange={(e) => setWeightKg(parseInt(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono-numbers mt-1">
                <span>5 kg (1 Bag)</span>
                <span>50 kg (Standard Bundle)</span>
                <span>100 kg (Commercial)</span>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                3. Pickup Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-emerald-600" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter house, apartment or street"
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600"
                  required
                />
              </div>
            </div>

            {/* Slot */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                4. Preferred Time Window
              </label>
              <select
                value={scheduledSlot}
                onChange={(e) => setScheduledSlot(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600 cursor-pointer"
              >
                <option value="Today, Express (Within 2 Hours)">⚡ Express (Within 2 Hours)</option>
                <option value="Today, Afternoon 2:00 PM – 4:00 PM">Today, Afternoon (2:00 PM – 4:00 PM)</option>
                <option value="Today, Evening 5:00 PM – 7:00 PM">Today, Evening (5:00 PM – 7:00 PM)</option>
                <option value="Tomorrow Morning 9:00 AM – 11:00 AM">Tomorrow Morning (9:00 AM – 11:00 AM)</option>
              </select>
            </div>

            {/* Reward Card */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between font-mono-numbers">
              <div>
                <div className="text-[11px] text-emerald-800">Guaranteed Minimum Bounty</div>
                <div className="text-sm font-bold text-slate-900 flex items-center gap-3 mt-0.5">
                  <span className="text-amber-800">🪙 +{weightKg * 8 + 40} coins</span>
                  <span className="text-emerald-800">⚡ +{weightKg * 5 + 30} XP</span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-white px-2.5 py-1 rounded-full border border-emerald-200">
                Zero Pickup Fee
              </span>
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wide shadow-xs active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Confirm & Dispatch Nearby Collector</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-base font-display font-bold text-slate-900">
            Active Pickups In Motion
          </h2>

          {activePickups.length === 0 ? (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-8 text-center space-y-3 shadow-xs">
              <Truck className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500">No pickups currently en route.</p>
              <button
                onClick={() => setActiveTab('create')}
                className="px-4 py-2 bg-emerald-600 text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Schedule New Collection
              </button>
            </div>
          ) : (
            activePickups.map((p) => {
              const statusOrder: PickupRequest['status'][] = ['pending', 'accepted', 'en_route', 'weighing', 'completed'];
              const currentStep = statusOrder.indexOf(p.status);

              return (
                <div
                  key={p.id}
                  className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 uppercase">
                          {p.category} Recycling
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono-numbers font-medium">
                          {p.estimatedWeightKg} kg est.
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{p.pickupAddress}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-emerald-700 font-bold font-mono-numbers">
                        🪙 +{p.coinsReward} Bounty
                      </div>
                      <div className="text-[11px] text-slate-500">{p.scheduledTime}</div>
                    </div>
                  </div>

                  {/* Route Visualizer */}
                  <div className="relative h-24 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden">
                    <div className="flex items-center justify-between w-3/4 max-w-sm relative">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] text-slate-600 mt-1">Your Door</span>
                      </div>

                      <div className="flex-1 mx-3 border-t-2 border-dashed border-emerald-400 relative flex items-center justify-center">
                        <Truck className="w-5 h-5 text-emerald-700 absolute" />
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                          <Navigation className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] text-slate-600 mt-1">
                          {p.collectorName || 'Eco-Hauler'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stepper */}
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {[
                      { step: 0, label: 'Dispatched' },
                      { step: 1, label: 'Assigned' },
                      { step: 2, label: 'En Route' },
                      { step: 3, label: 'Scale Weighing' }
                    ].map((st) => (
                      <div key={st.step} className="text-center">
                        <div
                          className={`h-1.5 rounded-full mb-1 ${
                            currentStep >= st.step ? 'bg-emerald-600' : 'bg-slate-200'
                          }`}
                        />
                        <span
                          className={`text-[10px] font-medium ${
                            currentStep >= st.step ? 'text-emerald-800' : 'text-slate-400'
                          }`}
                        >
                          {st.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Actions for prototype demo */}
                  <div className="pt-2 flex items-center justify-end gap-2">
                    {p.status !== 'weighing' && (
                      <button
                        onClick={() => updatePickupStatus(p.id, 'weighing')}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        Simulate Hauler Arrival
                      </button>
                    )}
                    {p.status === 'weighing' && (
                      <button
                        onClick={() => completePickup(p.id, p.estimatedWeightKg)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Scale className="w-3.5 h-3.5" />
                        <span>Confirm {p.estimatedWeightKg} kg & Collect Bounty</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Past History */}
          {completedPickups.length > 0 && (
            <div className="space-y-2 pt-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Completed Pickups Log
              </h3>
              {completedPickups.slice(0, 3).map((cp) => (
                <div
                  key={cp.id}
                  className="bg-white border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-bold text-slate-900 capitalize">{cp.category} Collection</div>
                      <div className="text-[11px] text-slate-500 font-mono-numbers">
                        Verified {cp.verifiedWeightKg || cp.estimatedWeightKg} kg · Handled by {cp.collectorName || 'Collector'}
                      </div>
                    </div>
                  </div>
                  <span className="font-mono-numbers font-bold text-emerald-700">
                    🪙 +{cp.coinsReward}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
