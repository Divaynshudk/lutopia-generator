
/**
 * Basic color conversion utilities for LUT generation
 */

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Converting RGB to HSL color space for better transformations
 */
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 1;
  g /= 1;
  b /= 1;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h, s, l];
}

/**
 * Converting HSL back to RGB color space
 */
export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [r, g, b];
}

/**
 * RGB to OKLAB color space conversion for more perceptually uniform transformations
 * OKLAB provides better perceptual uniformity than HSL
 */
export function rgbToOklab(r: number, g: number, b: number): [number, number, number] {
  // Convert RGB to linear RGB
  const linearR = r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const linearG = g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const linearB = b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Convert to XYZ
  const x = 0.4124 * linearR + 0.3576 * linearG + 0.1805 * linearB;
  const y = 0.2126 * linearR + 0.7152 * linearG + 0.0722 * linearB;
  const z = 0.0193 * linearR + 0.1192 * linearG + 0.9505 * linearB;

  // Convert to LMS
  const l = 0.8189 * x + 0.3618 * y - 0.1288 * z;
  const m = 0.0329 * x + 0.9293 * y + 0.0361 * z;
  const s = 0.0482 * x + 0.2621 * y + 0.6839 * z;

  // Convert to OKLab
  const L = 0.2104 * Math.cbrt(l) + 0.7936 * Math.cbrt(m) - 0.0040 * Math.cbrt(s);
  const a = 1.9779 * Math.cbrt(l) - 2.4285 * Math.cbrt(m) + 0.4505 * Math.cbrt(s);
  const b_val = 0.0259 * Math.cbrt(l) + 0.7827 * Math.cbrt(m) - 0.8086 * Math.cbrt(s);

  return [L, a, b_val];
}

/**
 * OKLAB to RGB color space conversion
 */
export function oklabToRgb(L: number, a: number, b: number): [number, number, number] {
  // Convert to LMS
  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
  const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
  const s = Math.pow(L - 0.0894841775 * a - 1.2914855480 * b, 3);

  // Convert to XYZ
  const x = 1.2268798733 * l - 0.5578149965 * m + 0.2813910503 * s;
  const y = -0.0405757684 * l + 1.1122868293 * m - 0.0717110612 * s;
  const z = -0.0763729347 * l - 0.4214933399 * m + 1.5869240244 * s;

  // Convert to linear RGB
  const linearR = 3.2404542 * x - 1.5371385 * y - 0.4985314 * z;
  const linearG = -0.9692660 * x + 1.8760108 * y + 0.0415560 * z;
  const linearB = 0.0556434 * x - 0.2040259 * y + 1.0572252 * z;

  // Convert to sRGB
  const r = linearR <= 0.0031308 ? 12.92 * linearR : 1.055 * Math.pow(linearR, 1/2.4) - 0.055;
  const g = linearG <= 0.0031308 ? 12.92 * linearG : 1.055 * Math.pow(linearG, 1/2.4) - 0.055;
  const b_out = linearB <= 0.0031308 ? 12.92 * linearB : 1.055 * Math.pow(linearB, 1/2.4) - 0.055;

  return [
    Math.max(0, Math.min(1, r)),
    Math.max(0, Math.min(1, g)),
    Math.max(0, Math.min(1, b_out))
  ];
}
