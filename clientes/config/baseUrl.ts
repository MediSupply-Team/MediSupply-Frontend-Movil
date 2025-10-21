// src/config/baseUrl.ts
import { Platform } from "react-native";

const LAN_IP = process.env.EXPO_PUBLIC_API_HOST ?? "10.189.117.176";

export function apiHost() {
  if (Platform.OS === "ios") return "http://localhost";
  if (Platform.OS === "android") return "http://10.0.2.2"; // o usa LAN_IP si prefieres
  return `http://${LAN_IP}`; // Web / dispositivos físicos
}
