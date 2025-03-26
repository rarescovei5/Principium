import Hero from '../layouts/Home/Hero';
import Navbar from '../layouts/Navbar';

const Home = () => {
  return (
    <div className="flex flex-col gap-10">
      <Navbar />
      <Hero />
    </div>
  );
};

export default Home;
