import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Music2, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "@/contexts/ThemeContext";

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
}

interface Props {
  release: Release | null;
  open: boolean;
  onClose: () => void;
}

export default function ReleaseDetailModal({ release, open, onClose }: Props) {
  const { theme } = useTheme();
  
  if (!release) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-8 p-0 overflow-hidden" style={{ borderColor: theme?.border_color || '#000000' }}>
        <div>
          {/* Artwork */}
          <div className="relative aspect-square">
            <img 
              src={release.artwork_url} 
              alt={release.title}
              className="w-full h-full object-cover"
            />
            <div 
              className="absolute bottom-0 left-0 right-0 h-4"
              style={{ backgroundColor: release.color }}
            />
          </div>

          {/* Content */}
          <div className="p-8 bg-white">
            <DialogHeader>
              <DialogTitle className="text-4xl font-black leading-tight mb-2">
                {release.title}
              </DialogTitle>
            </DialogHeader>

            <p className="text-2xl font-bold mb-2">{release.artist_name}</p>
            <p 
              className="text-lg font-black mb-8 inline-block px-3 py-1"
              style={{ 
                backgroundColor: theme?.border_color || '#000000',
                color: theme?.background_color || '#FFFFFF'
              }}
            >
              {release.year}
            </p>

            {/* Streaming Links */}
            <div className="space-y-3">
              <h3 className="text-xl font-black mb-4">LISTEN NOW</h3>
              
              {release.spotify_url && (
                <Button
                  className="w-full justify-between h-14 border-4 font-black text-lg transition-all hover:scale-105"
                  style={{ 
                    backgroundColor: release.color,
                    borderColor: theme?.border_color || '#000000'
                  }}
                  onClick={() => window.open(release.spotify_url, '_blank')}
                >
                  <span className="flex items-center gap-3">
                    <Music2 className="w-6 h-6" />
                    Spotify
                  </span>
                  <ExternalLink className="w-5 h-5" />
                </Button>
              )}

              {release.apple_music_url && (
                <Button
                  className="w-full justify-between h-14 border-4 font-black text-lg transition-all hover:scale-105"
                  style={{ 
                    backgroundColor: release.color,
                    borderColor: theme?.border_color || '#000000'
                  }}
                  onClick={() => window.open(release.apple_music_url, '_blank')}
                >
                  <span className="flex items-center gap-3">
                    <Music2 className="w-6 h-6" />
                    Apple Music
                  </span>
                  <ExternalLink className="w-5 h-5" />
                </Button>
              )}

              {release.soundcloud_url && (
                <Button
                  className="w-full justify-between h-14 border-4 font-black text-lg transition-all hover:scale-105"
                  style={{ 
                    backgroundColor: release.color,
                    borderColor: theme?.border_color || '#000000'
                  }}
                  onClick={() => window.open(release.soundcloud_url, '_blank')}
                >
                  <span className="flex items-center gap-3">
                    <Music2 className="w-6 h-6" />
                    SoundCloud
                  </span>
                  <ExternalLink className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
