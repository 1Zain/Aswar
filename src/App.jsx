import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import CryptoPage from "./pages/CryptoPage";
import StockPage from "./pages/StockPage";
import CommodityChartPage from "./pages/CommodityChartPage";

function App() {
	return (
		<div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
			<div className='fixed inset-0 z-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
				<div className='absolute inset-0 backdrop-blur-sm' />
			</div>

			{/* Alpha Vantage API Give only 25 requests per day. */}

			<Sidebar />
			<Routes>
				<Route path='/' element={<OverviewPage />} />
				<Route path='/cryptocurrency' element={<CryptoPage />} />
				<Route path='/stock' element={<StockPage />} />
				<Route path='/commodity' element={<CommodityChartPage />} />
			</Routes>
		</div>
	);
}

export default App;
