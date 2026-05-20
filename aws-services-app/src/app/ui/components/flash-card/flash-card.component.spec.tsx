import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {FlashCardComponent} from "./flash-card.component";
import {ActivatedRoute} from "@angular/router";
import {SearchService} from "../../../domain/search/services/search.service";
import {saveHighscoreInjectionToken} from "../../../domain/scoring/save-highscore";
import {scoreProviderInjectionToken} from "../../../domain/scoring/score-provider";
import {of} from "rxjs";
import Highscore from "../../../domain/scoring/models/highscore";

describe('FlashCardComponent', () => {
    let component: FlashCardComponent;
    let fixture: ComponentFixture<FlashCardComponent>;

    beforeEach(async () => {
        const mockFlashCardService = {
            getMetadata: vi.fn().mockReturnValue(of({ id: 'test', name: 'Test Service', description: 'Test', icon: 'test-icon' })),
            getFlashCard: vi.fn().mockReturnValue(of({ mainContent: 'Test Content', trueFalseQuestions: [], multipleChoiceQuestions: [] }))
        };
        const mockScoreProvider = {
            get: vi.fn().mockReturnValue(Highscore.NONE)
        };
        const mockScoreWriter = {
            score: vi.fn()
        };

        await TestBed.configureTestingModule({
            imports: [FlashCardComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: { paramMap: { get: () => 'test' } }
                    }
                },
                { provide: SearchService, useValue: mockFlashCardService },
                { provide: scoreProviderInjectionToken, useValue: mockScoreProvider },
                { provide: saveHighscoreInjectionToken, useValue: mockScoreWriter }
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
});
