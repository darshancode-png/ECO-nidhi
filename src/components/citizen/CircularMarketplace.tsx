import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Icon3D } from '../common/Icon3D';
import {
  PlusCircle,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { WasteCategory } from '../../types';

export const CircularMarketplace: React.FC = () => {
  const {
    marketItems,
    user,
    buyMarketItem,
    sellMarketItem,
    navigate
  } = useGame();

  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [sellName, setSellName] = useState('Clean Plastic Flakes');
  const [sellCategory, setSellCategory] = useState<WasteCategory>('plastic');
  const [sellPrice, setSellPrice] = useState(15);
  const [sellQty, setSellQty] = useState(10);

  const handleSellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sellMarketItem(sellName, sellCategory, sellPrice, sellQty);
    setSellModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 pb-28 space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <button
          onClick={() => setSellModalOpen(true)}
          className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>List Material for Sale</span>
        </button>
      </div>

      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 mx-auto flex items-center justify-center p-2 shadow-2xs">
          <Icon3D name="market" size="md" animate={true} fluidHover={true} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
          Circular Commodity Exchange
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Trade certified secondary raw materials with verified local industries, organic farms, and certified recyclers.
        </p>
      </div>

      {/* Market Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {marketItems.map((item) => {
          const canAfford = user.ecoCoins >= item.pricePerUnit;

          return (
            <div
              key={item.id}
              className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4 fluid-card"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono-numbers">
                    {item.category}
                  </span>
                  <span className="text-xs text-emerald-800 font-mono-numbers font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{item.buyerType}</span>
                  </span>
                </div>

                <h3 className="font-display font-bold text-slate-900 text-base mt-2">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Packaging & Pricing */}
                <div className="mt-3 p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex items-center justify-between font-mono-numbers">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Unit Packaging</span>
                    <span className="text-xs font-semibold text-slate-800">{item.unit}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Price Per Unit</span>
                    <div className="flex items-center gap-1 justify-end text-sm font-bold text-amber-800">
                      <Icon3D name="coin" size="xs" fluidHover={false} />
                      <span>{item.pricePerUnit}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500 font-mono-numbers">
                  {item.availableQuantity} in stock
                </span>

                <button
                  onClick={() => buyMarketItem(item.id, 1)}
                  disabled={!canAfford || item.availableQuantity <= 0}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-mono-numbers transition-all cursor-pointer ${
                    canAfford && item.availableQuantity > 0
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-95'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Buy 1 Unit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sell Listing Modal */}
      {sellModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-display font-bold text-slate-900">
              List Material for Sale
            </h3>
            <form onSubmit={handleSellSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product / Batch Name
                </label>
                <input
                  type="text"
                  value={sellName}
                  onChange={(e) => setSellName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={sellCategory}
                    onChange={(e) => setSellCategory(e.target.value as WasteCategory)}
                    className="w-full h-10 px-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-600 cursor-pointer"
                  >
                    <option value="plastic">Plastic</option>
                    <option value="organic">Organic</option>
                    <option value="paper">Paper</option>
                    <option value="metal">Metal</option>
                    <option value="glass">Glass</option>
                    <option value="ewaste">E-Waste</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Price per Unit (🪙)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(parseInt(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono-numbers"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quantity Available
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={sellQty}
                  onChange={(e) => setSellQty(parseInt(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono-numbers"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSellModalOpen(false)}
                  className="flex-1 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Confirm & List Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
