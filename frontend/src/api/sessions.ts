import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export interface Session {
  userId: string;
  attempts: number;
  matchedPairs: number;
  duration: number;
  createdAt?: string;
}


export const saveSession = async (session: Session) => {
  const res = await axios.post(`${API_URL}/sessions`, session);
  return res.data;
};

export const getSessionsByUser = async (userId: string) => {
  const res = await axios.get(`${API_URL}/sessions/${userId}`);
  return res.data as Session[];
};
export const login = (userId: string) => {
  // En una app real pedirías usuario/contraseña al backend
  localStorage.setItem("userId", userId);
  return userId;
};

export const getCurrentUser = () => {
  return localStorage.getItem("userId");
};

