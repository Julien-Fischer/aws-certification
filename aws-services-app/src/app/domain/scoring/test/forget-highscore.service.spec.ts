import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {FlashCardId} from "../../shared/flash-card-id";
import {aHighscore, HighscoreBuilder} from "./utils/score-builder";
import {storageInjectionToken} from "../storage";
import {ForgetHighscoreService} from "../forget-highscore.service";
import HighscoreInMemoryStorage from "./utils/highscore-in-memory-storage";
import {LeaderBoardService} from "../leaderboard.service";
import {expectThat} from "./utils/score-assertions";

const aurora = new FlashCardId('aurora');
const dynamo = new FlashCardId('dynamo');

describe('ForgetHighscoreService', () => {
    let storage = new HighscoreInMemoryStorage();
    let leaderboard = new LeaderBoardService(storage);
    let highscoreEraser: ForgetHighscoreService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: storageInjectionToken,
                    useValue: storage
                }
            ]
        });
        highscoreEraser = TestBed.inject(ForgetHighscoreService);
        storage.clear();
    });

    it('should be created', () => {
        expect(highscoreEraser).toBeTruthy();
    });

    it('removes a specific highscore from storage', () => {
        givenThat(aurora).has(aHighscore());
        givenThat(dynamo).has(aHighscore().withAccuracy(80));

        highscoreEraser.forget(aurora);

        assertThat(aurora).hasNoHighscore();
        assertThat(dynamo).has(aHighscore().withAccuracy(80));
    });

    it('removes all highscores from storage', () => {
        givenThat(aurora).has(aHighscore());
        givenThat(dynamo).has(aHighscore());

        highscoreEraser.forgetAll();

        assertThat(aurora).hasNoHighscore();
        assertThat(dynamo).hasNoHighscore();
    });

    it('triggers onReset when all highscores are forgotten', () => {
        const resetSpy = vi.fn();
        highscoreEraser.onReset.subscribe(resetSpy);

        highscoreEraser.forgetAll();

        expect(resetSpy).toHaveBeenCalled();
    });

  function givenThat(id: FlashCardId) {
    return {
      has(score: HighscoreBuilder) {
        storage.setItem(id, score.build());
      }
    }
  }

  function assertThat(id: FlashCardId) {
    return expectThat(leaderboard.getHighscore(id));
  }

});
