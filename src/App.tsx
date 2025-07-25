import { useState } from "react";
import { FiRefreshCw, FiSettings, FiHome } from "react-icons/fi";
import { Routes, Route, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import GoodNostronautsTable from "./components/GoodNostronautsTable";
import BadNostronautsTable from "./components/BadNostronautsTable";
import RpcUrlInput from "./components/RpcUrlInput";
import SettingsPage from "./components/SettingsPage";
import ConsoleLogViewer from "./components/ConsoleLogViewer";

import { getNostronautsSummary } from "./logic/main";
import { setConnection } from "./logic/solana";
import { useSettings } from "./context/SettingsContext";

function App() {
  const {
    rpcUrl,
    setRpcUrl,
  } = useSettings();

  const [goodAccounts, setGoodAccounts] = useState<Record<string, string>>(() => {
    const storedGoodAccounts = localStorage.getItem("goodAccounts");
    try {
      return storedGoodAccounts ? JSON.parse(storedGoodAccounts) : {};
    } catch (e) {
      console.error("Error parsing stored good accounts:", e);
      return {};
    }
  });
  const [badAccounts, setBadAccounts] = useState<Record<string, any>>(() => {
    const storedBadAccounts = localStorage.getItem("badAccounts");
    try {
      return storedBadAccounts ? JSON.parse(storedBadAccounts) : {};
    } catch (e) {
      console.error("Error parsing stored bad accounts:", e);
      return {};
    }
  });

  const [showGoodNostronauts, setShowGoodNostronauts] = useState(false);
  const [showBadNostronauts, setShowBadNostronauts] = useState(true);
  const [isHardRefreshing, setIsHardRefreshing] = useState(false);
  const [lastScannedTime, setLastScannedTime] = useState<number | null>(() => {
    const storedTime = localStorage.getItem("lastScannedTime");
    return storedTime ? Number(storedTime) : null;
  });

  const handleGoodNostronautsClick = () => {
    setShowGoodNostronauts(true);
    setShowBadNostronauts(false);
  };


  const handleBadNostronautsClick = () => {
    setShowGoodNostronauts(false);
    setShowBadNostronauts(true);
  };

  const handleHardRefreshClick = async () => {
    console.log("RPC URL:", rpcUrl);
    if (!rpcUrl) {
      toast.error("Please enter an RPC URL.");
      return;
    }
    setIsHardRefreshing(true); // Start hard refresh, show console
    try {
      setConnection();
      const summary = await getNostronautsSummary();
      console.log("Summary from getNostronautsSummary:", summary);

      setGoodAccounts({});
      setBadAccounts({});
      localStorage.removeItem("goodAccounts");
      localStorage.removeItem("badAccounts");

      setGoodAccounts(summary.goodAccounts);
      setBadAccounts(summary.badAccounts);
      setLastScannedTime(summary.lastScannedTime);
      localStorage.setItem(
        "lastScannedTime",
        summary.lastScannedTime.toString(),
      );
      localStorage.setItem(
        "goodAccounts",
        JSON.stringify(summary.goodAccounts)
      );
      localStorage.setItem("badAccounts", JSON.stringify(summary.badAccounts));
      toast.success("Data fetched successfully!");
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error(`Failed to fetch data: ${error.message || "Unknown error"}`);
    } finally {
      setIsHardRefreshing(false); // End hard refresh, hide console
    }
  };



  return (
    <div className="min-h-screen bg-nos-dark-surface p-8">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center basis-0 flex-grow">
          <Link to="/">
            <button className="p-2 rounded-full bg-nos-dark-surface text-nos-text-light hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-neon-green">
              <FiHome className="h-6 w-6 text-neon-green" />
            </button>
          </Link>
        </div>
        <h1 className="relative text-4xl font-bold text-center text-neon-green justify-center">
          Nosana Fund Scanner
        </h1>
        <div className="flex justify-end basis-0 flex-grow">
          <Link to="/settings">
            <button className="p-2 rounded-full bg-nos-dark-surface text-nos-text-light hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-neon-green">
              <FiSettings className="h-6 w-6 text-neon-green" />
            </button>
          </Link>
        </div>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="flex flex-col items-center space-y-4 mb-8">
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleHardRefreshClick}
                    className="px-6 py-3 bg-nos-dark-surface text-nos-text-light rounded-lg shadow-md hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-nos-dark-surface focus:ring-opacity-75 flex items-center space-x-2"
                  >
                    <FiRefreshCw className="h-5 w-5 text-neon-green" />
                    <span>Hard Refresh</span>
                  </button>
                  <RpcUrlInput rpcUrl={rpcUrl} setRpcUrl={setRpcUrl} />
                </div>
                {isHardRefreshing && (
                  <div className="mt-8 text-center text-neon-green">
                    <p className="text-xl font-semibold mb-4">Please wait, scanning the transactions...</p>
                    <ConsoleLogViewer />
                  </div>
                )}
                {!isHardRefreshing && (
                  <div className="mt-8 text-center text-neon-green">
                    <p className="text-xl font-semibold mb-4">
                      Last Scanned Time:{" "}
                      {lastScannedTime
                        ? new Date(lastScannedTime).toLocaleString()
                        : "Never scanned"}
                    </p>
                  </div>
                )}
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleGoodNostronautsClick}
                    className={`px-6 py-3 rounded-lg shadow-md hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-opacity-75 ${showGoodNostronauts
                      ? "bg-neon-green text-midnight-black focus:ring-neon-green"
                      : "bg-light-grey text-nos-dark-surface focus:ring-light-grey"
                      }`}
                  >
                    Good Nostronauts
                  </button>
                  <button
                    onClick={handleBadNostronautsClick}
                    className={`px-6 py-3 rounded-lg shadow-md hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-opacity-75 ${showBadNostronauts
                      ? "bg-neon-green text-midnight-black focus:ring-neon-green"
                      : "bg-light-grey text-nos-dark-surface focus:ring-light-grey"
                      }`}
                  >
                    Bad Nostronauts
                  </button>
                </div>
              </div>

              {showGoodNostronauts && (
                <GoodNostronautsTable goodNostronauts={goodAccounts} />
              )}

              {showBadNostronauts && (
                <BadNostronautsTable badNostronauts={badAccounts} />
              )}

            </>
          }
        />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
}

export default App;

