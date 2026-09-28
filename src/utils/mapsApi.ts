export interface GroundedPlace {
  title: string;
  uri: string;
  snippets?: string[];
  type?: string;
  address?: string;
  distanceKm?: number;
}

export interface MapsSearchResponse {
  success: boolean;
  text: string;
  places: GroundedPlace[];
  groundingChunks?: any[];
  groundingSupports?: any[];
  error?: string;
  model?: string;
  query?: string;
}

export interface UserCoordinates {
  latitude: number;
  longitude: number;
}

export async function searchMapsWasteFacilities(params: {
  query?: string;
  latLng?: UserCoordinates | null;
  category?: string;
  city?: string;
}): Promise<MapsSearchResponse> {
  try {
    const res = await fetch('/api/maps/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${res.status}: Failed to query Google Maps`);
    }

    const data: MapsSearchResponse = await res.json();
    return data;
  } catch (error: any) {
    console.warn('[Maps API] Request failed:', error);
    return {
      success: false,
      text: '',
      places: [],
      error: error.message || 'Unable to connect to Google Maps grounding service',
    };
  }
}

export async function findItemDropoffWithMaps(params: {
  itemName: string;
  category?: string;
  latLng?: UserCoordinates | null;
  city?: string;
}): Promise<MapsSearchResponse> {
  try {
    const res = await fetch('/api/maps/item-dropoff', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${res.status}: Failed to query Google Maps for drop-off`);
    }

    const data: MapsSearchResponse = await res.json();
    return data;
  } catch (error: any) {
    console.warn('[Maps API] Item dropoff search failed:', error);
    return {
      success: false,
      text: '',
      places: [],
      error: error.message || 'Unable to search item drop-off locations',
    };
  }
}

// Helper to obtain browser geolocation safely
export function getBrowserLocation(): Promise<UserCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}
