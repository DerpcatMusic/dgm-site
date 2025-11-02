import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Instagram, Twitter, Music2, Cloud } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "@/contexts/ThemeContext";

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
}

interface Props {
  artist: Artist | null;
  open: boolean;
  onClose: () => void;
}

export default function ArtistDetailModal({ artist, open, onClose }: Props) {
  const { theme } = useTheme();
  
  if (!artist) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl border-8 p-0 overflow-hidden" style={{ borderColor: theme?.border_color || '#000000' }}>
        <div className="grid md:grid-cols-2">
          {/* Image Side */}
          <div className="relative aspect-square md:aspect-auto">
            <img 
              src={artist.image_url} 
              alt={artist.name}
              className="w-full h-full object-cover"
            />
            <div 
              className="absolute inset-0 mix-blend-multiply opacity-30"
              style={{ backgroundColor: artist.color }}
            />
          </div>

          {/* Content Side */}
          <div className="p-8 bg-white">
            <DialogHeader>
              <DialogTitle className="text-5xl font-black leading-tight mb-4">
                {artist.name}
              </DialogTitle>
            </DialogHeader>

            <div 
              className="inline-block px-4 py-2 mb-6 border-4 font-black text-sm"
              style={{ 
                backgroundColor: artist.color,
                borderColor: theme?.border_color || '#000000'
              }}
            >
              {artist.genre}
            </div>

            {artist.bio && (
              <p className="text-lg mb-8 leading-relaxed">
                {artist.bio}
              </p>
            )}

            {/* Social Links */}
            <div className="space-y-3">
              <h3 className="text-xl font-black mb-4">CONNECT</h3>
              
              {artist.instagram && (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-12 border-4 font-bold hover:scale-105 transition-transform"
                  style={{ borderColor: theme?.border_color || '#000000' }}
                  onClick={() => window.open(artist.instagram, '_blank')}
                >
                  <Instagram className="w-5 h-5" />
                  Instagram
                </Button>
              )}

              {artist.twitter && (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-12 border-4 font-bold hover:scale-105 transition-transform"
                  style={{ borderColor: theme?.border_color || '#000000' }}
                  onClick={() => window.open(artist.twitter, '_blank')}
                >
                  <Twitter className="w-5 h-5" />
                  Twitter
                </Button>
              )}

              {artist.spotify && (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-12 border-4 font-bold hover:scale-105 transition-transform"
                  style={{ borderColor: theme?.border_color || '#000000' }}
                  onClick={() => window.open(artist.spotify, '_blank')}
                >
                  <Music2 className="w-5 h-5" />
                  Spotify
                </Button>
              )}

              {artist.soundcloud && (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-12 border-4 font-bold hover:scale-105 transition-transform"
                  style={{ borderColor: theme?.border_color || '#000000' }}
                  onClick={() => window.open(artist.soundcloud, '_blank')}
                >
                  <Cloud className="w-5 h-5" />
                  SoundCloud
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
