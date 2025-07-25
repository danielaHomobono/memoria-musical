// src/components/SoundSearch.tsx
import { useEffect, useState } from "react";
import { searchSounds } from "../services/freesoundService";

interface Sound {
  id: number;
  name: string;
  duration: number;
  previews: {
    "preview-hq-mp3": string;
  };
}

export default function SoundSearch() {
  const [sounds, setSounds] = useState<Sound[]>([]);

  useEffect(() => {
    searchSounds("piano").then((data) => {
      setSounds(data.results);
    }).catch(console.error);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Resultados</h2>
      <ul>
        {sounds.map((sound) => (
          <li key={sound.id}>
            <p>{sound.name} ({sound.duration.toFixed(2)}s)</p>
            <audio controls src={sound.previews["preview-hq-mp3"]}></audio>
          </li>
        ))}
      </ul>
    </div>
  );
}
