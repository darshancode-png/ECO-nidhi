import React from 'react';
import { useGame } from '../../context/GameContext';
import { Icon3D } from '../common/Icon3D';
import {
  ArrowLeft,
  Leaf,
  Droplet,
  TreePine,
  Wind,
  Truck,
  CheckCircle2,
  Calendar,
  Share2,
  Award,
  TrendingUp
} from 'lucide-react';

export const ImpactDashboard: React.FC = () => {
  const { user, pickups, navigate, cityStage } = useGame();

  const completedPickups = pickups.filter(p => p.status === 'completed');

  const landfillVolumeM3 = (user.totalRecycledKg * 0.0032).toFixed(2);
  const electricityKwhSaved = Math.round(user.totalRecycledKg * 1.8);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 pb-28 space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-mono-numbers">
          Verified Ecological Audit
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
          Personal Ecological Impact
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg">
          Track your real-world contribution to municipal waste diversion, carbon reduction, and landfill conservation.
        </p>
      </div>

      {/* Main Impact Hero Card */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Total Diversion Metric
            </span>
            <div className="text-4xl sm:text-5xl font-display font-bold mt-1 font-mono-numbers">
              {user.totalRecycledKg} <span className="text-xl sm:text-2xl text-emerald-200 font-normal">kg</span>
            </div>
            <p className="text-xs text-emerald-100 mt-1 max-w-sm">
              Certified secondary materials diverted from rotting in open landfill sites across {cityStage}.
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/20 self-start sm:self-auto">
            <span className="text-[11px] text-emerald-200 font-sans">Green Score</span>
            <span className="text-2xl font-bold font-mono-numbers">{user.greenScore} pts</span>
            <span className="text-[10px] text-emerald-200 font-mono-numbers">Top 5% in Sector</span>
          </div>
        </div>

        {/* 4 Environmental Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 relative z-10 font-mono-numbers text-center">
          <div className="bg-white/15 backdrop-blur-xs p-3.5 rounded-2xl border border-white/20">
            <Wind className="w-5 h-5 mx-auto mb-1 text-emerald-200" />
            <span className="text-[10px] text-emerald-200 font-sans block">CO₂ AVOIDED</span>
            <span className="text-base font-bold mt-0.5 block">{user.co2DivertedKg} kg</span>
          </div>

          <div className="bg-white/15 backdrop-blur-xs p-3.5 rounded-2xl border border-white/20">
            <TreePine className="w-5 h-5 mx-auto mb-1 text-emerald-200" />
            <span className="text-[10px] text-emerald-200 font-sans block">TREES EQUIVALENT</span>
            <span className="text-base font-bold mt-0.5 block">{user.treesSaved} 🌳</span>
          </div>

          <div className="bg-white/15 backdrop-blur-xs p-3.5 rounded-2xl border border-white/20">
            <Droplet className="w-5 h-5 mx-auto mb-1 text-sky-200" />
            <span className="text-[10px] text-sky-200 font-sans block">WATER PRESERVED</span>
            <span className="text-base font-bold mt-0.5 block">{user.waterSavedLiters} L</span>
          </div>

          <div className="bg-white/15 backdrop-blur-xs p-3.5 rounded-2xl border border-white/20">
            <Leaf className="w-5 h-5 mx-auto mb-1 text-amber-200" />
            <span className="text-[10px] text-amber-200 font-sans block">LANDFILL AIR SAVED</span>
            <span className="text-base font-bold mt-0.5 block">{landfillVolumeM3} m³</span>
          </div>
        </div>
      </div>

      {/* Pickup History Log */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-slate-900 text-base">
              Verified Collection History
            </h3>
            <p className="text-xs text-slate-500">
              Official receipts from doorstep electric hauler visits
            </p>
          </div>

          <span className="text-xs text-slate-500 font-mono-numbers">
            {completedPickups.length} Pickups Completed
          </span>
        </div>

        {completedPickups.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <Truck className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-600">No completed pickups yet.</p>
            <button
              onClick={() => navigate('pickup')}
              className="mt-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              Schedule Your First Pickup
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {completedPickups.map((p) => (
              <div key={p.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center p-1 shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 capitalize">
                      {p.category} Waste Collection
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {p.pickupAddress} · Collector: {p.collectorName || 'Municipal Team'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:text-right font-mono-numbers self-end sm:self-auto">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {p.verifiedWeightKg || p.estimatedWeightKg} kg verified
                    </span>
                    <span className="text-[10px] text-slate-400">{p.completedAt || p.requestedAt}</span>
                  </div>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80">
                    +{p.coinsReward} Coins
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Community Contribution & Swachh Ward Context */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-3">
        <h3 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>Municipal Ward Contribution</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Your neighborhood has diverted a collective <strong>7,820 kg</strong> of waste this quarter. Decentralized source segregation saves local municipal bodies an estimated ₹4,200 per ton in transport and landfill dumping costs.
        </p>
      </div>
    </div>
  );
};
