import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import {saveHighscoreInjectionToken} from "../highscore-evaluator";
import {FlashCardId} from "../../shared/flash-card-id";
import {aHighscore, aScore, ScoreBuilder} from "./utils/score-builder";
import {storageInjectionToken} from "../storage";
import {SaveHighscoreService} from "../save-highscore.service";
import HighscoreInMemoryStorage from "./utils/highscore-in-memory-storage";
import {LeaderBoardService} from "../leaderboard.service";
import {expectThat} from "./utils/score-assertions";

const aurora = new FlashCardId('aurora');

describe('LeaderboardService', () => {
    let storage = new HighscoreInMemoryStorage();
    let scoreWriter = new SaveHighscoreService(storage);
    let leaderboard: LeaderBoardService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: saveHighscoreInjectionToken,
                    useValue: leaderboard
                },
                {
                    provide: storageInjectionToken,
                    useValue: storage
                }
            ]
        });
        leaderboard = TestBed.inject(LeaderBoardService);
        storage.clear();
    });

    it('should be created', () => {
        expect(leaderboard).toBeTruthy();
    });

    it(`returns specified service's highscore when exists`, () => {
        givenThat(aurora)
            .hasHighScore(aScore().withAccuracy(35));

        const highscore = leaderboard.getHighscore(aurora);

        expectThat(highscore)
            .is(aHighscore().withAccuracy(35).build())
    });

    it(`returns highscore of zero when service's has no highscore`, () => {
        givenThat(aurora).hasNoHighscore();

        const highscore = leaderboard.getHighscore(aurora);

        expectThat(highscore).hasNoHighscore();
    });


    function givenThat(id: FlashCardId) {
        return {
            hasHighScore(score: ScoreBuilder) {
                scoreWriter.submit(id, score.build());
            },
            hasNoHighscore() { }
        }
    }

});
