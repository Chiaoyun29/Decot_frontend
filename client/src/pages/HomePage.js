import Navbar from '../components/Home/Navbar';
import Main from '../components/Home/Main';
import Footer from '../components/Home/Footer';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Main/>
      <Footer />
    </div>
  );
};

export default HomePage;