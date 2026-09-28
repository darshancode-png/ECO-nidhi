import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Shared server-side Gemini client with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface GroundedPlace {
  title: string;
  uri: string;
  snippets?: string[];
  type?: string;
  address?: string;
}

// Helper to extract places & URLs from grounding metadata and text
function extractGroundedPlaces(groundingChunks: any[], text: string): GroundedPlace[] {
  const places: GroundedPlace[] = [];
  const seenUris = new Set<string>();

  if (Array.isArray(groundingChunks)) {
    for (const chunk of groundingChunks) {
      if (chunk.maps) {
        const uri = chunk.maps.uri || '';
        const title = chunk.maps.title || 'Google Maps Location';
        const snippets: string[] = [];

        if (chunk.maps.placeAnswerSources?.reviewSnippets) {
          for (const s of chunk.maps.placeAnswerSources.reviewSnippets) {
            if (typeof s === 'string') {
              snippets.push(s);
            } else if (s && typeof s.snippet === 'string') {
              snippets.push(s.snippet);
            }
          }
        }

        if (uri && !seenUris.has(uri)) {
          seenUris.add(uri);
          places.push({
            title,
            uri,
            snippets,
            type: 'maps',
          });
        }
      } else if (chunk.web) {
        const uri = chunk.web.uri || '';
        const title = chunk.web.title || 'Web Link';
        if (uri && !seenUris.has(uri)) {
          seenUris.add(uri);
          places.push({
            title,
            uri,
            snippets: [],
            type: 'web',
          });
        }
      }
    }
  }

  // Also extract markdown links from text to ensure no Google Maps URL is missed
  const markdownLinkRegex = /\[([^\]]+)\]\((https:\/\/[^\s\)]+)\)/g;
  let match;
  while ((match = markdownLinkRegex.exec(text)) !== null) {
    const linkTitle = match[1];
    const linkUri = match[2];
    if (linkUri && !seenUris.has(linkUri)) {
      seenUris.add(linkUri);
      places.push({
        title: linkTitle,
        uri: linkUri,
        snippets: [],
        type: linkUri.includes('google.com/maps') ? 'maps' : 'link',
      });
    }
  }

  return places;
}

// POST /api/maps/search: Search for waste/recycling facilities grounded with Google Maps
app.post('/api/maps/search', async (req: Request, res: Response) => {
  try {
    const { query, latLng, category, city } = req.body;
    const userQuery = query?.trim() || 'Find recycling centres, dry waste collection centres, e-waste drop-offs, and scrap buyers nearby';

    let prompt = `User search for circular waste & recycling hubs: "${userQuery}".`;
    if (city?.trim()) {
      prompt += ` City / Locality: ${city.trim()}.`;
    }
    if (category && category !== 'all') {
      prompt += ` Target waste category: ${category}.`;
    }
    prompt += ` Using Google Maps, find real, verified facilities (such as Dry Waste Collection Centres / DWCC, E-Waste Drop-off Points, Scrap Dealers / Kabadiwalas, Reverse Vending Machines / RVM, Composting & Bio-methanation sites, or Materials Recovery Facilities). Provide their names, approximate areas/addresses, accepted materials, and key operational hours or tips.`;

    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (latLng && typeof latLng.latitude === 'number' && typeof latLng.longitude === 'number') {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: latLng.latitude,
            longitude: latLng.longitude,
          },
        },
      };
    }

    // Use gemini-3.8-flash for Google Maps Grounding
    const model = process.env.GEMINI_MAPS_MODEL || 'gemini-3.8-flash';
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config,
    });

    const text = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const groundingSupports = response.candidates?.[0]?.groundingMetadata?.groundingSupports || [];

    const places = extractGroundedPlaces(groundingChunks, text);

    return res.json({
      success: true,
      text,
      places,
      groundingChunks,
      groundingSupports,
      model,
      query: userQuery,
    });
  } catch (error: any) {
    console.error('Error in /api/maps/search:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to search Google Maps grounded data',
    });
  }
});

// POST /api/maps/item-dropoff: Find drop-off locations for a specific scanned waste item
app.post('/api/maps/item-dropoff', async (req: Request, res: Response) => {
  try {
    const { itemName, category, latLng, city } = req.body;
    let prompt = `Find nearby verified recycling drop-off centers, scrap buyers, or municipal deposit kiosks for: "${itemName || 'recyclable waste'}" (Category: ${category || 'general'}).`;
    if (city?.trim()) {
      prompt += ` In or around: ${city.trim()}.`;
    }
    prompt += ` List verified places on Google Maps where a citizen can safely drop this off or sell it. Include location names, operating status, and disposal guidelines.`;

    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (latLng && typeof latLng.latitude === 'number' && typeof latLng.longitude === 'number') {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: latLng.latitude,
            longitude: latLng.longitude,
          },
        },
      };
    }

    const model = process.env.GEMINI_MAPS_MODEL || 'gemini-3.8-flash';
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config,
    });

    const text = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const places = extractGroundedPlaces(groundingChunks, text);

    return res.json({
      success: true,
      text,
      places,
      groundingChunks,
      model,
    });
  } catch (error: any) {
    console.error('Error in /api/maps/item-dropoff:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to find drop-offs for item',
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[EcoNidhi Server] Running at http://0.0.0.0:${PORT} (Node ${process.version})`);
  });
}

startServer();
