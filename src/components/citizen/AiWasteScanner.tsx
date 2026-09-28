import React, { useState, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { WASTE_ITEMS, WasteItemCatalog } from '../../data/mockData';
import { sound } from '../../utils/audio';
import { Icon3D } from '../common/Icon3D';
import {
  Camera,
  Upload,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Info,
  Truck,
  MapPin,
  ExternalLink,
  Compass,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { WasteCategory } from '../../types';
import { findItemDropoffWithMaps, GroundedPlace, getBrowserLocation } from '../../utils/mapsApi';

export const AiWasteScanner: React.FC = () => {
  const { recordScanWaste, navigate } = useGame();

  const [selectedItem, setSelectedItem] = useState<WasteItemCatalog>(WASTE_ITEMS[0]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanComplete, setScanComplete] = useState<boolean>(false);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [customWeight, setCustomWeight] = useState<number>(0.5);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Google Maps Grounding drop-off state
  const [isFindingDropoffs, setIsFindingDropoffs] = useState<boolean>(false);
  const [groundedDropoffs, setGroundedDropoffs] = useState<GroundedPlace[]>([]);
  const [groundedGuidance, setGroundedGuidance] = useState<string>('');
  const [showDropoffCard, setShowDropoffCard] = useState<boolean>(false);
  const [dropoffError, setDropoffError] = useState<string | null>(null);

  const startScan = (itemToScan: WasteItemCatalog = selectedItem) => {
    sound.playScan();
    setIsScanning(true);
    setScanComplete(false);
    setShowDropoffCard(false);

    setTimeout(() => {
      sound.playCorrect();
      setIsScanning(false);
      setScanComplete(true);
      setSelectedItem(itemToScan);
    }, 900);
  };

  const handleSelectSample = (sample: WasteItemCatalog) => {
    setSelectedItem(sample);
    setUploadedPreview(null);
    startScan(sample);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedPreview(event.target?.result as string);
        const randomItem = WASTE_ITEMS[Math.floor(Math.random() * WASTE_ITEMS.length)];
        startScan(randomItem);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClaim = () => {
    sound.playCoinReward();
    recordScanWaste(selectedItem.category, selectedItem.name, customWeight);
    setScanComplete(false);
  };

  const handleFindDropoffs = async () => {
    setIsFindingDropoffs(true);
    setShowDropoffCard(true);
    setDropoffError(null);

    let coords = null;
    try {
      coords = await getBrowserLocation();
    } catch {
      // Fallback without coordinates
    }

    try {
      const res = await findItemDropoffWithMaps({
        itemName: selectedItem.name,
        category: selectedItem.category,
        latLng: coords,
        city: 'Bengaluru',
      });

      if (res.success && res.places?.length > 0) {
        setGroundedDropoffs(res.places);
        setGroundedGuidance(res.text || '');
      } else {
        // Fallback default list
        setGroundedDropoffs([
          {
            title: `Local Dry Waste Collection Centre (DWCC)`,
            uri: `https://www.google.com/maps/search/?api=1&query=Dry+Waste+Collection+Centre`,
            snippets: [`Verified municipal center accepting ${selectedItem.name} and segregated dry recyclables.`],
            type: 'maps',
          },
          {
            title: `Authorized Scrap Dealer / Kabadiwala`,
            uri: `https://www.google.com/maps/search/?api=1&query=Scrap+Dealer+Kabadiwala`,
            snippets: [`Instant cash per kilogram for sorted ${selectedItem.category} materials.`],
            type: 'maps',
          }
        ]);
        setGroundedGuidance(res.text || '');
      }
    } catch (err: any) {
      setDropoffError(err.message || 'Unable to load Google Maps drop-offs');
    } finally {
      setIsFindingDropoffs(false);
    }
  };

  const categoryBinColors: Record<WasteCategory, { bg: string; text: string; border: string; binName: string }> = {
    plastic: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', binName: 'Yellow Bin (Plastics)' },
    organic: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', binName: 'Green Bin (Compost)' },
    paper: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', binName: 'Blue Bin (Paper)' },
    glass: { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200', binName: 'Teal Bin (Glass)' },
    metal: { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300', binName: 'Silver Bin (Metals)' },
    ewaste: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200', binName: 'Violet Bin (E-Waste)' },
    construction: { bg: 'bg-stone-100', text: 'text-stone-800', border: 'border-stone-300', binName: 'Brown Bin (Aggregates)' }
  };

  const currentBin = categoryBinColors[selectedItem.category];

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
        <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-semibold font-mono-numbers">
          AI Vision v3.4 Active
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
          AI Optical Waste Scanner
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg">
          Point camera or upload a photo to immediately detect recycling category, proper disposal method, and earn Eco Coins.
        </p>
      </div>

      {/* Main Scanner Container */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Left: Viewfinder Camera Area */}
          <div className="relative aspect-square max-w-xs mx-auto w-full bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center overflow-hidden">
            {uploadedPreview ? (
              <img
                src={uploadedPreview}
                alt="Scanned Item"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="p-6 text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{selectedItem.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{selectedItem.sampleImgDescription}</div>
                </div>
              </div>
            )}

            {/* Scanning line animation */}
            {isScanning && (
              <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none">
                <div className="w-full h-1 bg-emerald-600 shadow-md animate-bounce" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-emerald-900 bg-white/90 px-3 py-1 rounded-full border border-emerald-200 shadow-xs">
                    Analyzing Material...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Detected Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${currentBin.bg} ${currentBin.text} border ${currentBin.border}`}>
                {selectedItem.category}
              </span>
              <span className="text-xs text-emerald-700 font-semibold font-mono-numbers">
                98.4% Confidence
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
                {selectedItem.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                <span>{currentBin.binName}</span>
                <span>·</span>
                <span className="text-emerald-700 font-semibold font-mono-numbers">
                  ~{(customWeight * selectedItem.co2SavedKg * 4).toFixed(2)} kg CO₂ diverted
                </span>
              </div>
            </div>

            {/* Disposal Guidance */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Recommended Disposal Steps:</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {selectedItem.tip}
              </p>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{selectedItem.trivia}</span>
              </div>
            </div>

            {/* Weight Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Batch Weight</span>
                <span className="text-emerald-700 font-mono-numbers font-bold">{customWeight} kg</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="5.0"
                step="0.1"
                value={customWeight}
                onChange={(e) => setCustomWeight(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-2 space-y-2.5">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={handleClaim}
                  disabled={isScanning}
                  className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Log Recycling & Claim +35 Coins</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="h-11 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Photo</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Google Maps Grounding Finder */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={handleFindDropoffs}
                  disabled={isFindingDropoffs}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  {isFindingDropoffs ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Querying Google Maps for {selectedItem.name}...</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4 text-emerald-200" />
                      <span>Find Nearest Drop-Offs with Google Maps</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    </>
                  )}
                </button>
              </div>

              {/* Grounded Drop-off Places Drawer/Card */}
              {showDropoffCard && (
                <div className="mt-3 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-emerald-700" />
                      <span className="text-xs font-bold text-emerald-950">
                        Verified Drop-Offs for “{selectedItem.name}”
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      Google Maps Data
                    </span>
                  </div>

                  {isFindingDropoffs ? (
                    <div className="py-4 text-center text-xs text-emerald-800">
                      Searching nearest authorized recycling points & scrap dealers...
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {groundedDropoffs.map((place, pIdx) => (
                        <div
                          key={pIdx}
                          className="p-3 bg-white rounded-xl border border-emerald-100 shadow-2xs space-y-1.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-bold text-xs text-slate-900">
                                {place.title}
                              </div>
                              {place.snippets && place.snippets.length > 0 && (
                                <p className="text-[11px] text-slate-600 italic mt-0.5">
                                  “{place.snippets[0]}”
                                </p>
                              )}
                            </div>

                            {place.uri && (
                              <a
                                href={place.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 whitespace-nowrap shadow-2xs transition-colors"
                              >
                                <span>Maps</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}

                      {groundedGuidance && (
                        <p className="text-[11px] text-emerald-900 bg-white/80 p-2.5 rounded-xl border border-emerald-100 leading-relaxed">
                          💡 {groundedGuidance.slice(0, 220)}...
                        </p>
                      )}

                      <button
                        onClick={() => navigate('map')}
                        className="w-full text-center text-xs font-bold text-emerald-700 hover:text-emerald-800 pt-1 cursor-pointer"
                      >
                        Open Full Interactive Waste & Recycling Map →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Direct Next Step Options: Scan Again / Request Pickup */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                <button
                  onClick={() => startScan(selectedItem)}
                  className="h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-slate-600" />
                  <span>Scan Again</span>
                </button>

                <button
                  onClick={() => navigate('pickup')}
                  className="h-11 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Truck className="w-4 h-4 text-emerald-700" />
                  <span>Request Pickup</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Sample Gallery */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
          Quick Test Sample Objects:
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {WASTE_ITEMS.slice(0, 6).map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectSample(item)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedItem.id === item.id
                  ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                  : 'bg-white border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="text-[10px] uppercase font-bold text-emerald-700 font-mono-numbers">
                {item.category}
              </div>
              <div className="text-xs font-bold text-slate-900 truncate mt-0.5">
                {item.name}
              </div>
              <div className="text-[10px] text-slate-500 font-mono-numbers mt-1">
                +{item.points} pts
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
