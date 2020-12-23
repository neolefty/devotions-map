import {pixelsPerMeter} from "./useDevotions"

it('calculates meters per pixel', () => {
    expect(pixelsPerMeter(0)).toBeCloseTo(1 / 60_000)
    expect(pixelsPerMeter(1)).toBeCloseTo(1 / 30_000)
    expect(pixelsPerMeter(4)).toBeCloseTo(1 / 3_750)
})
