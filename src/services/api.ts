import axios from "axios";

const API = axios.create({
    baseURL: "https://web-production-2218a.up.railway.app"
,
});

export interface PredictionResponse {
  action: "WAIT" | "IRRIGATE";
  predicted_moisture: number;
  recommended_valve_seconds?: number;
}

export async function predictZone(data: any): Promise<PredictionResponse> {
  const response = await API.post("/predict", data);
  return response.data;
}

export const getZones = async () => {
  const res = await API.get("/zones");
  return res.data;
};

export const getHistory = async () => {
  const res = await API.get("/history");
  return res.data;
};
