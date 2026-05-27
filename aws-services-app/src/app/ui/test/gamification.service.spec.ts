import {describe, it, expect, beforeEach} from 'vitest';
import {TestBed} from "@angular/core/testing";
import GamificationInMemoryStorage from "../../domain/scoring/test/utils/gamification-in-memory-storage";
import {GamificationService, Key} from "../services/gamification.service";
import {GAMIFICATION_STORAGE} from "../../infra/scoring/gamification-local-storage-accessor";

describe('GamificationService', () => {
  let storage = new GamificationInMemoryStorage();
  let gamificationService: GamificationService | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: GAMIFICATION_STORAGE,
          useValue: storage
        }
      ]
    });
    gamificationService = undefined;
    storage.clear();
  });

  it('should be created', () => {
    initGamificationService();
    expect(gamificationService).toBeTruthy();
  });

  describe('toggle', () => {
    it('toggles gamification when initially true', () => {
      givenThat('gamification_enabled').isTrue();

      gamificationService!.toggle();

      expect(gamificationService!.isEnabled()).toBe(false);
    })

    it('toggles gamification when initially false', () => {
      givenThat('gamification_enabled').isFalse();

      gamificationService!.toggle();

      expect(gamificationService!.isEnabled()).toBe(true);
    })

    describe('is idempotent', () => {
      it('when initially false', () => {
        givenThat('gamification_enabled').isFalse();

        gamificationService!.toggle();
        gamificationService!.toggle();

        expect(gamificationService!.isEnabled()).toBe(false);
      })

      it('when initially true', () => {
        givenThat('gamification_enabled').isTrue();

        gamificationService!.toggle();
        gamificationService!.toggle();

        expect(gamificationService!.isEnabled()).toBe(true);
      })
    })
  })

  describe('setScoresEnabled', () => {
    it.each([true, false])
    ('sets score when initially false', (enabled: boolean) => {
      givenThat('score_enabled').isFalse();

      gamificationService!.setScoresEnabled(enabled);

      expect(gamificationService!.isAccuracyEnabled()).toBe(enabled);
    })

    it.each([true, false])
    ('sets score when initially true', (enabled: boolean) => {
      givenThat('score_enabled').isTrue();

      gamificationService!.setScoresEnabled(enabled);

      expect(gamificationService!.isAccuracyEnabled()).toBe(enabled);
    })

    it('toggle is idempotent', () => {
      givenThat('score_enabled').isTrue();

      gamificationService!.toggleScore();
      gamificationService!.toggleScore();

      expect(gamificationService!.isAccuracyEnabled()).toBe(true);
    })
  })

  describe('setProgressEnabled', () => {
    it.each([true, false])
    ('sets progress when initially false', (enabled: boolean) => {
      givenThat('progress_enabled').isFalse();

      gamificationService!.setProgressEnabled(enabled);

      expect(gamificationService!.isProgressEnabled()).toBe(enabled);
    })

    it.each([true, false])
    ('sets progress when initially true', (enabled: boolean) => {
      givenThat('progress_enabled').isTrue();

      gamificationService!.setProgressEnabled(enabled);

      expect(gamificationService!.isProgressEnabled()).toBe(enabled);
    })

    it('toggle is idempotent', () => {
      givenThat('progress_enabled').isTrue();

      gamificationService!.toggleProgress();
      gamificationService!.toggleProgress();

      expect(gamificationService!.isProgressEnabled()).toBe(true);
    })
  })

  describe('Default values', () => {
    it('Gamification is disabled by default', () => {
      initGamificationService();

      expect(gamificationService!.isEnabled()).toBe(false);
    });

    it('Progress, Score, and Highscore are enabled by default', () => {
      initGamificationService();

      expect(gamificationService!.isProgressEnabled()).toBe(true);
      expect(gamificationService!.isAccuracyEnabled()).toBe(true);
    });
  });


  function givenThat(key: Key) {
    return {
      isTrue: () => {
        storage.setItem(key, true);
        initGamificationService();
      },
      isFalse: () => {
        storage.setItem(key, false);
        initGamificationService();
      },
      isNotDefined: () => {},
    }
  }

  function initGamificationService() {
    gamificationService = TestBed.inject(GamificationService);
  }

})
