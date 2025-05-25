import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useArtwork } from "@/lib/stores/useArtwork";
import { ARTWORKS } from "@/types/artwork";

// Import all artwork components
import Artwork01_FlowingText from "./artworks/Artwork01_FlowingText";
import Artwork02_ParticleGalaxy from "./artworks/Artwork02_ParticleGalaxy";
import Artwork03_CodeRipples from "./artworks/Artwork03_CodeRipples";
import Artwork04_FloatingGeometry from "./artworks/Artwork04_FloatingGeometry";
import Artwork05_BreathingMandala from "./artworks/Artwork05_BreathingMandala";
import Artwork06_InfiniteLoop from "./artworks/Artwork06_InfiniteLoop";
import Artwork07_NatureCode from "./artworks/Artwork07_NatureCode";
import Artwork08_QuantumField from "./artworks/Artwork08_QuantumField";
import Artwork09_SacredCode from "./artworks/Artwork09_SacredCode";
import Artwork10_TheVoid from "./artworks/Artwork10_TheVoid";

const artworkComponents = [
  Artwork01_FlowingText,
  Artwork02_ParticleGalaxy,
  Artwork03_CodeRipples,
  Artwork04_FloatingGeometry,
  Artwork05_BreathingMandala,
  Artwork06_InfiniteLoop,
  Artwork07_NatureCode,
  Artwork08_QuantumField,
  Artwork09_SacredCode,
  Artwork10_TheVoid,
];

function ArtworkFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="zen-subtitle text-sm">Loading artwork...</p>
      </div>
    </div>
  );
}

export default function ArtworkContainer() {
  const { currentArtwork } = useArtwork();
  const currentArtworkData = ARTWORKS[currentArtwork];
  const ArtworkComponent = artworkComponents[currentArtwork];

  return (
    <div className="relative w-full h-full">
      {/* Artwork Title Overlay - Horizontal Strip */}
      <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none">
        <div className="glass p-1 rounded fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="zen-title mb-0" style={{ fontSize: "12px" }}>
                {currentArtworkData.title}
              </h2>
              <span className="zen-subtitle" style={{ fontSize: "12px" }}>
                -
              </span>
              <p
                className="zen-subtitle leading-none"
                style={{ fontSize: "12px" }}
              >
                {currentArtworkData.description}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <span
                className={`px-1 py-0.5 rounded ${
                  currentArtworkData.type === "3D"
                    ? "bg-blue-500/20 text-blue-300"
                    : "bg-green-500/20 text-green-300"
                }`}
                style={{ fontSize: "10px" }}
              >
                {currentArtworkData.type}
              </span>
              <span className="zen-subtitle" style={{ fontSize: "10px" }}>
                {currentArtworkData.technique}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Artwork Content */}
      <div className="w-full h-full">
        {currentArtworkData.type === "3D" ? (
          <Canvas
            camera={{
              position: [0, 0, 10],
              fov: 45,
              near: 0.1,
              far: 1000,
            }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
            dpr={Math.min(window.devicePixelRatio, 2)}
          >
            <color attach="background" args={["#0a0a0a"]} />
            <fog attach="fog" args={["#0a0a0a", 10, 100]} />

            <Suspense fallback={null}>
              <ArtworkComponent />
            </Suspense>
          </Canvas>
        ) : (
          <Suspense fallback={<ArtworkFallback />}>
            <ArtworkComponent />
          </Suspense>
        )}
      </div>
    </div>
  );
}
