import { useState, useEffect } from "react";

const FONT_SIZES = {
  normal: "",
  large: "text-accessible-large",
  xl: "text-accessible-xl",
};

export function useFontSize() {
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem("fontSize") || "normal";
  });

  useEffect(() => {
    localStorage.setItem("fontSize", fontSize);
    // Remove all classes first
    Object.values(FONT_SIZES).forEach(cls => {
      if (cls) document.documentElement.classList.remove(cls);
    });
    // Add the selected class if not normal
    if (FONT_SIZES[fontSize]) {
      document.documentElement.classList.add(FONT_SIZES[fontSize]);
    }
  }, [fontSize]);

  return [fontSize, setFontSize];
}
