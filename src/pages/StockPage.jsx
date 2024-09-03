import Header from "../components/common/Header";
import StockCh from "../components/Stock/StockChart";


const SalesPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='stock prices' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				
				<StockCh />

				
			</main>
		</div>
	);
};
export default SalesPage;
