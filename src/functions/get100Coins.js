import axios from "axios";
import { API_URL } from "../constants";

export const get100Coins = async () => {
  const CACHE_KEY = "coinsData";
  const TIMESTAMP_KEY = "coinsDataTimestamp";
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  // 1. Check if valid cache exists
  const cachedData = sessionStorage.getItem(CACHE_KEY);
  const lastFetchTime = sessionStorage.getItem(TIMESTAMP_KEY);
  const now = Date.now();

  if (cachedData && lastFetchTime && now - parseInt(lastFetchTime) < CACHE_DURATION) {
    console.log("Returning cached coin data");
    return JSON.parse(cachedData);
  }

  // 2. Fetch new data if cache is expired or missing
  try {
    const response = await axios.get(
      `${API_URL}/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`
    );

    if (response.status === 200) {
      // 3. Save to cache before returning
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(response.data));
      sessionStorage.setItem(TIMESTAMP_KEY, now.toString());
      return response.data;
    }
  } catch (error) {
    console.log("ERROR>>>", error);
    
    // Fallback: If API fails (e.g., rate limit), try to return old cache if it exists
    if (cachedData) {
      console.warn("API request failed, returning stale cache.");
      return JSON.parse(cachedData);
    }
    
    // Otherwise return error or null
    return null;
  }
};