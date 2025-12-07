import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());

const cache = new Map(); // simple in-memory cache

// 1️⃣ Fetch market data with caching
app.get("/api/coin/:id", async (req, res) => {
  const { id } = req.params;
  const cacheKey = `${id}-60d`;

  // Return cached data if available
  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
      { params: { vs_currency: "usd", days: 60, interval: "daily" } }
    );

    // Store for 10 minutes
    cache.set(cacheKey, response.data);
    setTimeout(() => cache.delete(cacheKey), 10 * 60 * 1000);

    res.json(response.data);
  } catch (err) {
    console.error("Error fetching data:", err.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
