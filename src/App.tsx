import React, { useEffect, useState } from "react";
import axios from "axios";

// Define the type for the counter data
interface Counter {
  id: string;
  value: string;
  title: string;
  units?: string | null;
  description: string;
}

const App: React.FC = () => {
  const [counters, setCounters] = useState<Counter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch data from the API
  const fetchData = () => {
    axios
      .get(
        "https://cors-anywhere.herokuapp.com/https://explorer-stats.testnet.citrea.xyz/api/v1/counters"
      )
      .then((response: any) => {
        setCounters(response.data.counters);
        setLoading(false);
        setError(null); // Reset error state on successful fetch
      })
      .catch((err: any) => {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
        setLoading(false);
      });
  };

  // Use effect to fetch data and refresh every 10 seconds
  useEffect(() => {
    fetchData(); // Fetch initially
    const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Function to toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Handle loading and error states
  if (loading) return <div className="text-center mt-4">Loading...</div>;
  if (error)
    return (
      <div className="text-center mt-4 text-red-500">
        {error}. Please enable CORS access{" "}
        <a
          href="https://cors-anywhere.herokuapp.com/corsdemo"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          here
        </a>
        .
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
        Citrea Testnet Stats
      </h1>
      {/* Fullscreen Button */}
      <div className="text-center mb-6">
        <button
          onClick={toggleFullscreen}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200"
        >
          Toggle Fullscreen
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {counters.map((counter) => (
          <div
            key={counter.id}
            className="p-6 bg-white border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {counter.title}
            </h2>
            <p className="text-3xl font-semibold text-gray-900 mb-2">
              {counter.value}
              {counter.units && (
                <span className="text-xl ml-1 text-gray-600">
                  {counter.units}
                </span>
              )}
            </p>
            <p className="text-gray-600 text-base mt-2">
              {counter.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
