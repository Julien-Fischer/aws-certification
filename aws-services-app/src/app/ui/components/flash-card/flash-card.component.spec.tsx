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
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should reset highscore when reset button is clicked', async () => {
        // Arrange
        const highscore = new Highscore(new Date(), 80, 90);
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
        expect(forgetSpy).toHaveBeenCalledWith(new FlashCardId('test'));
    });
});
