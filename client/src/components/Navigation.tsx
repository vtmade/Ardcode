import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Home, Menu, X } from "lucide-react";
import { useArtwork } from "@/lib/stores/useArtwork";
import { ARTWORKS } from "@/types/artwork";

export default function Navigation() {
  const { currentArtwork, setCurrentArtwork } = useArtwork();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastInteraction, setLastInteraction] = useState(Date.now());

  // Auto-hide navigation after inactivity
  useEffect(() => {
    const handleActivity = () => {
      setLastInteraction(Date.now());
      setIsVisible(true);
    };

    const checkInactivity = () => {
      if (Date.now() - lastInteraction > 3000) {
        setIsVisible(false);
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touch', handleActivity);

    const interval = setInterval(checkInactivity, 1000);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touch', handleActivity);
      clearInterval(interval);
    };
  }, [lastInteraction]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        previousArtwork();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        nextArtwork();
      } else if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentArtwork]);

  // Scroll navigation
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    let lastScrollTime = 0;
    const scrollCooldown = 800; // Prevent rapid scrolling

    const handleScroll = (e: WheelEvent) => {
      e.preventDefault();
      
      const now = Date.now();
      if (now - lastScrollTime < scrollCooldown) {
        return;
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (e.deltaY > 0) {
          // Scrolling down - next artwork
          nextArtwork();
        } else if (e.deltaY < 0) {
          // Scrolling up - previous artwork
          previousArtwork();
        }
        lastScrollTime = Date.now();
      }, 50);
    };

    // Also handle touch swipe for mobile
    let touchStartY = 0;
    let touchEndY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndY = e.changedTouches[0].screenY;
      const diff = touchStartY - touchEndY;
      
      const now = Date.now();
      if (now - lastScrollTime < scrollCooldown) {
        return;
      }

      if (Math.abs(diff) > 50) { // Minimum swipe distance
        if (diff > 0) {
          // Swipe up - next artwork
          nextArtwork();
        } else {
          // Swipe down - previous artwork
          previousArtwork();
        }
        lastScrollTime = Date.now();
      }
    };

    window.addEventListener('wheel', handleScroll, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentArtwork]);

  const nextArtwork = () => {
    const nextIndex = (currentArtwork + 1) % ARTWORKS.length;
    setCurrentArtwork(nextIndex);
  };

  const previousArtwork = () => {
    const prevIndex = currentArtwork === 0 ? ARTWORKS.length - 1 : currentArtwork - 1;
    setCurrentArtwork(prevIndex);
  };

  const currentArtworkData = ARTWORKS[currentArtwork];

  return (
    <>
      {/* Combined Navigation and Instructions at Bottom */}
      <nav className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}>
        <div className="glass p-2 m-2 rounded-lg">
          <div className="flex items-center justify-between">
            {/* Left: Logo */}
            <div className="flex items-center space-x-2">
              <h1 className="zen-title text-lg tracking-widest">ard. by vinay thakur</h1>
            </div>

            {/* Center: Navigation Instructions */}
            <div className="flex-1 mx-6">
              <div className="flex items-center justify-center space-x-4 text-xs zen-subtitle mb-1">
                <span>Scroll to next • Touch/Click to interact</span>
              </div>
              {/* Compact Progress Bar */}
              <div className="h-0.5 bg-stone-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${((currentArtwork + 1) / ARTWORKS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center space-x-1">
              <button
                onClick={previousArtwork}
                className="p-1.5 rounded glass hover:bg-stone-700/20 transition-colors"
                title="Previous (←)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <button
                onClick={nextArtwork}
                className="p-1.5 rounded glass hover:bg-stone-700/20 transition-colors"
                title="Next (→)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1.5 rounded glass hover:bg-stone-700/20 transition-colors"
                title="Menu"
              >
                {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Side Menu */}
      <div className={`fixed top-0 right-0 h-full w-80 z-50 transform transition-transform duration-300 ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="glass h-full p-6 m-4 rounded-lg overflow-y-auto">
          <div className="mb-6">
            <h3 className="zen-title text-xl mb-2">Gallery</h3>
            <p className="zen-subtitle text-sm">
              Explore philosophical concepts through interactive art
            </p>
          </div>

          <div className="space-y-3">
            {ARTWORKS.map((artwork, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentArtwork(index);
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                  index === currentArtwork 
                    ? 'bg-primary/20 border border-primary/40' 
                    : 'glass hover:bg-stone-700/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="zen-subtitle text-xs">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    artwork.type === '3D' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'
                  }`}>
                    {artwork.type}
                  </span>
                </div>
                <h4 className="zen-title text-sm mb-1">{artwork.title}</h4>
                <p className="zen-subtitle text-xs opacity-70">{artwork.philosophy}</p>
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-stone-700">
            <div className="zen-subtitle text-xs space-y-2">
              <p><strong>Controls:</strong></p>
              <p>Scroll/Swipe: Navigate artworks</p>
              <p>← → or A/D: Also navigate</p>
              <p>Mouse/Touch: Interact with art</p>
              <p>ESC: Close menu</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}


    </>
  );
}
