import { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const UserGrowthChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart', {
                    params: {
                        vs_currency: 'usd',
                        days: '365',
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
                    price: (total / count).toFixed(2) 
                }));

                setData(formattedData);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
	return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 w-[100%]'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <h2 className='text-xl font-semibold text-gray-100 mb-4'>User Growth</h2>
            <div className='w-[100%] h-[420px]'>
                <ResponsiveContainer width='100%' height='100%'>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                        <XAxis dataKey='month' stroke='#9CA3AF' />
                        <YAxis stroke='#9CA3AF' />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(31, 41, 55, 0.8)",
                                borderColor: "#4B5563",
                            }}
                            itemStyle={{ color: "#E5E7EB" }}
                        />
                        <Line
                            type='monotone'
                            dataKey='price'
                            stroke='#8B5CF6'
                            strokeWidth={2}
                            dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default UserGrowthChart;