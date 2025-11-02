import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/contexts/ThemeContext";
import ReleaseDetailModal from "./ReleaseDetailModal";

interface Release {
  id: string;
  title: string;
  artist_name: string;
  artwork_url: string;
  year: string;
  color: string;
  spotify_url?: string;
  apple_music_url?: string;
  soundcloud_url?: string;
  featured: boolean;
  order_index: number;
}

export default function FeaturedReleases() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [releases, setReleases] = useState<Release[]>([]);
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    const { data } = await supabase
      .from('releases')
      .select('*')
      .eq('featured', true)
      .order('order_index', { ascending: true });
    
    if (data) setReleases(data);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <>
      <section 
        className="py-24 px-6 relative overflow-hidden snap-section"
        style={{ backgroundColor: theme?.border_color || '#000000' }}
      >
        {/* Animated Grid Background */}
        <div className="absolute inset-0 animated-grid opacity-20" />
        
        {/* Decorative Shapes */}
        <div 
          className="absolute top-20 right-20 w-40 h-40 border-8 rotate-12"
          style={{ 
            backgroundColor: theme?.accent_color || '#FBBF24',
            borderColor: theme?.background_color || '#FFFFFF'
          }}
        />
        <div 
          className="absolute bottom-20 left-20 w-32 h-32 rounded-full border-8"
          style={{ 
            backgroundColor: theme?.secondary_color || '#EF4444',
            borderColor: theme?.background_color || '#FFFFFF'
          }}
        />

        <div className="container mx-auto relative z-10">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 
                className="text-6xl md:text-7xl font-black leading-none mb-4"
                style={{ color: theme?.background_color || '#FFFFFF' }}
              >
                FEATURED<br />
                <span style={{ color: theme?.accent_color || '#FBBF24' }}>RELEASES</span>
              </h2>
              <p 
                className="text-xl font-bold border-l-8 pl-6"
                style={{ 
                  color: theme?.background_color || '#FFFFFF',
                  borderColor: theme?.accent_color || '#FBBF24'
                }}
              >
                LATEST DROPS FROM OUR ROSTER
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="hidden md:flex gap-4">
              <Button
                onClick={() => scroll("left")}
                size="icon"
                className="w-16 h-16 border-4 transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:translate-x-0.5 hover:translate-y-0.5"
                style={{
                  backgroundColor: theme?.background_color || '#FFFFFF',
                  color: theme?.border_color || '#000000',
                  borderColor: theme?.background_color || '#FFFFFF'
                }}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
              <Button
                onClick={() => scroll("right")}
                size="icon"
                className="w-16 h-16 border-4 transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:translate-x-0.5 hover:translate-y-0.5"
                style={{
                  backgroundColor: theme?.background_color || '#FFFFFF',
                  color: theme?.border_color || '#000000',
                  borderColor: theme?.background_color || '#FFFFFF'
                }}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </div>
          </div>

          {/* Scrolling Container */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {releases.map((release, index) => (
              <div
                key={release.id}
                className="flex-shrink-0 w-80 snap-start group cursor-pointer"
                onClick={() => setSelectedRelease(release)}
              >
                {/* Album Frame */}
                <div 
                  className={`
                    relative border-8 overflow-hidden
                    transition-all duration-300
                    ${index % 2 === 0 ? 'rotate-2' : '-rotate-2'}
                    group-hover:rotate-0 group-hover:scale-105
                    shadow-[12px_12px_0px_0px_rgba(255,255,255,0.3)]
                    group-hover:shadow-[16px_16px_0px_0px_rgba(255,255,255,0.5)]
                  `}
                  style={{ borderColor: theme?.background_color || '#FFFFFF' }}
                >
                  {/* Artwork */}
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={release.artwork_url}
                      alt={release.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  {/* Color Accent Bar */}
                  <div className="h-3" style={{ backgroundColor: release.color }} />

                  {/* Release Info */}
                  <div 
                    className="p-6 border-t-8"
                    style={{ 
                      backgroundColor: theme?.background_color || '#FFFFFF',
                      borderColor: theme?.border_color || '#000000'
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-2xl font-black leading-tight flex-1">
                        {release.title}
                      </h3>
                      <span 
                        className="text-sm font-black px-3 py-1 ml-2"
                        style={{
                          backgroundColor: theme?.border_color || '#000000',
                          color: theme?.background_color || '#FFFFFF'
                        }}
                      >
                        {release.year}
                      </span>
                    </div>
                    <p className="text-lg font-bold uppercase tracking-wide">
                      {release.artist_name}
                    </p>
                  </div>

                  {/* Geometric Accent */}
                  <div 
                    className={`
                      absolute -top-4 -right-4 w-16 h-16 border-4 rotate-45
                      transition-all duration-300
                      group-hover:rotate-90
                    `}
                    style={{ 
                      backgroundColor: release.color,
                      borderColor: theme?.background_color || '#FFFFFF'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Navigation Hint */}
          <div className="md:hidden text-center mt-8">
            <p 
              className="font-bold text-sm uppercase tracking-wider"
              style={{ color: theme?.background_color || '#FFFFFF' }}
            >
              ← Swipe to explore →
            </p>
          </div>
        </div>
      </section>

      <ReleaseDetailModal 
        release={selectedRelease}
        open={!!selectedRelease}
        onClose={() => setSelectedRelease(null)}
      />
    </>
  );
}