import React, { useEffect, useState } from "react";
import Button from "../components/Common/Button/button";
import Footer from "../components/Common/Footer/footer";
import Header from "../components/Common/Header";
import Loader from "../components/Common/Loader/loader";
import TabsComponent from "../components/Dashboard/Tabs/tabs";
import { get100Coins } from "../functions/get100Coins";

function WatchlistPage() {
  const coins = JSON.parse(localStorage.getItem("watchlist"));
  const [myWatchlist, setMyWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    const allCoins = await get100Coins();

    if (coins && allCoins) {
      setMyWatchlist(allCoins.filter((item) => coins.includes(item.id)));
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {loading ? (
        <Loader />
      ) : (
        <div style={{ flex: 1, paddingBottom: "2rem" }}>
          {/* Empty Watchlist */}
          {myWatchlist?.length === 0 || !coins ? (
            <>
              <Header />
              <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
                No Items in the Watchlist
              </h1>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <a href="/dashboard">
                  <Button text={"Dashboard"} />
                </a>
              </div>
            </>
          ) : (
            <>
              <Header />
              {/* FIX → removed height:95vh, replaced with flexible container */}
              <div style={{ marginTop: "1rem" }}>
                <TabsComponent coins={myWatchlist} isWatchlistPage={true} />
              </div>
            </>
          )}
        </div>
      )}

      {/* Footer always at bottom, never overlaps */}
      {!loading && <Footer />}
    </div>
  );
}

export default WatchlistPage;
