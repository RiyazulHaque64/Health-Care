import HeroSection from "../components/UI/HomePage/HeroSection/HeroSection";
import TopRatedDoctors from "../components/UI/HomePage/TopRatedDoctors/TopRatedDoctors";
import Specialist from "../components/UI/Specialist/Specialist";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <Specialist />
      <TopRatedDoctors />
    </>
  );
};

export default HomePage;
