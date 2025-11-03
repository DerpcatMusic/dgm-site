import { useEffect } from "react";
import HeroSection from "./HeroSection";
import ArtistShowcase from "./ArtistShowcase";
import FeaturedReleases from "./FeaturedReleases";
import CTASection from "./CTASection";

function Home() {
  useEffect(() => {
    const container = document.querySelector('.snap-container');
    if (!container) return;

    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout;

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) {
        e.preventDefault();
        return;
      }

      const sections = document.querySelectorAll('.snap-section');
      const currentScroll = container.scrollTop;
      const containerHeight = container.clientHeight;
      
      let currentSection = 0;
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          currentSection = index;
        }
      });

      if (e.deltaY > 0 && currentSection < sections.length - 1) {
        e.preventDefault();
        isScrolling = true;
        const nextSection = sections[currentSection + 1] as HTMLElement;
        container.scrollTo({
          top: nextSection.offsetTop,
          behavior: 'smooth'
        });
      } else if (e.deltaY < 0 && currentSection > 0) {
        e.preventDefault();
        isScrolling = true;
        const prevSection = sections[currentSection - 1] as HTMLElement;
        container.scrollTo({
          top: prevSection.offsetTop,
          behavior: 'smooth'
        });
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 1000);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      clearTimeout(scrollTimeout);
    };
  }, []);

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