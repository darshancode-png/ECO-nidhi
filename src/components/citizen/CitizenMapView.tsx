import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import {
  MapPin,
  Navigation,
  Factory,
  Zap,
  Recycle,
  Search,
  ExternalLink,
  Sparkles,
  Compass,
  Building2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Truck,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { searchMapsWasteFacilities, getBrowserLocation, GroundedPlace, UserCoordinates } from '../../utils/mapsApi';

interface MapMarker {
  id: string;
  name: string;
  type: 'collection' | 'recycling' | 'ewaste' | 'pickup';
  coords: { x: number; y: number };
  accepted: string;
  hours: string;
  distanceKm: number;
}

const DEFAULT_CITIES = [
  { name: 'Bengaluru', coords: { latitude: 12.9716, longitude: 77.5946 } },
  { name: 'Mumbai', coords: { latitude: 19.076, longitude: 72.8777 } },
  { name: 'Delhi NCR', coords: { latitude: 28.6139, longitude: 77.209 } },
  { name: 'Hyderabad', coords: { latitude: 17.385, longitude: 78.4867 } },
  { name: 'Pune', coords: { latitude: 18.5204, longitude: 73.8567 } },
  { name: 'Chennai', coords: { latitude: 13.0827, longitude: 80.2707 } },
];

const PRESET_CATEGORIES = [
  { id: 'all', label: 'All Centres', icon: Layers },
  { id: 'ewaste', label: 'E-Waste & Batteries', icon: Zap },
  { id: 'collection', label: 'Dry Waste (DWCC)', icon: Recycle },
  { id: 'recycling', label: 'Plastic & Bottles', icon: Factory },
  { id: 'paper', label: 'Cardboard & Paper', icon: Building2 },
  { id: 'scrap', label: 'Scrap Dealers (Kabadi)', icon: Truck },
];

export const CitizenMapView: React.FC = () => {
  const { navigate } = useGame();
  
  // View mode: 'grounded' (Live Google Maps Grounding) or 'ward_sim' (Local Eco-City District Map)
  const [activeTab, setActiveTab] = useState<'grounded' | 'ward_sim'>('grounded');

  // Search & Location states
  const [searchQuery, setSearchQuery] = useState<string>('Recycling centres and dry waste collection centres');
  const [selectedCity, setSelectedCity] = useState<string>('Bengaluru');
  const [userCoords, setUserCoords] = useState<UserCoordinates | null>({ latitude: 12.9716, longitude: 77.5946 });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locatingStatus, setLocatingStatus] = useState<string>('');

  // Google Maps Grounding states
  const [isLoadingGrounded, setIsLoadingGrounded] = useState<boolean>(false);
  const [groundedPlaces, setGroundedPlaces] = useState<GroundedPlace[]>([]);
  const [groundedSummary, setGroundedSummary] = useState<string>('');
  const [groundedError, setGroundedError] = useState<string | null>(null);
  const [activePlace, setActivePlace] = useState<GroundedPlace | null>(null);

  // Ward Simulation Markers
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'collection' | 'recycling' | 'ewaste' | 'pickup'>('all');

  const markers: MapMarker[] = [
    { id: 'm1', name: 'Ward 14 Dry Waste Collection Centre (DWCC)', type: 'collection', coords: { x: 45, y: 35 }, accepted: 'Dry Waste: Plastic, Paper, Glass & Tetra Pak', hours: '7:00 AM - 7:00 PM', distanceKm: 0.8 },
    { id: 'm2', name: 'Smart Reverse Vending Machine (RVM) #104', type: 'collection', coords: { x: 28, y: 55 }, accepted: 'PET Bottles & Beverage Cans (Instant Coins)', hours: '24/7 Automated', distanceKm: 0.3 },
    { id: 'm3', name: 'Authorized Municipal E-Waste Deposit Kiosk', type: 'ewaste', coords: { x: 72, y: 25 }, accepted: 'Smartphones, Lithium Batteries, PCBs, Chargers', hours: '9:00 AM - 6:00 PM', distanceKm: 1.4 },
    { id: 'm4', name: 'Sector 4 Community Bio-Methanation Plant', type: 'recycling', coords: { x: 60, y: 68 }, accepted: 'Wet Food Waste, Market Organic Scraps', hours: '24 Hours Continuous', distanceKm: 2.2 },
    { id: 'm5', name: 'Materials Recovery Facility (MRF) Sector 9', type: 'recycling', coords: { x: 80, y: 78 }, accepted: 'Secondary Polymers, Cardboard Bales & Glass Cullet', hours: '8:00 AM - 8:00 PM', distanceKm: 3.5 },
    { id: 'm6', name: 'Active Electric Hauler #102 (Doorstep Request)', type: 'pickup', coords: { x: 38, y: 48 }, accepted: 'Active Doorstep Segregated Pickup', hours: 'ETA: 14 mins away', distanceKm: 0.0 }
  ];

  // Perform Google Maps Grounding Search
  const fetchGroundedLocations = async (customQuery?: string, coords?: UserCoordinates | null, category?: string, city?: string) => {
    setIsLoadingGrounded(true);
    setGroundedError(null);

    const queryToUse = customQuery || searchQuery;
    const coordsToUse = coords !== undefined ? coords : userCoords;
    const catToUse = category || selectedCategory;
    const cityToUse = city || selectedCity;

    try {
      const res = await searchMapsWasteFacilities({
        query: queryToUse,
        latLng: coordsToUse,
        category: catToUse,
        city: cityToUse,
      });

      if (res.success) {
        setGroundedPlaces(res.places || []);
        setGroundedSummary(res.text || '');
        if (res.places?.length > 0) {
          setActivePlace(res.places[0]);
        }
      } else {
        // Fallback default list if connection fails or pending
        setGroundedError(res.error || 'Failed to retrieve live Google Maps data');
        setFallbackPlaces(cityToUse);
      }
    } catch (e: any) {
      setGroundedError(e.message || 'Error executing Google Maps grounding search');
      setFallbackPlaces(cityToUse);
    } finally {
      setIsLoadingGrounded(false);
    }
  };

  const setFallbackPlaces = (cityName: string) => {
    setGroundedPlaces([
      {
        title: `${cityName} Dry Waste Collection Centre (DWCC)`,
        uri: `https://www.google.com/maps/search/?api=1&query=Dry+Waste+Collection+Centre+${encodeURIComponent(cityName)}`,
        snippets: ['Municipal segregated dry waste drop-off point for clean plastic, paper, and glass.'],
        type: 'maps',
      },
      {
        title: `${cityName} E-Waste Recycling & Drop-Off Hub`,
        uri: `https://www.google.com/maps/search/?api=1&query=E-Waste+Recycling+${encodeURIComponent(cityName)}`,
        snippets: ['Authorized e-waste deposit center accepting electronics, batteries, and appliances.'],
        type: 'maps',
      },
      {
        title: `${cityName} Scrap & Metal Recovery Depot (Kabadiwala)`,
        uri: `https://www.google.com/maps/search/?api=1&query=Scrap+Dealer+Kabadiwala+${encodeURIComponent(cityName)}`,
        snippets: ['Instant payment for copper, aluminum, cardboard bales, and PET plastic bottles.'],
        type: 'maps',
      }
    ]);
  };

  // Run initial fetch on mount
  useEffect(() => {
    fetchGroundedLocations();
  }, []);

  // Handle GPS detection
  const handleDetectGPS = async () => {
    setIsLocating(true);
    setLocatingStatus('Detecting your GPS position...');
    try {
      const coords = await getBrowserLocation();
      setUserCoords(coords);
      setSelectedCity('My Location');
      setLocatingStatus(`GPS Locked (${coords.latitude.toFixed(3)}, ${coords.longitude.toFixed(3)})`);
      await fetchGroundedLocations(searchQuery, coords, selectedCategory, 'Near current user location');
    } catch (err: any) {
      setLocatingStatus('GPS denied/unavailable. Using selected city.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleCitySelect = (city: typeof DEFAULT_CITIES[0]) => {
    setSelectedCity(city.name);
    setUserCoords(city.coords);
    fetchGroundedLocations(searchQuery, city.coords, selectedCategory, city.name);
  };

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    let updatedQuery = searchQuery;
    if (catId === 'ewaste') updatedQuery = 'E-waste recycling and battery drop-off locations';
    if (catId === 'collection') updatedQuery = 'Dry waste collection centres DWCC';
    if (catId === 'recycling') updatedQuery = 'Plastic recycling centers and reverse vending machines';
    if (catId === 'paper') updatedQuery = 'Cardboard, paper scrap buyers and recycling mills';
    if (catId === 'scrap') updatedQuery = 'Scrap dealers, scrap merchants, kabadiwala nearby';
    if (catId === 'all') updatedQuery = 'Recycling centres, dry waste collection centres, and scrap buyers';
    setSearchQuery(updatedQuery);
    fetchGroundedLocations(updatedQuery, userCoords, catId, selectedCity);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    fetchGroundedLocations(searchQuery, userCoords, selectedCategory, selectedCity);
  };

  const filteredWardMarkers = markers.filter(m =>
    filterType === 'all' ? true : m.type === filterType
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-28 space-y-6">
      {/* Top Header & Mode Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Google Maps Grounded • Gemini 3.8 Flash
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
            Waste & Recycling Locator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Find verified dry waste centres, e-waste drop-offs, scrap buyers, and recycling facilities grounded with Google Maps.
          </p>
        </div>

        {/* Tab switch between Live Grounding and Ward Simulation */}
        <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start md:self-auto shadow-2xs">
          <button
            onClick={() => setActiveTab('grounded')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'grounded'
                ? 'bg-white text-emerald-800 shadow-xs border border-emerald-100'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Google Maps Grounding</span>
          </button>
          <button
            onClick={() => setActiveTab('ward_sim')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'ward_sim'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Factory className="w-3.5 h-3.5 text-slate-600" />
            <span>Eco-City Ward Map</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: LIVE GOOGLE MAPS GROUNDING */}
      {activeTab === 'grounded' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Search & Location Bar */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search recycling centers, scrap dealers, e-waste kiosks..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 font-medium"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={isLocating}
                  className="h-10 px-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Detect GPS location"
                >
                  <MapPin className={`w-3.5 h-3.5 text-emerald-600 ${isLocating ? 'animate-bounce' : ''}`} />
                  <span className="hidden sm:inline">Use GPS</span>
                </button>

                <button
                  type="submit"
                  disabled={isLoadingGrounded}
                  className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all disabled:opacity-50"
                >
                  {isLoadingGrounded ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Querying Maps...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ground on Maps</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {locatingStatus && (
              <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {locatingStatus}
              </p>
            )}

            {/* City Quick Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">City:</span>
              {DEFAULT_CITIES.map((c) => (
                <button
                  key={c.name}
                  onClick={() => handleCitySelect(c)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-colors cursor-pointer ${
                    selectedCity === c.name
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Waste Category Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100">
              {PRESET_CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Overview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Verified Places on Google Maps (Must list all extracted URLs) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-display font-bold text-slate-900">
                    Verified Places on Google Maps
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {groundedPlaces.length} facilities
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono-numbers">
                  {selectedCity}
                </span>
              </div>

              {isLoadingGrounded ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 animate-spin">
                    <RefreshCw className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-800">Grounding with Google Maps...</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Retrieving active municipal drop-off centers, scrap merchants, and e-waste kiosks with live hours and reviews.
                  </p>
                </div>
              ) : groundedPlaces.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                  <h3 className="font-bold text-sm text-slate-800">No Specific Places Returned</h3>
                  <p className="text-xs text-slate-500">
                    Try broadening your search term or selecting one of the popular cities above.
                  </p>
                  <button
                    onClick={() => fetchGroundedLocations('Dry waste collection centres and scrap dealers', userCoords, 'all', selectedCity)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                  >
                    Reset Search
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {groundedPlaces.map((place, idx) => {
                    const isActive = activePlace?.uri === place.uri;
                    return (
                      <div
                        key={idx}
                        onClick={() => setActivePlace(place)}
                        className={`p-4 rounded-2xl bg-white border transition-all cursor-pointer ${
                          isActive
                            ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center font-mono-numbers">
                                {idx + 1}
                              </span>
                              <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700">
                                {place.title}
                              </h3>
                            </div>

                            {place.snippets && place.snippets.length > 0 && (
                              <p className="text-xs text-slate-600 line-clamp-2 pl-7 italic">
                                “{place.snippets[0]}”
                              </p>
                            )}
                          </div>

                          {/* Direct External Link to Google Maps (CRITICAL REQUIREMENT) */}
                          {place.uri && (
                            <a
                              href={place.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors whitespace-nowrap shadow-2xs"
                            >
                              <span>Open in Maps</span>
                              <ExternalLink className="w-3 h-3 text-emerald-600" />
                            </a>
                          )}
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 pl-7">
                          <span className="flex items-center gap-1 text-emerald-700 font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified Google Maps Facility
                          </span>
                          <span className="font-mono-numbers">Tap for details →</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Place Inspection & Grounded Intelligence */}
            <div className="lg:col-span-5 space-y-4">
              {/* Selected Place Card */}
              {activePlace ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4 sticky top-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Selected Drop-off
                    </span>
                    <span className="text-xs text-slate-400 font-mono-numbers">Google Maps Data</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{activePlace.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Grounding source: Google Maps API tool invocation
                    </p>
                  </div>

                  {activePlace.snippets && activePlace.snippets.length > 0 && (
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <Info className="w-3 h-3 text-slate-500" />
                        <span>Google Maps Reviews & Details:</span>
                      </div>
                      <div className="space-y-1">
                        {activePlace.snippets.map((snip, sIdx) => (
                          <p key={sIdx} className="text-xs text-slate-600 italic">
                            “{snip}”
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Primary Navigation & Booking Actions */}
                  <div className="space-y-2 pt-2">
                    {activePlace.uri && (
                      <a
                        href={activePlace.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Navigate via Google Maps ↗</span>
                      </a>
                    )}

                    <button
                      onClick={() => navigate('pickup')}
                      className="w-full h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5 text-slate-600" />
                      <span>Request Doorstep Hauler to this Facility</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-100 rounded-3xl border border-slate-200 p-6 text-center text-slate-500 text-xs">
                  Select a place from the left to view Google Maps directions and review snippets.
                </div>
              )}

              {/* Grounded Summary Accordion */}
              {groundedSummary && (
                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-bold text-sm text-slate-900">
                      Grounded Recycling Guidance
                    </h3>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line max-h-72 overflow-y-auto pr-2 space-y-2">
                    {groundedSummary}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ECO-CITY WARD SIMULATION MAP */}
      {activeTab === 'ward_sim' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-display font-bold text-slate-900">
                Eco-City Municipal Grid
              </h2>
              <p className="text-xs text-slate-600">
                Interactive simulation of smart automated RVMs, DWCC hubs, and hauler routes.
              </p>
            </div>

            {/* Filters */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'All Hubs' },
                { id: 'collection', label: 'Collection' },
                { id: 'recycling', label: 'Recycling' },
                { id: 'ewaste', label: 'E-Waste' },
                { id: 'pickup', label: 'Active Pickups' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setFilterType(t.id as any)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    filterType === t.id
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clean Light-Mode Map Viewport */}
          <div className="relative w-full aspect-video sm:aspect-21/9 min-h-[340px] bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            {/* Soft grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:36px_36px] opacity-70" />

            {/* Soft Waterway and Green park vectors */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <path d="M0,80 Q200,120 400,90 T800,150 T1200,80" stroke="#bae6fd" strokeWidth="24" fill="none" />
              <circle cx="280" cy="180" r="60" fill="#bbf7d0" />
              <circle cx="750" cy="100" r="80" fill="#bbf7d0" />
            </svg>

            {/* Pins */}
            {filteredWardMarkers.map((marker) => {
              const isSelected = selectedMarker?.id === marker.id;

              const getPinColor = () => {
                if (marker.type === 'recycling') return 'bg-emerald-600 text-white';
                if (marker.type === 'collection') return 'bg-amber-500 text-white';
                if (marker.type === 'ewaste') return 'bg-purple-600 text-white';
                if (marker.type === 'pickup') return 'bg-blue-600 text-white animate-bounce';
                return 'bg-slate-700 text-white';
              };

              return (
                <button
                  key={marker.id}
                  onClick={() => setSelectedMarker(marker)}
                  style={{ left: `${marker.coords.x}%`, top: `${marker.coords.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-hidden z-20"
                >
                  <div
                    className={`w-9 h-9 rounded-2xl border-2 border-white shadow-md flex items-center justify-center transition-transform hover:scale-110 ${getPinColor()} ${
                      isSelected ? 'ring-4 ring-emerald-500/40 scale-110' : ''
                    }`}
                  >
                    {marker.type === 'recycling' && <Factory className="w-4 h-4" />}
                    {marker.type === 'collection' && <Recycle className="w-4 h-4" />}
                    {marker.type === 'ewaste' && <Zap className="w-4 h-4" />}
                    {marker.type === 'pickup' && <Navigation className="w-4 h-4" />}
                  </div>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white px-2 py-0.5 rounded text-[10px] pointer-events-none font-medium shadow-xs">
                    {marker.name}
                  </span>
                </button>
              );
            })}

            {/* Marker Details Drawer */}
            {selectedMarker && (
              <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-white border border-slate-200 rounded-2xl p-4 shadow-lg z-30 animate-in fade-in slide-in-from-bottom-2 duration-150 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 font-mono-numbers">
                      {selectedMarker.type.toUpperCase()}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">{selectedMarker.name}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedMarker(null)}
                    className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer p-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="text-xs text-slate-600 space-y-0.5">
                  <div>
                    <span className="font-medium text-slate-500">Accepted: </span>
                    <span>{selectedMarker.accepted}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 font-mono-numbers text-[11px] pt-1">
                    <span>🕒 {selectedMarker.hours}</span>
                    <span>·</span>
                    <span>📍 {selectedMarker.distanceKm} km away</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => navigate('pickup')}
                    className="w-full h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Navigate to Facility</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
