import Header from "../components/common/Header";
import CryptoTable from "../components/Cryptocurrency/CryptocurrencyTable";

const Cryptocurrency = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Cryptocurrency' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				

				<CryptoTable />

				
				
			</main>
		</div>
	);
};
export default Cryptocurrency;
