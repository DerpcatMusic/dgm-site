import HeroSection from "./HeroSection";
import ArtistShowcase from "./ArtistShowcase";
import FeaturedReleases from "./FeaturedReleases";
import CTASection from "./CTASection";

function Home() {
  return (
    <div className="snap-container">
      <HeroSection />
      <ArtistShowcase />
      <FeaturedReleases />
      <CTASection />
    </div>
  );
}

export default Home;