:import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export interface Sound {
  id: number;
  name: string;
  previews: {
    "preview-hq-mp3": string;
    "preview-lq-mp3": string;
  };
  duration: number;
}

interface FreesoundResponse {
  results: Sound[];
}

export const searchSounds = async (query: string): Promise<Sound[]> => {
  try {
    const res = await axios.get<FreesoundResponse>(`${API_URL}/freesound/search`, {
      params: { q: query },
    });
    return res.data.results;
  } catch (error) {
    console.error("Error al buscar sonidos:", error);
    return [];
  }
};