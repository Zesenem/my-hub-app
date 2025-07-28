import React, { useMemo } from "react";
import Layer0 from "../assets/background/Layer_0000_9.png";
import Layer1 from "../assets/background/Layer_0001_8.png";
import Layer2 from "../assets/background/Layer_0002_7.png";
import Layer3 from "../assets/background/Layer_0003_6.png";
import Layer4 from "../assets/background/Layer_0004_Lights.png";
import Layer5 from "../assets/background/Layer_0005_5.png";
import Layer6 from "../assets/background/Layer_0006_4.png";
import Layer7 from "../assets/background/Layer_0007_Lights.png";
import Layer8 from "../assets/background/Layer_0008_3.png";
import Layer9 from "../assets/background/Layer_0009_2.png";
import Layer10 from "../assets/background/Layer_0010_1.png";
import Layer11 from "../assets/background/Layer_0011_0.png";

// Parralax background attempt turned into scene background component

const SceneBackground = ({ className = "" }) => {
  const layers = useMemo(
    () => [
      { src: Layer11, depth: 120, blur: 2, brightness: 0.85 },
      { src: Layer10, depth: -80, blur: 1.5, brightness: 0.88 },
      { src: Layer9, depth: -60, blur: 1, brightness: 0.92 },
      { src: Layer8, depth: -40, blur: 0.7, brightness: 0.95 },
      { src: Layer7, depth: -20, blur: 0.4, brightness: 0.97 },
      { src: Layer6, depth: 0, blur: 0.2, brightness: 0.98 },
      { src: Layer5, depth: 20, blur: 0.1, brightness: 0.99 },
      { src: Layer4, depth: 40, blur: 0, brightness: 1.0 },
      { src: Layer3, depth: 60, blur: 0, brightness: 1.02 },
      { src: Layer2, depth: 80, blur: 0, brightness: 1.04 },
      { src: Layer1, depth: 100, blur: 0, brightness: 1.06 },
      { src: Layer0, depth: 120, blur: 0, brightness: 1.08 },
    ],
    []
  );

  const baseImageScale = 1.0;
  const depthScaleFactor = 0.0014;

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{
        perspective: "600px",
        transformStyle: "preserve-3d",
      }}
    >
      {layers.map(({ src, depth, blur, brightness }, i) => {
        const dynamicScale = baseImageScale - depth * depthScaleFactor;

        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              transform: `translateZ(${depth}px)`,
              pointerEvents: "none",
            }}
          >
            <img
              src={src}
              alt={`Layer ${i}`}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                filter: `brightness(${brightness}) blur(${blur}px)`,
                transformOrigin: "center center",
                transform: `scale(${dynamicScale})`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(SceneBackground);
