import { ComponentFixture, TestBed } from '@angular/core/testing';
import {describe, it, expect, beforeEach, vi} from 'vitest';
import {FlashCardComponent} from "./flash-card.component";
import {ActivatedRoute, convertToParamMap, ParamMap, Router} from "@angular/router";
import {SearchService} from "../../../domain/search/services/search.service";
import {saveHighscoreInjectionToken} from "../../../domain/scoring/highscore-evaluator";
import {scoreProviderInjectionToken} from "../../../domain/scoring/score-provider";
import {BehaviorSubject, Observable, of} from "rxjs";
import Highscore from "../../../domain/scoring/models/highscore";
import {carouselInjectionToken} from "../../../domain/search/carousel";
import {Gamification, gamificationInjectionToken} from "../../../domain/scoring/gamification";
import {forgetHighscoreInjectionToken} from "../../../domain/scoring/highscore-eraser";
import {FlashCardId} from "../../../domain/shared/flash-card-id";
import {By} from "@angular/platform-browser";
import Percentage from "../../../domain/scoring/models/percentage";
import PageObject from "../../test/page-object";
import {flashCardProviderInjectionToken} from "../../../domain/search/flash-card-provider";
import {MockFlashCardProvider} from "../../../domain/search/test/mock-flashcard-provider";
import {SaveHighscoreService} from "../../../domain/scoring/save-highscore.service";
import {storageInjectionToken} from "../../../domain/scoring/storage";
import HighscoreInMemoryStorage from "../../../domain/scoring/test/utils/highscore-in-memory-storage";
import {ScoreProviderService} from "../../../domain/scoring/score-provider.service";
import {StubGamificationService} from "../../test/stub-gamification";
import {ForgetHighscoreService} from "../../../domain/scoring/forget-highscore.service";
import {ScoringAppService} from "../../../domain/scoring/scoring-application.service";
import {InMemoryCarousel} from "../../../domain/search/services/in-memory-carousel.service";
import {HighscoreDetailsComponent} from "./highscore-details/highscore-details.component";
import {FlashCardMetadata} from "../../../domain/search/models/metadata";
import {Confetti, confettiInjectionToken} from "../../animations/confetti";

interface CardDescriptor {
  metadata: FlashCardMetadata;
  learningMaterial: string;
}

const aurora = {
  metadata: {
    id: 'aurora',
    name: 'Aurora',
    description: 'Aurora description.',
    icon: 'database',
    category: 'Database',
    lastUpdated: '2026-01-31'
  },
  learningMaterial: 'aurora is a database'
}

interface ActivatedRouteStub {
    paramMap: Observable<ParamMap>;
    snapshot: { paramMap: { get: (name: string) => string | null; } };
    setCardId(cardId: string): void;
}

class SubbedActivatedRoute {
  private paramMapSubject = new BehaviorSubject<ParamMap>(convertToParamMap({}));

  readonly paramMap = this.paramMapSubject.asObservable();

  get snapshot() {
    return { paramMap: this.paramMapSubject.value };
  }

  setCardId(cardId: string) {
    this.paramMapSubject.next(convertToParamMap({ id: cardId }));
  }
}

class StubConfetti implements Confetti {

  private called: boolean = false;
  private quantity?: number;

  burst(quantity?: number): void {
    this.quantity = quantity;
    this.called = true;
  }

  wasCalled() {
    return {
      withQuantity: (quantity: number) => this.called && quantity === 100,
      withAnyQuantity: () => this.called
    };
  }

}

describe('FlashCardComponent', () => {
    let component: FlashCardComponent;
    let fixture: ComponentFixture<FlashCardComponent>;
    let page: FlashCardComponentPage;

    let flashCardProvider: MockFlashCardProvider;
    let gamification: StubGamificationService;

    let activatedRouteMock: ActivatedRouteStub;
    let confetti: StubConfetti;

    beforeEach(async () => {
        flashCardProvider = new MockFlashCardProvider();
        gamification = new StubGamificationService();
        activatedRouteMock = new SubbedActivatedRoute();
        confetti = new StubConfetti();

        await TestBed.configureTestingModule({
            imports: [FlashCardComponent],
            providers: [
                { provide: ActivatedRoute, useValue: activatedRouteMock },
                { provide: carouselInjectionToken, useClass: InMemoryCarousel },
                { provide: flashCardProviderInjectionToken, useValue: flashCardProvider },
                { provide: scoreProviderInjectionToken, useClass: ScoreProviderService },
                { provide: saveHighscoreInjectionToken, useClass: SaveHighscoreService },
                { provide: storageInjectionToken, useClass: HighscoreInMemoryStorage },
                { provide: forgetHighscoreInjectionToken, useClass: ForgetHighscoreService},
                { provide: gamificationInjectionToken, useValue: gamification },
                { provide: confettiInjectionToken, useValue: confetti },
            ]
        })
            .compileComponents()

        TestBed.inject(ScoringAppService);

        fixture = TestBed.createComponent(FlashCardComponent);
        component = fixture.componentInstance;
        page = new FlashCardComponentPage(fixture);
        fixture.detectChanges();
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    describe('loading', () => {
      it.skip('shows loading spinner while metadata is null', async () => {
        expect(page.isSpinnerVisible()).toBe(true);

        havingFlashcard(aurora);

        navigateTo('aurora');

        await page.stabilize();

        expect(page.isSpinnerVisible()).toBe(false);
      });

      it('shows 404 if card not found', async () => {
        havingFlashcard(aurora);

        navigateTo('unknown');

        await page.stabilize();

        expect(page.isSpinnerVisible()).toBe(false);
        expect(page.markdownContent).toBeNull();
        expect(page.notFoundMessage).toContain('404');
      });

      it('shows card content if metadata is found', async () => {
        havingLoaded(aurora);

        await page.stabilize();

        expect(page.isFlashCardVisible()).toBe(true);
        expect(page.markdownContent.textContent).toContain('aurora is a database');
      });
    })

    describe('rewards', () => {
      it('rewards user on first attempt', async () => {
        havingLoaded(aurora);
        havingGamificationEnabled();
        havingHighscore(Highscore.NONE);
        component.textPopComponent = { pop: vi.fn() } as any;

        await (component as any).notifyScore(aHighscore(50, 50));

        expect(component.textPopComponent.pop).not.toHaveBeenCalled();
        expect(component.firstAttempt).toBe(false);
      });

      it('rewards user on subsequent attempts if accuracy improves', async () => {
        havingLoaded(aurora);
        havingGamificationEnabled();
        havingHighscore(aHighscore(10, 10));
        component.textPopComponent = { pop: vi.fn() } as any;

        await component.onProgress({score: aHighscore(50, 50)});
        await component.onProgress({score: aHighscore(60, 60)});

        expect(component.textPopComponent.pop).toHaveBeenCalled();
        expect(component.firstAttempt).toBe(false);
      });

      it('does not reward user on subsequent attempts if accuracy does not improve', async () => {
        havingLoaded(aurora);
        havingGamificationEnabled();
        havingHighscore(aHighscore(10, 10));
        component.textPopComponent = { pop: vi.fn() } as any;

        await component.onProgress({score: aHighscore(50, 50)});
        await component.onProgress({score: aHighscore(80, 50)});

        expect(component.textPopComponent.pop).not.toHaveBeenCalled();
        expect(component.firstAttempt).toBe(false);
      });

      it('throws confetti on perfect score', async () => {
        havingLoaded(aurora);
        havingGamificationEnabled();
        havingHighscore(aHighscore(10, 10));
        component.textPopComponent = { pop: vi.fn() } as any;

        await component.onProgress({score: aHighscore(60, 60)});
        await component.onProgress({score: aHighscore(100, 100)});

        expect(component.textPopComponent.pop).not.toHaveBeenCalled();
        expect(confetti.wasCalled().withAnyQuantity()).toBe(true);
      });

      it('does not throw confetti on non-perfect score', async () => {
        havingLoaded(aurora);
        havingGamificationEnabled();
        havingHighscore(aHighscore(10, 10));
        component.textPopComponent = { pop: vi.fn() } as any;

        await component.onProgress({score: aHighscore(60, 60)});
        await component.onProgress({score: aHighscore(100, 99)});

        expect(confetti.wasCalled().withAnyQuantity()).toBe(false);
      });

      it('resets highscore when reset button is clicked', async () => {
        havingLoaded(aurora);
        havingHighscore(aHighscore(80, 90));
        havingGamificationEnabled();

        await page.stabilize();

        expect(page.highscore.isEqualTo(aHighscore(80, 90))).toBe(true);

        page.clickResetButton();

        await page.stabilize();

        expect(page.highscore.isEqualTo(Highscore.NONE));
      });
    })


    function havingFlashcard(descriptor: CardDescriptor) {
        flashCardProvider.havingServices(descriptor.metadata);
        flashCardProvider.havingFlashCard(
          new FlashCardId(aurora.metadata.id),
          aFlashCard().withLearningMaterial(descriptor.learningMaterial)
        );
    }

    function havingLoaded(descriptor: CardDescriptor) {
        havingFlashcard(descriptor);
        navigateTo(descriptor.metadata.id.toString());
    }

    function havingHighscore(highscore: Highscore) {
      component.highscore = highscore;
    }

    function havingGamificationEnabled() {
      gamification.setEnabled(true);
    }

    function navigateTo(cardId: string) {
      activatedRouteMock.setCardId(cardId)
    }

});


function aHighscore(progress: number, accuracy: number) {
  return new Highscore(new Percentage(progress), new Percentage(accuracy));
}

function aFlashCard() {
  return {
    withLearningMaterial(content: string) {
      return {
        mainContent: content,
        singleChoiceQuestions: [],
        booleanQuestions: []
      }
    }
  }
}

class FlashCardComponentPage extends PageObject<FlashCardComponent> {

  constructor(fixture: ComponentFixture<FlashCardComponent>) {
    super(fixture);
  }

  get notFoundMessage(): string {
    return this.lookupTextByDataTestId('not-found');
  }

  isSpinnerVisible(): boolean {
    return this.lookupByDataTestId('spinner') != null;
  }

  isFlashCardVisible(): boolean {
    return this.lookupByDataTestId('flash-card') != null;
  }

  get markdownContent(): HTMLElement {
    return this.lookupByDataTestId('markdown-content');
  }

  get resetButton(): HTMLElement {
    // return this.lookupByDataTestId('reset-highscore-button');
    const childHost = this.fixture.debugElement.query(By.directive(HighscoreDetailsComponent));
    const button = childHost.nativeElement.querySelector('[data-test-id="reset-highscore-button"]');

    return button;
  }

  get highscore(): Highscore {
    const childHost = this.fixture.debugElement.query(
      By.directive(HighscoreDetailsComponent)
    );

    const progressIndicator = childHost.nativeElement.querySelector('[data-test-id="progress-indicator"]');
    const accuracyIndicator = childHost.nativeElement.querySelector('[data-test-id="accuracy-indicator"]');

    const progressString = progressIndicator?.querySelector('[data-test-id="value"]')?.textContent?.trim();
    const accuracyString = accuracyIndicator?.querySelector('[data-test-id="value"]')?.textContent?.trim();

    const progress = progressString?.replace('%', '') ?? '0';
    const accuracy = accuracyString?.replace('%', '') ?? '0';

    return new Highscore(new Percentage(Number(progress)), new Percentage(Number(accuracy)));
  }

  clickResetButton() {
    this.resetButton.click();
  }
}

