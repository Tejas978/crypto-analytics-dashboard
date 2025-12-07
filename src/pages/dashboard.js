import { useEffect, useState, useMemo, useCallback } from "react";
import TopButton from "../components/Common/BackToTop/topButton";
import Footer from "../components/Common/Footer/footer";
import Header from "../components/Common/Header";
import Loader from "../components/Common/Loader/loader";
import PaginationComponent from "../components/Dashboard/Pagination/pagination";
import SearchComponent from "../components/Dashboard/Search/search";
import TabsComponent from "../components/Dashboard/Tabs/tabs";
import { get100Coins } from "../functions/get100Coins";

const ITEMS_PER_PAGE = 10;

function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState(null);

  // Memoized filtered coins to avoid recalculation on every render
  const filteredCoins = useMemo(() => {
    if (!search.trim()) return coins;
    
    const searchLower = search.toLowerCase().trim();
    return coins.filter((coin) =>
      coin.name.toLowerCase().includes(searchLower) ||
      coin.symbol.toLowerCase().includes(searchLower)
    );
  }, [coins, search]);

  // Memoized paginated coins
  const paginatedCoins = useMemo(() => {
    const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
    return filteredCoins.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCoins, pageNumber]);

  // Calculate total pages
  const totalPages = useMemo(() => 
    Math.ceil(filteredCoins.length / ITEMS_PER_PAGE),
    [filteredCoins.length]
  );

  // Handle page change with useCallback to prevent recreation
  const handlePageChange = useCallback((event, value) => {
    setPageNumber(value);
    // Smooth scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle search change
  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
    // Reset to page 1 when searching
    setPageNumber(1);
  }, []);

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearch("");
    setPageNumber(1);
  }, []);

  // Fetch coins data
  const fetchCoinsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await get100Coins();
      
      if (data && Array.isArray(data)) {
        setCoins(data);
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (err) {
      console.error("Error fetching coins:", err);
      setError(err.message || "Failed to fetch coins data");
      setCoins([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Retry fetching data
  const handleRetry = useCallback(() => {
    fetchCoinsData();
  }, [fetchCoinsData]);

  // Initial data fetch
  useEffect(() => {
    fetchCoinsData();
  }, [fetchCoinsData]);

  // Reset to page 1 if current page exceeds total pages
  useEffect(() => {
    if (pageNumber > totalPages && totalPages > 0) {
      setPageNumber(1);
    }
  }, [pageNumber, totalPages]);

  return (
    <>
      <TopButton />
      {loading ? (
        <Loader />
      ) : error ? (
        <div style={{ minHeight: "90vh" }}>
          <Header />
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#e74c3c', marginBottom: '1rem' }}>
              Error Loading Data
            </h2>
            <p style={{ marginBottom: '2rem', color: '#666' }}>
              {error}
            </p>
            <button
              onClick={handleRetry}
              style={{
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <div style={{ minHeight: "90vh" }}>
          <Header />
          <SearchComponent 
            search={search} 
            onChange={handleSearchChange}
            onClear={handleClearSearch}
          />
          
          {filteredCoins.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: '#666'
            }}>
              <h3>No coins found</h3>
              <p>Try adjusting your search criteria</p>
              {search && (
                <button
                  onClick={handleClearSearch}
                  style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1.5rem',
                    fontSize: '0.9rem',
                    backgroundColor: '#95a5a6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <>
              <TabsComponent
                coins={paginatedCoins}
                setSearch={setSearch}
              />
              {!search && totalPages > 1 && (
                <PaginationComponent
                  pageNumber={pageNumber}
                  handleChange={handlePageChange}
                  count={totalPages}
                />
              )}
              
              {/* Display results info */}
              <div style={{
                textAlign: 'center',
                padding: '1rem',
                color: '#666',
                fontSize: '0.9rem'
              }}>
                {search ? (
                  <p>Showing {filteredCoins.length} result{filteredCoins.length !== 1 ? 's' : ''} for "{search}"</p>
                ) : (
                  <p>Showing {((pageNumber - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(pageNumber * ITEMS_PER_PAGE, coins.length)} of {coins.length} coins</p>
                )}
              </div>
            </>
          )}
        </div>
      )}
      <Footer />
    </>
  );
}

export default DashboardPage;