export interface Color {
  red: number;
  green: number;
  blue: number;
  hue: number;
  sat: number;
  lum: number;
}

export function decomposeCompoundRgb(compoundRgb: number) {
  const red = compoundRgb & 0xFF
  const green = (compoundRgb >> 8) & 0xFF
  const blue = (compoundRgb >> 16) & 0xFF

  return { red, green, blue }
}

export function packIntegerRgb(color: Color) {
  const { red, green, blue } = color

  console.log(red, green, blue)

  let packedColor = red & 0xFF
  packedColor += (green & 0xFF) << 8
  packedColor += (blue & 0xFF) << 16

  return packedColor
}

export module ColorFactory {
  class Functions {
    public static calculateFloor(luminosity: number): number {
      if (luminosity < 0 || luminosity > 1) {
        console.error('Value for luminosity was not normalized.');
      }

      const floor = Math.round((luminosity - .5) / .5 * 255);
      return floor < 0 ? 0 : floor;
    }

    public static calculateCeiling(luminosity: number): number {
      if (luminosity < 0 || luminosity > 1) {
        console.error('Value for luminosity was not normalized.');
      }

      const ceiling = Math.trunc(luminosity / .5 * 255);
      return ceiling > 255 ? 255 : ceiling;
    }

    public static getSegments(hue: number): number[] {
      const units = hue * 360;
      const segments = Math.trunc(units / 60);
      return Functions.getIndexes(segments);
    }

    public static calculateActive(hue: number, floor: number, ceiling: number): number {
      if (hue < 0 || hue > 1) {
        console.error('Value for hue is not normalized.');
      }

      const units = hue * 360;
      const degree = (units % 60) / 60;
      const bonus = Math.trunc(units / 60 % 2);


      const range = ceiling - floor;
      const active = Math.round(degree * range);
      const oscil = active + range - (2 * bonus * active); // if bonus is zero, then you get a positive oscilation.


      return oscil % range + floor;
    }

    private static getIndexes(hueSegment: number): number[] {

      // This is one case.
      // We need the other case now.
      const bonus = Math.trunc(hueSegment % 2);
      hueSegment = Math.trunc(hueSegment / 2);

      return [
        (hueSegment + 2) % 3, (hueSegment + 1 - 1 * bonus) % 3, (hueSegment + 0 + 1 * bonus) % 3
      ];
    }
  }


  export module ByRGB {
    class RgbColor implements Color {
      private _hue = 0;
      private _sat = 0;
      private _lum = 0;

      public get hue(): number {
        return this._hue;
      }

      public get sat(): number {
        return this._sat;
      }

      public get lum(): number {
        return this._lum;
      }

      constructor(public red: number, public green: number, public blue: number) {}
    }

    export class ByRadian {
      public static create(red: number, green: number, blue: number): Color {

        console.error("Not implemented");
        return new RgbColor(0, 0, 0);
      }
    }

    export class ByStandard {
      public static create(red: number, green: number, blue: number): Color {
        return new RgbColor(red, green, blue);
      }
    }

    export module ByNormalized {
      export class ByCompoundValue {
        public static create(compoundRgb: number): Color {
          const { red, green, blue } = decomposeCompoundRgb(compoundRgb)

          return ByValues.create(red, green, blue)
        }
      }

      export class ByValues {
        public static create(red: number, green: number, blue: number): Color {
          return new RgbColor(red, green, blue)
        }
      }
    }
  }

  export module ByHSL {
    class HslColor implements Color {
      private rgb: number[] = [ 0, 0, 0];

      public get red(): number {
        return this.rgb[0];
      }

      public get green(): number {
        return this.rgb[1];
      }

      public get blue(): number {
        return this.rgb[2];
      }

      constructor(public hue: number, public sat: number, public lum: number) {
        const validateSat = (sat >= 0 && sat <= 1)
        const validateLum = (lum >= 0 && lum <= 1)
        const validateHue = (hue >= 0 && hue <= 1)
        if (!validateHue || !validateLum || !validateSat) {
          return
        }

        // These values should be normailzed.
        // But we want hue in terms of 360 degrees
        hue *= 360


        // 1 - Math.abs(2L - 1)
        // from .5 to 1, goes from 1 to 0
        // from .5 to 0, goes from 1 to 0
        // multiply the result by saturation [0, 1] -- yields Chroma
        // get the hue section, H` [0, 6]
        // 1 - Math.abs(H` % 2 - 1)
        // H` is 0, is 0; climbing -- the remainder that doesn't surive the culling of minus 1, bolsters
        // H` is 1, is 1; falling -- the remainder that survives the culling of minus 1, detracts
        // H` is 2, is 0; climbing
        // multiply the result by Chroma
        // allocate to components
        // augment components by L - C/2

        const chroma = (1 - Math.abs(2 * lum - 1)) * sat
        const huePrime = hue / 60
        const xvalue = chroma * (1 - Math.abs((huePrime % 2) - 1))

        if (huePrime >= 0 && huePrime <= 1) {

          this.rgb[0] = chroma
          this.rgb[1] = xvalue
          this.rgb[2] = 0
        } else if (huePrime >= 1 && huePrime <= 2) {

          this.rgb[0] = xvalue
          this.rgb[1] = chroma
          this.rgb[2] = 0
        } else if (huePrime >= 2 && huePrime <= 3) {

          this.rgb[0] = 0
          this.rgb[1] = chroma
          this.rgb[2] = xvalue
        } else if (huePrime >= 3 && huePrime <= 4) {

          this.rgb[0] = 0
          this.rgb[1] = xvalue
          this.rgb[2] = chroma
        } else if (huePrime >= 4 && huePrime <= 5) {

          this.rgb[0] = xvalue
          this.rgb[1] = 0
          this.rgb[2] = chroma
        } else if (huePrime >= 5 && huePrime <= 6) {

          this.rgb[0] = chroma
          this.rgb[1] = 0
          this.rgb[2] = xvalue
        } else {
          this.rgb[0] = 0
          this.rgb[1] = 0
          this.rgb[2] = 0
        }


        const mvalue = lum - (chroma / 2)
        this.rgb[0] = Math.round((this.rgb[0] + mvalue) * 255)
        this.rgb[1] = Math.round((this.rgb[1] + mvalue) * 255)
        this.rgb[2] = Math.round((this.rgb[2] + mvalue) * 255)

        // const floor   = Functions.calculateFloor(lum);
        // const ceiling = Functions.calculateCeiling(lum);
        //
        // const midrange = (ceiling - floor) / 2;
        // const midpoint = midrange + floor;
        //
        // const effectiveFloor = midpoint - Math.round(midrange * sat);
        // const effectiveCeiling = midpoint + Math.round(midrange * sat);
        //
        // const active  = Functions.calculateActive(hue, effectiveFloor, effectiveCeiling);
        // const segments = Functions.getSegments(hue);
        //
        // this.rgb[segments[0]] = Math.trunc(effectiveFloor);
        // this.rgb[segments[1]] = Math.trunc(active);
        // this.rgb[segments[2]] = Math.trunc(effectiveCeiling);
      }
    }

    export class ByRadian {
      public static create(hue: number, sat: number, lum: number): Color {
        hue = hue / (Math.PI * 2);
        lum = lum / 100;
        sat = sat / 100;

        return new HslColor(hue, sat, lum);
      }
    }

    export class ByStandard {
      public static create(hue: number, sat: number, lum: number): Color {
        lum = Math.trunc(lum);
        sat = Math.trunc(sat);
        hue = Math.trunc(hue);


        lum = lum / 100;
        sat = sat / 100;
        hue = hue / 360;

        return new HslColor(hue, sat, lum);
      }
    }

    export class ByNormalized {
      public static create(hue: number, sat: number, lum: number): Color {
        return new HslColor(hue, sat, lum);
      }
    }
  }
}
