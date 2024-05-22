export function toBoolean(input: unknown) {
  if (typeof input === "boolean") return input;

  if (typeof input === "string") {
    if (["true", "yes", "1", "si"].includes(input.toLowerCase())) return true;
    return false;
  }

  return !!input;
}

export function toFigmaRgb(input: unknown) {
  if (typeof input === "boolean") {
    return {
      r: input ? 0 : 1,
      g: input ? 0 : 1,
      b: input ? 0 : 1,
    };
  }

  if (typeof input === "string") {
    if (input.startsWith("#")) {
      const hex = input.slice(1);
      return rgbToFigmaRgb(hextToRgb(hex));
    } else if (input.length === 3 || input.length === 6) {
      return rgbToFigmaRgb(hextToRgb(input));
    }

    try {
      return rgbToFigmaRgb(JSON.parse(input));
    } catch (error) {
      return { r: 0, g: 0, b: 0 };
    }
  }

  return { r: 0, g: 0, b: 0 };
}

function rgbToFigmaRgb(rgb?: {
  r?: number | string;
  red?: number | string;
  g?: number | string;
  green?: number | string;
  b?: number | string;
  blue?: number | string;
}) {
  if (!rgb) return { r: 0, g: 0, b: 0 };

  return {
    r: rgb.r || rgb.red ? bitToFigmaRgb(Number(rgb.r ?? rgb.red)) : 0,
    g: rgb.g || rgb.green ? bitToFigmaRgb(Number(rgb.g ?? rgb.green)) : 0,
    b: rgb.b || rgb.blue ? bitToFigmaRgb(Number(rgb.b ?? rgb.blue)) : 0,
  };
}

function bitToFigmaRgb(bit: number) {
  if (bit > 1) return mapBitValueToFigmaRgb(bit);

  return bit;
}

function mapBitValueToFigmaRgb(
  num: number,
  inMin: number = 0,
  inMax: number = 255,
  outMin: number = 0,
  outMax: number = 1,
) {
  return ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

function hextToRgb(hex: string) {
  const rgb = { r: 0, g: 0, b: 0 };

  if (hex.length === 3) {
    rgb.r = parseInt(hex[0] + hex[0], 16);
    rgb.g = parseInt(hex[1] + hex[1], 16);
    rgb.b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    rgb.r = parseInt(hex.slice(0, 2), 16);
    rgb.g = parseInt(hex.slice(2, 4), 16);
    rgb.b = parseInt(hex.slice(4, 6), 16);
  }

  return rgb;
}
