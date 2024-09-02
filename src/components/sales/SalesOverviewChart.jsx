import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesOverviewChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTimeRange, setSelectedTimeRange] = useState('365'); // Default to 365 days

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart', {
                    params: {
                        vs_currency: 'usd',
                        days: selectedTimeRange, // Use the selected time range
                    }
                });

                const prices = response.data.prices;
                const monthlyData = prices.reduce((acc, [timestamp, price]) => {
                    const date = new Date(timestamp);
                    const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;

                    if (!acc[yearMonth]) {
                        acc[yearMonth] = { month: new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), total: 0, count: 0 };
                    }

                    acc[yearMonth].total += price;
                    acc[yearMonth].count += 1;

                    return acc;
                }, {});

                const formattedData = Object.values(monthlyData).map(({ month, total, count }) => ({
                    month,
                    price: (total / count).toFixed(2) // Average sales price
                }));

                setData(formattedData);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedTimeRange]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold text-gray-100'>Sales Overview</h2>
                <select
                    className='bg-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                >
                    <option value="7">This Week</option>
                    <option value="30">This Month</option>
                    <option value="90">This Quarter</option>
                    <option value="365">This Year</option>
                </select>
            </div>
            <div className='w-full h-80'>
                <ResponsiveContainer>
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                        <XAxis dataKey='month' stroke='#9CA3AF' />
                        <YAxis stroke='#9CA3AF' />
                        <Tooltip
                            contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
                            itemStyle={{ color: "#E5E7EB" }}
                        />
                        <Area type='monotone' dataKey='price' stroke='#8B5CF6' fill='#8B5CF6' fillOpacity={0.3} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default SalesOverviewChart;
