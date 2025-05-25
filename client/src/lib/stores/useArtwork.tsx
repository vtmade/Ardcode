import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface ArtworkState {
  currentArtwork: number;
  isTransitioning: boolean;
  
  // Actions
  setCurrentArtwork: (index: number) => void;
  nextArtwork: () => void;
  previousArtwork: () => void;
  setTransitioning: (transitioning: boolean) => void;
}

export const useArtwork = create<ArtworkState>()(
  subscribeWithSelector((set, get) => ({
    currentArtwork: 0,
    isTransitioning: false,
    
    setCurrentArtwork: (index: number) => {
      const { currentArtwork } = get();
      if (index === currentArtwork) return;
      
      set({ isTransitioning: true });
      
      // Small delay for transition effect
      setTimeout(() => {
        set({ 
          currentArtwork: Math.max(0, Math.min(9, index)),
          isTransitioning: false 
        });
      }, 150);
    },
    
    nextArtwork: () => {
      const { currentArtwork } = get();
      const nextIndex = (currentArtwork + 1) % 10;
      get().setCurrentArtwork(nextIndex);
    },
    
    previousArtwork: () => {
      const { currentArtwork } = get();
      const prevIndex = currentArtwork === 0 ? 9 : currentArtwork - 1;
      get().setCurrentArtwork(prevIndex);
    },
    
    setTransitioning: (transitioning: boolean) => {
      set({ isTransitioning: transitioning });
    }
  }))
);

// Subscribe to artwork changes for any side effects
useArtwork.subscribe(
  (state) => state.currentArtwork,
  (currentArtwork) => {
    // Log artwork change for debugging
    console.log(`Switched to artwork ${currentArtwork + 1}`);
    
    // Update document title
    if (typeof document !== 'undefined') {
      const artworkTitles = [
        "Flowing Text", "Particle Galaxy", "Code Ripples", "Floating Geometry",
        "Breathing Mandala", "Infinite Loop", "Nature's Code", "Quantum Field", 
        "Sacred Code", "The Void"
      ];
      document.title = `ARD - ${artworkTitles[currentArtwork]}`;
    }
  }
);
