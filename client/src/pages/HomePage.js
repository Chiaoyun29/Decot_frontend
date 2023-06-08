import Navbar from '../components/Home/Navbar';
import Carousel from '../components/Home/Carousel';
import Footer from '../components/Home/Footer';
import logo from "../image/DECOT.png";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Carousel className="flex-grow" />
      <Footer />
    </div>
  );
};

export default HomePage;