import { ColorFactory, Color, packIntegerRgb } from "../index"
import { expect } from "chai"
import "mocha"

const testData = [
  [[0, .1, .1],    [28, 23, 23]],
  [[10, 0, .1],    [26, 26, 26]],
  [[10, .1, 0],    [0, 0, 0]],
  [[10, 0, 0],     [0, 0, 0]],
  [[360, .1, .1],  [28, 23, 23]],
  [[350, 0, .1],   [26, 26, 26]],
  [[350, .1, 0],   [0, 0, 0]],
  [[350, 0, 0],    [0, 0, 0]],
  [[10, 1, .9],    [255, 213, 204]],
  [[10, .9, .1],   [48, 10, 3]],
  [[10, 1, 1],     [255, 255, 255]],
  [[360, .5, .5],  [191, 64, 64]],
  [[330, .5, .5],  [191, 64, 128]],
  [[300, .5, .5],  [191, 64, 191]],
  [[270, .5, .5],  [128, 64, 191]],
  [[250, .5, .5],  [85, 64, 191]],
  [[210, .5, .5],  [64, 128, 191]],
  [[180, .5, .5],  [64, 191, 191]],
  [[150, .5, .5],  [64, 191, 128]],
  [[120, .5, .5],  [64, 191, 64]],
  [[90, .5, .5],   [128, 191, 64]],
  [[60, .5, .5],   [191, 191, 64]],
  [[30, .5, .5],   [191, 128, 64]],
  [[0, .5, .5],    [191, 64, 64]],
  [[270, .25, .5], [128, 96, 159]],
  [[270, .12, .5], [128, 112, 143]],
  [[270, .37, .5], [128, 80, 175]],
  [[270, .62, .5], [128, 48, 207]],
  [[270, .75, .5], [128, 32, 223]],
  [[270, .87, .5], [128, 17, 238]],
  [[120, 1, .2],   [0, 102, 0]],
  [[120, 1, .4],   [0, 204, 0]],
  [[120, 1, .6],   [51, 255, 51]],
  [[120, 1, .8],   [153, 255, 153]],
  [[125, .83, .23],[10, 107, 18]],
  [[153, .17, .23],[49, 69, 60]],
  [[217, .41, .34],[51, 78, 122]],
  [[303, .61, .45],[185, 45, 178]],
  [[339, .77, .51],[226, 34, 101]],
  [[270, 1, .5],   [128, 0, 255]]
]


describe("ColorFactory", () => {
  describe("By Normalized", () => {
    testData.forEach(eachTest => {
      let [ [hue, s, l], [expectedRed, expectedGreen, expectedBlue] ] = eachTest
      const h = hue / 360

      const color = ColorFactory.ByHSL.ByNormalized.create(h, s, l)

      it(`should convert ${hue} ${s} ${l} to red ${expectedRed}`, () => {

        expect(color.red).to.equal(expectedRed)
      })

      it(`should convert ${hue} ${s} ${l} to green ${expectedGreen}`, () => {

        expect(color.green).to.equal(expectedGreen)
      })

      it(`should convert ${hue} ${s} ${l} to blue ${expectedBlue}`, () => {

        expect(color.blue).to.equal(expectedBlue)
      })
    })
  })

  describe("By Standard", () => {
    let hue = 270, sat = 100, lum = 50
    let red = 128, green = 0, blue = 255

    it(`should convert ${hue} ${sat} ${lum} to ${red} ${green} ${blue}`, () => {
      const color = ColorFactory.ByHSL.ByStandard.create(hue, sat, lum)

      expect(color.red).to.equal(red)
      expect(color.green).to.equal(green)
      expect(color.blue).to.equal(blue)
    })
  })
})
