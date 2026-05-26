import { ComponentFixture, TestBed } from '@angular/core/testing';
import {describe, it, expect, beforeEach, vi} from 'vitest';
import {FlashCardComponent} from "./flash-card.component";
import {ActivatedRoute, Router} from "@angular/router";
import {SearchService} from "../../../domain/search/services/search.service";
import {saveHighscoreInjectionToken} from "../../../domain/scoring/highscore-evaluator";
import {scoreProviderInjectionToken} from "../../../domain/scoring/score-provider";
import {of} from "rxjs";
import Highscore from "../../../domain/scoring/models/highscore";
import {carouselInjectionToken} from "../../../domain/search/carousel";
import {gamificationInjectionToken} from "../../services/gamification";
import {forgetHighscoreInjectionToken} from "../../../domain/scoring/highscore-eraser";
import {FlashCardId} from "../../../domain/shared/flash-card-id";
import {By} from "@angular/platform-browser";
import Percentage from "../../../domain/scoring/models/percentage";

describe('FlashCardComponent', () => {
    let component: FlashCardComponent;
    let fixture: ComponentFixture<FlashCardComponent>;

    beforeEach(async () => {
        const mockFlashCardService = {
            getMetadata: vi.fn().mockReturnValue(of({ id: 'test', name: 'Test Service', description: 'Test', icon: 'test-icon' })),
            getAllMetadata: vi.fn().mockReturnValue(of([{ id: 'test', name: 'Test Service', description: 'Test', icon: 'test-icon' }])),
            getFlashCard: vi.fn().mockReturnValue(of({ mainContent: 'Test Content', trueFalseQuestions: [], multipleChoiceQuestions: [] }))
        };
        const mockScoreProvider = {
            get: vi.fn().mockReturnValue(Highscore.NONE)
        };
        const mockScoreWriter = {
            score: vi.fn()
        };
        const mockRouter = {
            navigate: vi.fn()
        };
        const mockCarousel = {
            next: vi.fn().mockReturnValue(of({ id: 'next', name: 'Next' })),
            prev: vi.fn().mockReturnValue(of({ id: 'prev', name: 'Prev' }))
        };
        const mockGamification = {
            isEnabled: vi.fn().mockReturnValue(false)
        };
        const mockForgetHighscore = {
            forget: vi.fn()
        };

        await TestBed.configureTestingModule({
            imports: [FlashCardComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        paramMap: of({ get: () => 'test' }),
                        snapshot: { paramMap: { get: () => 'test' } }
                    }
                },
                { provide: Router, useValue: mockRouter },
                { provide: SearchService, useValue: mockFlashCardService },
                { provide: scoreProviderInjectionToken, useValue: mockScoreProvider },
                { provide: saveHighscoreInjectionToken, useValue: mockScoreWriter },
                { provide: carouselInjectionToken, useValue: mockCarousel },
                { provide: gamificationInjectionToken, useValue: mockGamification },
                { provide: forgetHighscoreInjectionToken, useValue: mockForgetHighscore }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FlashCardComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should show loading spinner while metadata is null', () => {
        const mockFlashCardService = TestBed.inject(SearchService);
        const metadataSubject = new BehaviorSubject<any>(null);
        vi.spyOn(mockFlashCardService, 'getMetadata').mockReturnValue(metadataSubject.asObservable());

        fixture.detectChanges();

        expect(component.loading).toBe(true);
        const spinner = fixture.debugElement.query(By.css('.spinner-border'));
        expect(spinner).toBeTruthy();
    });

    it('should show 404 if metadata is undefined (not found)', () => {
        const mockFlashCardService = TestBed.inject(SearchService);
        vi.spyOn(mockFlashCardService, 'getMetadata').mockReturnValue(of(undefined));

        fixture.detectChanges();

        expect(component.loading).toBe(false);
        expect(component.service).toBeUndefined();
        const error404 = fixture.debugElement.query(By.css('h2.text-6xl'));
        expect(error404.nativeElement.textContent).toBe('404');
    });

    it('should show content if metadata is found', () => {
        const mockFlashCardService = TestBed.inject(SearchService);
        const serviceMetadata = { id: 'test', name: 'Test Service', description: 'Test', icon: 'test-icon' };
        vi.spyOn(mockFlashCardService, 'getMetadata').mockReturnValue(of(serviceMetadata));

        fixture.detectChanges();

        expect(component.loading).toBe(true); // Still true because markdown might be loading, but service is set
        expect(component.service).toEqual(serviceMetadata);
    });

    it('should not reward user on first attempt', async () => {
        // Arrange
        const mockGamification = TestBed.inject(gamificationInjectionToken);
        vi.spyOn(mockGamification, 'isEnabled').mockReturnValue(true);

        const mockSaveHighscore = TestBed.inject(saveHighscoreInjectionToken);
        const newHighscore = new Highscore(new Percentage(80), new Percentage(80));
        vi.spyOn(mockSaveHighscore, 'submit').mockResolvedValue(newHighscore);

        // Access private component state for test
        component.highscore = Highscore.NONE;
        component.firstAttempt = true;

        // Mock the text pop component
        component.textPopComponent = { pop: vi.fn() } as any;

        // Act
        // Simulate score notification which triggers reward logic
        await (component as any).notifyScore(newHighscore);

        // Assert
        expect(component.textPopComponent.pop).not.toHaveBeenCalled();
        expect(component.firstAttempt).toBe(false);
    });

    it('should reward user on subsequent attempts if score improves', async () => {
        // Arrange
        const mockGamification = TestBed.inject(gamificationInjectionToken);
        vi.spyOn(mockGamification, 'isEnabled').mockReturnValue(true);

        const mockSaveHighscore = TestBed.inject(saveHighscoreInjectionToken);
        const initialHighscore = new Highscore(new Percentage(50), new Percentage(50));
        const improvedHighscore = new Highscore(new Percentage(60), new Percentage(90));
        vi.spyOn(mockSaveHighscore, 'submit').mockResolvedValue(improvedHighscore);

        // Access private component state for test
        component.highscore = initialHighscore;
        component.firstAttempt = false;

        // Mock the text pop component
        component.textPopComponent = { pop: vi.fn() } as any;

        // Act
        await (component as any).notifyScore(improvedHighscore);

        // Assert
        expect(component.textPopComponent.pop).toHaveBeenCalled();
    });

    it('should reset highscore when reset button is clicked', async () => {
        // Arrange
        const highscore = new Highscore(new Percentage(80), new Percentage(90));
        component.highscore = highscore;
        fixture.detectChanges();

        const forgetHighscore = TestBed.inject(forgetHighscoreInjectionToken);
        const forgetSpy = vi.spyOn(forgetHighscore, 'forget');

        // Act
        const resetButton = fixture.debugElement.query(By.css('.reset-highscore-btn'));
        expect(resetButton).toBeTruthy();
        resetButton.nativeElement.click();
        fixture.detectChanges();

        // Assert
        expect(component.highscore).toBe(Highscore.NONE);
        expect(component.firstAttempt).toBe(true);
        expect(forgetSpy).toHaveBeenCalledWith(new FlashCardId('test'));
    });
});
