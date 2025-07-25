// src/services/freesoundService.ts
export async function searchSounds(query: string = "piano") {
  const res = await fetch(`http://localhost:3000/api/freesound/search?q=${query}`);
  if (!res.ok) {
    throw new Error("Error al buscar sonidos");
  }
  return res.json();
}
