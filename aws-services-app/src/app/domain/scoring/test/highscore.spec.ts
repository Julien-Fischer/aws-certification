import {describe, it, expect} from "vitest";
import Highscore from "../models/highscore";
import Score from "../models/score";

describe("Highscore", () => {

  it('no highscore beats nothing', () => {
    expect(Highscore.NONE.beats(Highscore.NONE)).toBe(false);
    expect(Highscore.NONE.beats(nonZeroAccuracy())).toBe(false);
    expect(Highscore.NONE.beats(nonZeroProgress())).toBe(false);
  })

  it('any score beats no highscore', () => {
    expect(nonZeroAccuracy().beats(Highscore.NONE)).toBe(true);
    expect(nonZeroProgress().beats(Highscore.NONE)).toBe(true);
  })

})


function nonZeroAccuracy(): Score {
  return Score.of(1, 0);
}

function nonZeroProgress(): Score {
  return Score.of(0, 1);
}

