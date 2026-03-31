import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import {scoreWriterInjectionToken} from "../score-writer";
import {AwsServiceId} from "../../shared/AwsServiceId";
import {aHighscore, aScore, ScoreBuilder} from "./utils/score-builder";
import Highscore from "../models/highscore";
import {storageInjectionToken} from "../storage";
import {ScoreWriterService} from "../score-writer.service";
import InMemoryStorage from "./utils/in-memory-storage";
import {LeaderBoardService} from "../leaderboard.service";

describe('LeaderboardService', () => {
    let storage = new InMemoryStorage();
    let scoreWriter = new ScoreWriterService(storage);
    let leaderboard: LeaderBoardService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: scoreWriterInjectionToken,
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
        whenService('aurora')
            .hasHighScore(aScore().withAccuracy(35));

        const highscore = leaderboard.getHighscore('aurora');

        expect(highscore)
            .toStrictEqual(aHighscore().withAccuracy(35).forService('aurora').build())
    });

    it(`returns highscore of zero when service's has no highscore`, () => {
        whenService('aurora').hasNoHighscore();

        const highscore = leaderboard.getHighscore('aurora');

        expect(highscore)
            .toStrictEqual(Highscore.NONE);
    });


    function whenService(serviceId: AwsServiceId) {
        return {
            hasHighScore(score: ScoreBuilder) {
                scoreWriter.score(serviceId, score.build());
            },
            hasNoHighscore() {

            }
        }
    }

});
