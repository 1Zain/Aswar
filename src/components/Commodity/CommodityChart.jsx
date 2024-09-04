import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";
import Pusher from "pusher-js";


const PUSHER_KEY = "YOUR_PUSHER_KEY";
const PUSHER_CLUSTER = "YOUR_PUSHER_CLUSTER";

const CommodityChart = () => {
    const [selectedTimeRange, setSelectedTimeRange] = useState("This Month");
    const [commodityData, setCommodityData] = useState([]);

    useEffect(() => {
       
        const fetchCommodityData = async () => {
            try {
                const apiKey = "7VPXE03PR76QEAY6"; 
                const symbols = ["GOLD", "OIL"]; 
                const fetchData = async (symbol) => {
                    const response = await axios.get(
                        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`
                    );
                    
                    if (response.data && response.data['Time Series (Daily)']) {
                        return response.data['Time Series (Daily)'];
                    } else {
                        console.error(`No data for symbol ${symbol}`);
                        return {};
                    }
                };

                const dataPromises = symbols.map(symbol => fetchData(symbol));
                const results = await Promise.all(dataPromises);

                const combinedData = [];
                const dates = new Set();

                results.forEach((data, index) => {
                    const symbol = symbols[index];
                    Object.keys(data).forEach(date => {
                        if (!dates.has(date)) dates.add(date);
                        if (!combinedData.find(d => d.date === date)) {
                            combinedData.push({ date });
                        }
                        combinedData.find(d => d.date === date)[symbol] = parseFloat(data[date]['4. close']);
                    });
                });

                setCommodityData(combinedData);
            } catch (error) {
                console.error("Error fetching commodity data", error);
            }
        };

        fetchCommodityData();

// the Pusher key and Pusher cluster is provided when you create an application in the Pusher Dashboard.
// Pusher is another option for implementing real-time communication in your applications,
// and it can be considered a third-party service.
// Pusher uses WebSockets (among other protocols) to deliver real-time updates.

        const pusher = new Pusher(PUSHER_KEY, {
            cluster: PUSHER_CLUSTER
        });
        const channel = pusher.subscribe('commodity-updates');

        channel.bind('update', (data) => {
            setCommodityData(prevData => {
                const updatedData = prevData.map(item => {
                    if (data.date === item.date) {
                        return { ...item, ...data.prices };
                    }
                    return item;
                });
                return updatedData;
            });
        });

        return () => {
            pusher.unsubscribe('commodity-updates');
            pusher.disconnect();
        };
    }, [selectedTimeRange]);

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-semibold text-gray-100'>Commodity Prices</h2>
                
            </div>

            <div style={{ width: "100%", height: 400 }}>
                <ResponsiveContainer>
                    <AreaChart data={commodityData}>
                        <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                        <XAxis dataKey='date' stroke='#9CA3AF' />
                        <YAxis stroke='#9CA3AF' />
                        <Tooltip
                            contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
                            itemStyle={{ color: "#E5E7EB" }}
                        />
                        <Legend />
                        <Area type='monotone' dataKey='GOLD' stroke='#FFD700' fill='#FFD700' fillOpacity={0.3} name="Gold" />
                        <Area type='monotone' dataKey='OIL' stroke='#000000' fill='#000000' fillOpacity={0.3} name="Oil" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default CommodityChart;
