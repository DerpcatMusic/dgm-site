import { Button } from "./ui/button";
import { ChevronDown, Radio } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function HeroSection() {
  const { theme } = useTheme();
  
  const handleSubmitDemo = () => {
    window.open('https://tally.so/r/wkQjdP', '_blank');
  };
  
  return (
    <section className="relative h-screen bg-white overflow-hidden snap-section flex flex-col justify-center">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 animated-grid" />
      
      {/* Geometric Background Shapes */}
      <div 
        className="absolute top-20 right-10 w-64 h-64 border-8 rotate-12 -z-10"
        style={{ 
          backgroundColor: theme?.accent_color || '#FFD60A',
          borderColor: theme?.border_color || '#000000'
        }}
      />
      <div 
        className="absolute bottom-32 left-20 w-48 h-48 rounded-full border-8 -z-10"
        style={{ 
          backgroundColor: theme?.primary_color || '#E63946',
          borderColor: theme?.border_color || '#000000'
        }}
      />
      <div 
        className="absolute top-1/3 left-1/4 w-32 h-32 border-8 -rotate-45 -z-10"
        style={{ 
          backgroundColor: theme?.extra_color_1 || '#457B9D',
          borderColor: theme?.border_color || '#000000'
        }}
      />
      
      {/* Main Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Typography */}
          <div className="space-y-8">
            <div className="relative">
              <h1 className="text-7xl md:text-9xl font-black leading-none tracking-tighter">
                {theme?.label_name?.split(' ')[0] || 'DOLMEN'}
                <span 
                  className="block -mt-4"
                  style={{ color: theme?.primary_color || '#E63946' }}
                >
                  {theme?.label_name?.split(' ')[1] || 'GATE'}
                </span>
                <span 
                  className="block -mt-4"
                  style={{ color: theme?.extra_color_1 || '#457B9D' }}
                >
                  {theme?.label_name?.split(' ')[2] || 'MEDIA'}
                </span>
              </h1>
              <div 
                className="absolute -right-8 top-1/2 w-24 h-24 border-8 rotate-45"
                style={{ 
                  backgroundColor: theme?.accent_color || '#FFD60A',
                  borderColor: theme?.border_color || '#000000'
                }}
              />
            </div>
            
            <p 
              className="text-2xl font-bold max-w-md border-l-8 pl-6"
              style={{ borderColor: theme?.border_color || '#000000' }}
            >
              WHERE BOLD SOUNDS MEET FEARLESS ARTISTS
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                size="lg"
                className="border-4 hover:bg-white hover:text-black transition-all duration-200 text-xl font-black px-8 py-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
                style={{
                  backgroundColor: theme?.border_color || '#000000',
                  color: theme?.background_color || '#F1FAEE',
                  borderColor: theme?.border_color || '#000000'
                }}
              >
                EXPLORE ROSTER
              </Button>
              <Button 
                size="lg"
                className="text-white border-4 transition-all duration-200 text-xl font-black px-8 py-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
                style={{
                  backgroundColor: theme?.primary_color || '#E63946',
                  borderColor: theme?.border_color || '#000000'
                }}
              >
                LISTEN NOW
              </Button>
            </div>
          </div>
          
          {/* Right Column - Visual Element */}
          <div className="relative h-[500px] hidden lg:block">
            <div 
              className="absolute inset-0 border-8 rotate-3 overflow-hidden"
              style={{ 
                backgroundColor: theme?.extra_color_1 || '#457B9D',
                borderColor: theme?.border_color || '#000000'
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80" 
                alt="Music Studio"
                className="w-full h-full object-cover"
              />
            </div>
            <div 
              className="absolute -bottom-12 -right-12 w-48 h-48 border-8 rounded-full flex items-center justify-center"
              style={{ 
                backgroundColor: theme?.accent_color || '#FFD60A',
                borderColor: theme?.border_color || '#000000'
              }}
            >
              <span className="text-4xl font-black rotate-12">EST.<br/>2024</span>
            </div>
            
            {/* Submit Demo Badge */}
            <button
              onClick={handleSubmitDemo}
              className="absolute -top-8 -left-8 w-32 h-32 border-8 rounded-full flex flex-col items-center justify-center transition-all duration-200 hover:scale-110 hover:rotate-12 group"
              style={{ 
                backgroundColor: theme?.primary_color || '#E63946',
                borderColor: theme?.border_color || '#000000'
              }}
            >
              <Radio className="w-8 h-8 text-white mb-1" />
              <span className="text-xs font-black text-white text-center leading-tight">SUBMIT<br/>DEMO</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Animated Scroll Arrow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-slow z-20">
        <span className="text-sm font-black uppercase tracking-wider">Scroll</span>
        <ChevronDown 
          className="w-8 h-8" 
          style={{ color: theme?.border_color || '#000000' }}
        />
      </div>
      
      {/* Bottom Accent */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-4"
        style={{ backgroundColor: theme?.border_color || '#000000' }}
      />
    </section>
  );
}