import React, { useMemo } from "react";
import Layer0 from "../assets/background/Layer_0000_9.webp";
import Layer1 from "../assets/background/Layer_0001_8.webp";
import Layer2 from "../assets/background/Layer_0002_7.webp";
import Layer3 from "../assets/background/Layer_0003_6.webp";
import Layer4 from "../assets/background/Layer_0004_Lights.webp";
import Layer5 from "../assets/background/Layer_0005_5.webp";
import Layer6 from "../assets/background/Layer_0006_4.webp";
import Layer7 from "../assets/background/Layer_0007_Lights.webp";
import Layer8 from "../assets/background/Layer_0008_3.webp";
import Layer9 from "../assets/background/Layer_0009_2.webp";
import Layer10 from "../assets/background/Layer_0010_1.webp";
import Layer11 from "../assets/background/Layer_0011_0.webp";

const SceneBackground = ({ className = "" }) => {
  const layers = useMemo(
    () => [
      { src: Layer11 },
      { src: Layer10 },
      { src: Layer9 },
      { src: Layer8 },
      { src: Layer7 },
      { src: Layer6 },
      { src: Layer5 },
      { src: Layer4 },
      { src: Layer3 },
      { src: Layer2 },
      { src: Layer1 },
      { src: Layer0 },
    ],
    []
  );

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {layers.map(({ src }, i) => (
        <img
          key={i}
          src={src}
          alt={`Layer ${i}`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            zIndex: i,
            pointerEvents: "none",
          }}
        />
      ))}
    </div>
  );
};

export default React.memo(SceneBackground);
