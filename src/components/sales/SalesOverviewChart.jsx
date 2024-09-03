import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesOverviewChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState('MSFT'); // Default to Microsoft
    const [companyName, setCompanyName] = useState('Microsoft');
    const apiKey = 'AT1SJHA2FJU0MKO2';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://www.alphavantage.co/query', {
                    params: {
                        function: 'TIME_SERIES_DAILY',
                        symbol: selectedCompany,
                        apikey: apiKey
                    }
                });

                const stockData = response.data['Time Series (Daily)'];
                
                if (!stockData) {
                    throw new Error('No data available for the selected company.');
                }

                const formattedData = Object.entries(stockData).map(([date, value]) => ({
                    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    price: parseFloat(value['4. close']).toFixed(2)
                })).reverse(); // Reverse to show the most recent data last

                setData(formattedData);
                setLoading(false);
            } catch (err) {
                setError(err.message || 'An error occurred while fetching data.');
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedCompany]);

    useEffect(() => {
        setCompanyName(selectedCompany === 'MSFT' ? 'Microsoft' : 'Google');
    }, [selectedCompany]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold text-gray-100'>{companyName} Stock Price Overview</h2>
                <select
                    className='bg-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                >
                    <option value="MSFT">Microsoft</option>
                    <option value="GOOGL">Google</option>
                </select>
            </div>
            <div className='w-full h-80'>
                <ResponsiveContainer>
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                        <XAxis dataKey='date' stroke='#9CA3AF' />
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
