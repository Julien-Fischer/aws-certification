import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import {leaderboardInjectionToken} from "../leaderboard";
import {AwsServiceId} from "../../shared/AwsServiceId";
import {aHighscore, aScore, ScoreBuilder} from "./utils/score-builder";
import Highscore from "../models/highscore";
import {storageInjectionToken} from "../storage";
import {ScoreWriterService} from "../score-writer.service";
import Score from "../models/score";
import InMemoryStorage from "./utils/in-memory-storage";
import {LeaderBoardService} from "../leaderboard.service";
import {expectThat} from "./utils/score-assertions";

const aurora = new AwsServiceId('aurora');

describe('ScoreWriterService', () => {
    let storage = new InMemoryStorage();
    let leaderboard = new LeaderBoardService(storage);
    let scoreWriter: ScoreWriterService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: leaderboardInjectionToken,
                    useValue: leaderboard
                },
                {
                    provide: storageInjectionToken,
                    useValue: storage
                }
            ]
        });
        scoreWriter = TestBed.inject(ScoreWriterService);
        storage.clear();
    });

    it('should be created', () => {
        expect(scoreWriter).toBeTruthy();
    });

    it('saves new score if it beats current highscore accuracy', () => {
       const newHighScore = aScore().withAccuracy(100).build();
       whenService(aurora)
           .hasHighScore(aScore().withAccuracy(35));

       scoreWriter.score(aurora, newHighScore);

       expectThat(leaderboard.getHighscore(aurora))
           .is(Highscore.from(newHighScore))
    });

    it('does not save new score has less accuracy than current highscore', () => {
        const lowerScore = aScore().withAccuracy(34).build();
        const currentHighscore = aHighscore().withAccuracy(35).build();
        whenService(aurora)
            .hasHighScore(currentHighscore);

        scoreWriter.score(aurora, lowerScore);

        expectThat(leaderboard.getHighscore(aurora))
            .is(currentHighscore)
    });

    it('does not save new score if has same accuracy than current highscore', () => {
        const lowerScore = aScore().withAccuracy(35).build();
        const currentHighscore = aHighscore().withAccuracy(35).build();
        whenService(aurora)
            .hasHighScore(currentHighscore);

        scoreWriter.score(aurora, lowerScore);

        expectThat(leaderboard.getHighscore(aurora))
            .is(currentHighscore)
    });

    it('saves new score if it has greater progress, regardless or accuracy', () => {
        const newHighScore = aScore()
            .completed(100)
            .withAccuracy(15)
            .build();
        const oldHighscore = aScore()
            .completed(50)
            .withAccuracy(50)
            .build();
        whenService(aurora)
            .hasHighScore(oldHighscore);

        scoreWriter.score(aurora, newHighScore);

        expectThat(leaderboard.getHighscore(aurora))
            .is(Highscore.from(newHighScore))
    });


    function whenService(id: AwsServiceId) {
        return {
            hasHighScore(score: ScoreBuilder | Score)  {
                const builtScore = ('build' in score) ? score.build() : score;
                scoreWriter.score(id, builtScore);
            }
        }
    }

});
