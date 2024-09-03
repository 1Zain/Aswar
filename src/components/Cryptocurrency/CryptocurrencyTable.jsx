import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Pusher from "pusher-js";
import axios from "axios";
import { Search } from "lucide-react";

const CryptocurrencyTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 10,
            page: 1,
          },
        });
        setAllData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching cryptocurrency data:", error);
      }
    };

    fetchData();

// the Pusher key and Pusher cluster is provided when you create an application in the Pusher Dashboard.
// Pusher is another option for implementing real-time communication in your applications,
// and it can be considered a third-party service.
// Pusher uses WebSockets (among other protocols) to deliver real-time updates.

    const pusher = new Pusher('YOUR_PUSHER_KEY', {
      cluster: 'YOUR_PUSHER_CLUSTER'
    });
    const channel = pusher.subscribe('crypto-updates');

    channel.bind('update', (data) => {
      setAllData((prevData) => {
        const updatedData = prevData.map((crypto) =>
          data.find((item) => item.id === crypto.id) || crypto
        );
        setFilteredData(updatedData);
        return updatedData;
      });
    });

    return () => {
      pusher.unsubscribe('crypto-updates');
      pusher.disconnect();
    };
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = allData.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(term) ||
        crypto.symbol.toLowerCase().includes(term)
    );

    setFilteredData(filtered);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Cryptocurrency List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Symbol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Market Cap</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">24h Change</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredData.map((crypto) => (
              <motion.tr
                key={crypto.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center">
                  <img
                    src={crypto.image}
                    alt={`${crypto.name} logo`}
                    className="size-10 rounded-full"
                  />
                  {crypto.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {crypto.symbol.toUpperCase()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  ${crypto.current_price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  ${crypto.market_cap.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {crypto.price_change_percentage_24h.toFixed(2)}%
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default CryptocurrencyTable;
