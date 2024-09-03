import Header from "../components/common/Header";
import CommodityChart from "../components/Commodity/CommodityChart";


const AnalyticsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title={"Commodity Prices"} />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				
				<CommodityChart />

			</main>
		</div>
	);
};
export default AnalyticsPage;
