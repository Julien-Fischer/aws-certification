import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';

import {QuizComponent} from "./quiz.component";
import {Shuffler, shufflerInjectionToken} from "../../services/shuffler";
import {Answer, Option, MultipleChoiceQuiz, Quiz, TrueFalseQuiz} from "../../../domain/learning/models/quiz";
import PageObject from "../../test/page-object";
import Score from "../../../domain/scoring/models/score";

class MockShuffler implements Shuffler {

    private called = false;

    shuffle<T>(array: T[]): T[] {
        this.called = true;
        return array;
    }

    wasCalled(): boolean {
        return this.called;
    }

}

describe('QuizComponent', () => {

    let component: QuizComponent;
    let fixture: ComponentFixture<QuizComponent>;
    let page: QuizComponentPage;
    let mockShuffler: MockShuffler;

    beforeEach(async () => {
        mockShuffler = new MockShuffler();
        await TestBed.configureTestingModule({
            imports: [QuizComponent],
            providers: [
                { provide: shufflerInjectionToken, useValue: mockShuffler }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(QuizComponent);
        component = fixture.componentInstance;
        page = new QuizComponentPage(fixture);
        fixture.detectChanges();
    });


    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('page has no quiz', async () => {
        await havingNoQuizzes();

        expect(page.hasNoQuiz()).toBe(true);
    })

    it('page has a quiz', async () => {
        await having(aQuiz());

        expect(page.hasNoQuiz()).toBe(false);
    })

    it('shows progress at 0%', async () => {
        await having(aQuiz());

        expect(page.progress).toBe('0%');
        expect(page.score).toBe(0);
    });

    it('quizzes are shuffled', async () => {
        await having(aQuiz(), aQuiz());

        expect(mockShuffler.wasCalled()).toBe(true);
    })

    it('displays first question', async () => {
        await having(aQuiz());

        expect(page.questionHeader).toContain('Question 1 of 1');
        expect(page.questionText).toBe(component.currentQuiz.question);
    });

    it('displays first question', async () => {
        await having(aQuiz(), aQuiz());

        expect(page.questionHeader).toContain('Question 1 of 2');
        expect(page.questionText).toBe(component.currentQuiz.question);
    });

    it('displays options for multiple choice quiz', async () => {
        await having({
            question: 'Which feature provides cross-Region disaster recovery for Aurora?',
            answer: new Answer(new Option('B. Aurora Global Database')),
            options: [
                new Option('A. Aurora Replicas'),
                new Option('B. Aurora Global Database'),
                new Option('C. Multi-AZ')
            ]
        });

        expect(page.optionCards).toHaveLength(3);
        expect(page.option(0)).toContain('Aurora Replicas');
        expect(page.option(1)).toContain('Aurora Global Database');
        expect(page.option(2)).toContain('Multi-AZ');
    })

    it('selects option and enable submit', async () => {
        await having(aMultipleChoiceQuiz());
        expect(page.isSubmitButtonDisabled()).toBe(true);

        await page.clickOption(0);

        expect(page.isOptionSelected(0)).toBe(true);
        expect(page.isSubmitButtonDisabled()).toBe(false);
    });

    it('unselects option and disable submit', async () => {
        await having(aMultipleChoiceQuiz(), aQuiz());
        expect(page.isSubmitButtonDisabled()).toBe(true);

        await page.clickOption(0);

        expect(page.isOptionSelected(0)).toBe(true);
        expect(page.isSubmitButtonDisabled()).toBe(false);

        await page.clickSubmit();
        await page.clickNext();

        expect(page.isOptionSelected(0)).toBe(false);
        expect(page.isSubmitButtonDisabled()).toBe(true);
    });

    it('increments score on correct answer', async () => {
        await having(
            {
                question: 'Aurora automatically replicates your data across 6 copies in 3 AZs.',
                answer: new Answer(true)
            },
            {
                question: 'Aurora Replicas use asynchronous replication with high latency.',
                answer: new Answer(false)
            }
        );

        await page.clickTrueButton();
        await page.clickSubmit();
        expect(page.score).toBe(1);

        await page.clickTrueButton();
        await page.clickSubmit();
        expect(page.score).toBe(1);
    });

    it('shows incorrect feedback on submit', async () => {
        await having({
            question: 'Aurora automatically replicates your data across 6 copies in 3 AZs.',
            answer: new Answer(true)
        });

        await page.clickFalseButton();
        await page.clickSubmit();

        expect(page.isFeedbackSuccess()).toBe(false);
        expect(page.isFeedbackError()).toBe(true);
        expect(page.feedbackText).toBe('Incorrect');
    });

    it('marks incorrect option when submitting wrong answer', async () => {
        await having(
            {
                question: 'Which feature provides cross-Region disaster recovery for Aurora?',
                answer: new Answer(new Option('B. Aurora Global Database')),
                options: [
                    new Option('A. Aurora Replicas'),
                    new Option('B. Aurora Global Database'),
                    new Option('C. Multi-AZ')
                ]
            },
        );

        await page.clickOption(0);
        await page.clickSubmit();

        expect(page.isOptionWrong(0)).toBe(true);
        expect(page.isOptionWrong(1)).toBe(false);
        expect(page.isOptionWrong(2)).toBe(false);
        expect(page.isOptionCorrect(0)).toBe(false);
        expect(page.isOptionCorrect(1)).toBe(true);
        expect(page.isOptionCorrect(2)).toBe(false);
    });

    it('does not mark incorrect option when submitting correct answer', async () => {
        await having(
            {
                question: 'Which feature provides cross-Region disaster recovery for Aurora?',
                answer: new Answer(new Option('B. Aurora Global Database')),
                options: [
                    new Option('A. Aurora Replicas'),
                    new Option('B. Aurora Global Database'),
                    new Option('C. Multi-AZ')
                ]
            },
        );

        await page.clickOption(1);
        await page.clickSubmit();

        expect(page.isOptionWrong(0)).toBe(false);
        expect(page.isOptionWrong(1)).toBe(false);
        expect(page.isOptionWrong(2)).toBe(false);
        expect(page.isOptionCorrect(0)).toBe(false);
        expect(page.isOptionCorrect(1)).toBe(true);
        expect(page.isOptionCorrect(2)).toBe(false);
    });

    it('show incorrect feedback on submit (multiple choice)', async () => {
        await having(
            {
                question: 'Which feature provides cross-Region disaster recovery for Aurora?',
                answer: new Answer(new Option('B. Aurora Global Database')),
                options: [
                    new Option('A. Aurora Replicas'),
                    new Option('B. Aurora Global Database'),
                    new Option('C. Multi-AZ')
                ]
            },
            {
                question: 'Aurora automatically replicates your data across 6 copies in 3 AZs.',
                answer: new Answer(true)
            }
        );

        await page.clickOption(0);
        await page.clickSubmit();
        expect(page.isFeedbackError()).toBe(true);
        expect(page.feedbackText).toBe('Incorrect');
    });

    it('can select true and submit', async () => {
        await having({
            question: 'Aurora automatically replicates your data across 6 copies in 3 AZs.',
            answer: new Answer(true)
        });

        await page.clickTrueButton();
        expect(page.isTrueButtonActive()).toBe(true);
        expect(page.isFalseButtonActive()).toBe(false);

        await page.clickSubmit();
        expect(page.feedbackText).toBe('Correct!');
    });

    it('updates progress bar', async () => {
        await having(
            {
                question: 'Which feature provides cross-Region disaster recovery for Aurora?',
                answer: new Answer(new Option('B. Aurora Global Database')),
                options: [
                    new Option('A. Aurora Replicas'),
                    new Option('B. Aurora Global Database'),
                    new Option('C. Multi-AZ')
                ]
            },
            {
                question: 'Aurora automatically replicates your data across 6 copies in 3 AZs.',
                answer: new Answer(true)
            }
        );
        expect(page.progress).contains('0%');

        await page.clickOption(1);
        await page.clickSubmit();
        expect(page.feedbackText).toBe('Correct!');

        await page.clickNext()
        expect(page.progress).contains('50%');
    });

    it('shows completion screen (success)', async () => {
        await having(aQuiz(), aQuiz());

        component.quizCompleted = true;
        component.score = 2;
        fixture.detectChanges();

        expect(page.isQuizComplete()).toBe(true);
        expect(page.completionScore).toBe('2');
        expect(page.hasSuccessIcon()).toBe(true);
        expect(page.hasFailureIcon()).toBe(false);
    });


    it('shows completion screen (failure)', async () => {
        await having(aQuiz(), aQuiz(), aQuiz());

        component.quizCompleted = true;
        component.currentIndex = 3;
        component.score = 1;
        fixture.detectChanges();

        expect(page.isQuizComplete()).toBe(true);
        expect(page.completionScore).toBe('1');
        expect(page.hasSuccessIcon()).toBe(false);
        expect(page.hasFailureIcon()).toBe(true);
    });

    it('resets metrics', async () => {
        await having(aQuiz(), aQuiz());

        component.quizCompleted = true;
        component.score = 2;
        fixture.detectChanges();

        await page.clickTryAgain();

        expect(page.progress).toBe('0%');
        expect(page.isQuizComplete()).toBe(false);
        expect(page.completionScore).toBe('');
        expect(page.hasSuccessIcon()).toBe(false);
        expect(page.hasFailureIcon()).toBe(false);
    });


    async function having(...quizzes: (TrueFalseQuiz | MultipleChoiceQuiz)[]) {
        fixture.componentRef.setInput('quizzes', [...quizzes]);
        await page.stabilize();
    }

    function aMultipleChoiceQuiz(): MultipleChoiceQuiz {
        return {
            question: 'Which feature provides cross-Region disaster recovery for Aurora?',
            answer: new Answer(new Option('B. Aurora Global Database')),
            options: [
                new Option('A. Aurora Replicas'),
                new Option('B. Aurora Global Database'),
                new Option('C. Multi-AZ')
            ]
        };
    }

    async function havingNoQuizzes() {
        await having();
    }

    function aQuiz(): Quiz {
        return aMultipleChoiceQuiz();
    }

});


export class QuizComponentPage extends PageObject<QuizComponent> {

    constructor(fixture: ComponentFixture<QuizComponent>) {
        super(fixture);
    }

    get progressBar() {
        return this.lookupElement('.progress-bar') as HTMLElement;
    }

    get progress() {
        return this.progressBar?.style.width || '0%';
    }

    get questionHeader() {
        return this.lookupTextOfElement('h5');
    }

    get questionText() {
        return this.lookupTextOfElement('.lead');
    }

    get optionCards() {
        return Array.from(this.fixture.nativeElement.querySelectorAll('.option-card')) as HTMLElement[];
    }

    get option() {
        return (index: number) => this.optionCards[index]?.textContent?.trim() || '';
    }

    isOptionCorrect(index: number) {
        return this.hasOptionClass(index, 'correct');
    }

    isOptionWrong(index: number) {
        return this.hasOptionClass(index, 'wrong');
    }

    isOptionSelected(index: number) {
        return this.hasOptionClass(index, 'selected');
    }

    get trueButton() {
        return this.lookupElement('button.btn-outline-success') as HTMLElement;
    }

    get falseButton() {
        return this.lookupElement('button.btn-outline-danger') as HTMLElement;
    }

    isTrueButtonActive() {
        return this.trueButton?.classList.contains('active');
    }

    isFalseButtonActive() {
        return this.falseButton?.classList.contains('active');
    }

    get feedbackSection() {
        return this.lookupElement('.feedback-section') as HTMLElement;
    }

    get feedbackText() {
        return this.lookupTextOfElement('.feedback-section .fw-bold');
    }

    isFeedbackSuccess() {
        return this.feedbackSection?.classList.contains('bg-success-light');
    }

    isFeedbackError() {
        return this.feedbackSection?.classList.contains('bg-danger-light');
    }

    get submitButton() {
        return this.lookupElement('button.main-button:not([disabled])') as HTMLElement;
    }

    get nextButton() {
        return this.lookupElement('button.main-button') as HTMLElement;
    }

    isSubmitButtonDisabled() {
        const btn = this.submitButton;
        return btn ? btn.hasAttribute('disabled') : true;
    }

    get completionScore() {
        return this.lookupTextOfElement('.lead .fw-bold');
    }

    get score(): number {
        return this.fixture.componentInstance.score;
    }

    get tryAgainButton() {
        return this.lookupElement('button.btn-primary') as HTMLElement;
    }

    isQuizComplete() {
        return !!this.lookupElement('.text-center.py-4 h3');
    }

    hasNoQuiz(): boolean {
        const p = this.lookupElement('p') as HTMLElement | null;
        return !!p && (p.textContent?.trim() === 'No quiz questions available for this service.' || false);
    }

    hasSuccessIcon(): boolean {
        return !!this.lookupElement('.fa-trophy');
    }

    hasFailureIcon(): boolean {
        return !!this.lookupElement('.fa-thumbs-down');
    }

    async clickOption(index: number) {
        await this.clickElement(this.optionCards[index]);
    }

    async clickTrueButton() {
        await this.clickElement(this.trueButton);
    }

    async clickFalseButton() {
        await this.clickElement(this.falseButton);
    }

    async clickSubmit() {
        await this.clickElement(this.nextButton);
    }

    async clickNext() {
        await this.clickElement(this.nextButton);
    }

    async clickTryAgain() {
        await this.clickElement(this.tryAgainButton);
    }

    private hasOptionClass(index: number, className: string) {
        const card = this.optionCards[index];
        if (card == null) {
            throw new Error(`Option card at index ${index} not found`);
        }
        return card.classList.contains(className);
    }

}
