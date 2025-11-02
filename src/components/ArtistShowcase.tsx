import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/contexts/ThemeContext";
import ArtistDetailModal from "./ArtistDetailModal";

interface Artist {
  id: string;
  name: string;
  genre: string;
  bio?: string;
  image_url: string;
  color: string;
  instagram?: string;
  twitter?: string;
  spotify?: string;
  soundcloud?: string;
  featured: boolean;
  order_index: number;
}

export default function ArtistShowcase() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    const { data } = await supabase
      .from('artists')
      .select('*')
      .eq('featured', true)
      .order('order_index', { ascending: true });
    
    if (data) setArtists(data);
  };

  return (
    <>
      <section className="bg-white py-24 px-6 relative snap-section">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 animated-grid" />
        
        <div className="container mx-auto relative z-10">
          {/* Section Header */}
          <div className="mb-16 relative">
            <h2 className="text-7xl md:text-8xl font-black leading-none">
              OUR<br />
              <span style={{ color: theme?.secondary_color || '#EF4444' }}>ARTISTS</span>
            </h2>
            <div 
              className="absolute -top-8 right-0 w-32 h-32 border-8 rotate-45 hidden md:block"
              style={{ 
                backgroundColor: theme?.accent_color || '#FBBF24',
                borderColor: theme?.border_color || '#000000'
              }}
            />
          </div>

          {/* Artist Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artists.map((artist) => (
              <div
                key={artist.id}
                className="group relative cursor-pointer"
                onMouseEnter={() => setHoveredId(artist.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSelectedArtist(artist)}
              >
                {/* Card Container */}
                <div 
                  className={`
                    relative border-8 overflow-hidden
                    transition-all duration-300 ease-out
                    ${hoveredId === artist.id 
                      ? 'shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] -translate-y-2' 
                      : 'bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
                    }
                  `}
                  style={{ 
                    backgroundColor: hoveredId === artist.id ? artist.color : '#FFFFFF',
                    borderColor: theme?.border_color || '#000000'
                  }}
                >
                  {/* Artist Image */}
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={artist.image_url}
                      alt={artist.name}
                      className={`
                        w-full h-full object-cover
                        transition-all duration-300
                        ${hoveredId === artist.id ? 'scale-110 mix-blend-multiply opacity-70' : 'scale-100'}
                      `}
                    />
                  </div>

                  {/* Artist Info */}
                  <div 
                    className="p-6 bg-white border-t-8"
                    style={{ borderColor: theme?.border_color || '#000000' }}
                  >
                    <h3 className="text-3xl font-black mb-2 leading-tight">
                      {artist.name}
                    </h3>
                    <p className="text-lg font-bold uppercase tracking-wider">
                      {artist.genre}
                    </p>
                  </div>

                  {/* Rotated Label */}
                  <div 
                    className={`
                      absolute top-4 -right-12 px-12 py-2 border-4
                      rotate-45 transition-all duration-300
                    `}
                    style={{
                      backgroundColor: hoveredId === artist.id ? (theme?.border_color || '#000000') : (theme?.accent_color || '#FBBF24'),
                      color: hoveredId === artist.id ? (theme?.background_color || '#FFFFFF') : (theme?.border_color || '#000000'),
                      borderColor: theme?.border_color || '#000000'
                    }}
                  >
                    <span className="text-sm font-black uppercase">Featured</span>
                  </div>
                </div>

                {/* Decorative Corner Triangle */}
                <div 
                  className={`
                    absolute -bottom-4 -left-4 w-0 h-0 
                    border-l-[40px] border-l-transparent
                    border-b-[40px]
                    transition-all duration-300
                    ${hoveredId === artist.id ? 'opacity-100' : 'opacity-0'}
                  `}
                  style={{ borderBottomColor: theme?.border_color || '#000000' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <ArtistDetailModal 
        artist={selectedArtist}
        open={!!selectedArtist}
        onClose={() => setSelectedArtist(null)}
      />
    </>
  );
}