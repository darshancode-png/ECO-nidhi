import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  ShieldAlert,
  BarChart3,
  Factory,
  Truck,
  Users,
  Download
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const {
    plants,
    trucks,
    pickups
  } = useGame();

  const [activeTab, setActiveTab] = useState<'analytics' | 'facilities' | 'collectors' | 'pickups'>('analytics');

  const streamBreakdown = [
    { name: 'Plastics (rPET / HDPE)', percent: 34, kg: 5038, color: 'bg-amber-500' },
    { name: 'Organics & Humus', percent: 28, kg: 4150, color: 'bg-emerald-500' },
    { name: 'Paper & Cardboard', percent: 16, kg: 2371, color: 'bg-blue-500' },
    { name: 'Secondary Metals', percent: 12, kg: 1778, color: 'bg-indigo-500' },
    { name: 'E-Waste & Batteries', percent: 10, kg: 1482, color: 'bg-purple-500' }
  ];

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Metric,Value,Unit\n" +
      "Total Municipal Waste Diverted,14820,kg\n" +
      "Diversion Rate,84.6,%\n" +
      "CO2 Emissions Diverted,29640,kg\n" +
      "Active Collectors,18,drivers\n" +
      "Certified Facilities Throughput,98.2,%\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EcoNidhi_Municipal_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-24 space-y-6">
      {/* Admin Executive Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-blue-800 font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-blue-600" />
              <span>Municipal Operations Authority</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-1">
              Urban Circular Administration
            </h1>
            <p className="text-xs text-slate-500">
              City District 07 Central Command · Live Real-Time Sensors Active
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export ESG CSV Report</span>
          </button>
        </div>

        {/* 4 KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono-numbers pt-2">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="text-[10px] text-slate-500">Total Waste Diverted</div>
            <div className="text-xl font-bold text-emerald-800 mt-0.5">14,820 kg</div>
            <div className="text-[10px] text-emerald-700 mt-0.5 font-medium">↑ +18.4% this month</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="text-[10px] text-slate-500">Landfill Diversion Rate</div>
            <div className="text-xl font-bold text-teal-800 mt-0.5">84.6%</div>
            <div className="text-[10px] text-teal-700 mt-0.5 font-medium">Target: 85% by Q4</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="text-[10px] text-slate-500">Active Collectors</div>
            <div className="text-xl font-bold text-amber-800 mt-0.5">18 Fleet Units</div>
            <div className="text-[10px] text-slate-500 mt-0.5">100% Zero-Emission</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="text-[10px] text-slate-500">Plant Throughput</div>
            <div className="text-xl font-bold text-blue-800 mt-0.5">98.2%</div>
            <div className="text-[10px] text-slate-500 mt-0.5">7 of 7 Mills Online</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'analytics', label: 'Waste Analytics', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'facilities', label: 'Facilities Status', icon: <Factory className="w-4 h-4" /> },
          { id: 'collectors', label: 'Collector Fleet', icon: <Truck className="w-4 h-4" /> },
          { id: 'pickups', label: 'Pickup Ledger', icon: <Users className="w-4 h-4" /> }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === t.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-4">
          <h3 className="font-display font-bold text-slate-900 text-base">
            Material Stream Volume Breakdown
          </h3>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
            {streamBreakdown.map((s) => (
              <div
                key={s.name}
                className={`${s.color} h-full`}
                style={{ width: `${s.percent}%` }}
                title={`${s.name}: ${s.percent}%`}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {streamBreakdown.map((s) => (
              <div
                key={s.name}
                className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-3 h-3 rounded-full ${s.color}`} />
                  <div>
                    <div className="font-bold text-xs text-slate-900">{s.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono-numbers">
                      {s.kg.toLocaleString()} kg diverted
                    </div>
                  </div>
                </div>
                <span className="font-bold text-sm text-slate-900 font-mono-numbers">
                  {s.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Facilities Tab */}
      {activeTab === 'facilities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plants.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-slate-200/90 rounded-3xl p-5 flex flex-col justify-between space-y-3 shadow-xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{p.name}</h4>
                  <div className="text-xs text-slate-500 font-mono-numbers mt-0.5">
                    {p.inputName} → {p.outputName}
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono-numbers">
                  ONLINE · {p.efficiency}%
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center font-mono-numbers text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Level</span>
                  <span className="font-bold text-slate-800">{p.level} / {p.maxLevel}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Capacity</span>
                  <span className="font-bold text-emerald-700">{p.batchCapacityKg} kg</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Status</span>
                  <span className="font-bold text-slate-800">
                    {p.isProcessing ? 'Batching' : 'Ready'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Collectors Tab */}
      {activeTab === 'collectors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trucks.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-slate-200/90 rounded-3xl p-5 space-y-3 shadow-xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                  <div className="text-xs text-slate-500 font-mono-numbers mt-0.5">
                    {t.energyType} · Max {t.speedKmH} km/h
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono-numbers">
                  Assigned Sector 4
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-mono-numbers">
                <div>
                  <span className="text-slate-500">Payload: </span>
                  <span className="font-bold text-slate-900">{t.capacityKg} kg</span>
                </div>
                <div>
                  <span className="text-slate-500">CO₂ Saved: </span>
                  <span className="font-bold text-emerald-700">-{t.co2SavedPerTrip} kg/run</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pickups Tab */}
      {activeTab === 'pickups' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 space-y-3 shadow-xs">
          <h3 className="font-display font-bold text-slate-900 text-base">
            Municipal Pickup Ledger
          </h3>
          <div className="space-y-2">
            {pickups.map((p) => (
              <div
                key={p.id}
                className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono-numbers"
              >
                <div>
                  <div className="font-bold text-slate-900 capitalize">
                    {p.citizenName} · {p.category} ({p.estimatedWeightKg} kg)
                  </div>
                  <div className="text-slate-500 text-[11px]">{p.pickupAddress}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                      p.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {p.status}
                  </span>
                  <span className="text-amber-800 font-bold">🪙 {p.coinsReward}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
