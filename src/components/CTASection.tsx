import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Music, Users, Radio } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function CTASection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { theme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setEmail("");
      setIsSubmitted(false);
    }, 3000);
  };

  const handleSubmitDemo = () => {
    // Open Tally form in new tab
    window.open('https://tally.so/r/wkQjdP', '_blank');
  };

  return (
    <section className="bg-white py-24 px-6 relative overflow-hidden snap-section">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 animated-grid" />
      
      {/* Background Geometric Shapes */}
      <div 
        className="absolute top-10 left-10 w-64 h-64 border-8 -rotate-12 opacity-20"
        style={{ 
          backgroundColor: theme?.secondary_color || '#EF4444',
          borderColor: theme?.border_color || '#000000'
        }}
      />
      <div 
        className="absolute bottom-10 right-10 w-48 h-48 rounded-full border-8 opacity-20"
        style={{ 
          backgroundColor: theme?.primary_color || '#3B82F6',
          borderColor: theme?.border_color || '#000000'
        }}
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-8 rotate-45 opacity-10"
        style={{ 
          backgroundColor: theme?.accent_color || '#FBBF24',
          borderColor: theme?.border_color || '#000000'
        }}
      />

      <div className="container mx-auto relative z-10">
        {/* Main CTA Content */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-6xl md:text-8xl font-black leading-none mb-8">
            JOIN THE
            <span 
              className="block -mt-2"
              style={{ color: theme?.secondary_color || '#EF4444' }}
            >
              MOVEMENT
            </span>
          </h2>
          <p className="text-2xl md:text-3xl font-bold mb-12 max-w-2xl mx-auto">
            STAY UPDATED WITH EXCLUSIVE RELEASES, ARTIST NEWS & BEHIND-THE-SCENES CONTENT
          </p>

          {/* Newsletter Form */}
          <div className="max-w-2xl mx-auto mb-16">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="YOUR EMAIL ADDRESS"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 h-16 text-lg font-bold border-4 focus:ring-4 px-6"
                  style={{ 
                    borderColor: theme?.border_color || '#000000',
                    '--tw-ring-color': theme?.accent_color || '#FBBF24'
                  } as React.CSSProperties}
                />
                <Button
                  type="submit"
                  size="lg"
                  className="text-white border-4 transition-all duration-200 text-xl font-black px-12 h-16 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 whitespace-nowrap"
                  style={{
                    backgroundColor: theme?.secondary_color || '#EF4444',
                    borderColor: theme?.border_color || '#000000'
                  }}
                >
                  SUBSCRIBE
                </Button>
              </form>
            ) : (
              <div 
                className="border-4 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                style={{ 
                  backgroundColor: theme?.extra_color_1 || '#10B981',
                  borderColor: theme?.border_color || '#000000'
                }}
              >
                <p className="text-2xl font-black text-white">
                  ✓ YOU'RE IN! CHECK YOUR EMAIL.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Listen Button */}
          <div className="group">
            <Button
              size="lg"
              className="w-full h-auto flex flex-col items-center gap-4 text-white border-4 transition-all duration-200 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
              style={{
                backgroundColor: theme?.primary_color || '#3B82F6',
                borderColor: theme?.border_color || '#000000'
              }}
            >
              <Music className="w-16 h-16" />
              <span className="text-2xl font-black">LISTEN NOW</span>
              <span className="text-sm font-bold opacity-90">Stream on all platforms</span>
            </Button>
            <div 
              className="mt-4 h-2 border-2 transition-all duration-300"
              style={{ 
                backgroundColor: theme?.primary_color || '#3B82F6',
                borderColor: theme?.border_color || '#000000'
              }}
            />
          </div>

          {/* Explore Roster Button */}
          <div className="group">
            <Button
              size="lg"
              className="w-full h-auto flex flex-col items-center gap-4 border-4 transition-all duration-200 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
              style={{
                backgroundColor: theme?.accent_color || '#FBBF24',
                color: theme?.border_color || '#000000',
                borderColor: theme?.border_color || '#000000'
              }}
            >
              <Users className="w-16 h-16" />
              <span className="text-2xl font-black">EXPLORE ROSTER</span>
              <span className="text-sm font-bold opacity-90">Meet our artists</span>
            </Button>
            <div 
              className="mt-4 h-2 border-2 transition-all duration-300"
              style={{ 
                backgroundColor: theme?.accent_color || '#FBBF24',
                borderColor: theme?.border_color || '#000000'
              }}
            />
          </div>

          {/* Submit Demo Button */}
          <div className="group">
            <Button
              onClick={handleSubmitDemo}
              size="lg"
              className="w-full h-auto flex flex-col items-center gap-4 text-white border-4 transition-all duration-200 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
              style={{
                backgroundColor: theme?.border_color || '#000000',
                borderColor: theme?.border_color || '#000000'
              }}
            >
              <Radio className="w-16 h-16" />
              <span className="text-2xl font-black">SUBMIT DEMO</span>
              <span className="text-sm font-bold opacity-90">Join our label</span>
            </Button>
            <div 
              className="mt-4 h-2 border-2 transition-all duration-300"
              style={{ 
                backgroundColor: theme?.border_color || '#000000',
                borderColor: theme?.border_color || '#000000'
              }}
            />
          </div>
        </div>

        {/* Decorative Bottom Elements */}
        <div className="mt-20 flex justify-center items-center gap-8">
          <div 
            className="w-24 h-24 border-8 rotate-45"
            style={{ 
              backgroundColor: theme?.secondary_color || '#EF4444',
              borderColor: theme?.border_color || '#000000'
            }}
          />
          <div 
            className="w-32 h-32 rounded-full border-8"
            style={{ 
              backgroundColor: theme?.accent_color || '#FBBF24',
              borderColor: theme?.border_color || '#000000'
            }}
          />
          <div 
            className="w-24 h-24 border-8 -rotate-12"
            style={{ 
              backgroundColor: theme?.primary_color || '#3B82F6',
              borderColor: theme?.border_color || '#000000'
            }}
          />
        </div>
      </div>
    </section>
  );
}