// src/pages/Home.tsx
import HOME from '../components/sections/Home';
// import PRICING from '../pages/Pricing';
import Help from "../pages/Help";
import Services from '../components/sections/Services';
import AboutSection from '../components/sections/AboutSection';

export const Home = () => {
  return (
    <main className="space-y-4">
      <HOME/>
      <Services/>
      <Help />
      <AboutSection/>

      {/* <PRICING /> */}
    </main>
  );
};

export default Home;