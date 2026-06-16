import {ComponentFixture, TestBed} from '@angular/core/testing';
import {describe, it, expect, beforeEach} from 'vitest';

import {QuizComponent} from "./quiz.component";
import {
  Answer,
  Option,
  SingleChoiceQuestion,
  BooleanQuestion
} from "../../../domain/search/models/question";
import PageObject from "../../test/page-object";
import {submitAnswerInjectionToken} from "../../../domain/training/ports/inbound/submit-answer";
import {AnswerEvaluator} from "../../../domain/training/answer-evaluator";
import {InMemoryQuizRepository} from "../../../infra/training/in-memory-quiz-repository";
import {TrainingSession} from "../../../domain/training/training-session";
import {shuffleProviderInjectionToken} from "../../../infra/training/shuffle-provider";
import {CreateQuiz} from "../../../infra/training/create-quiz.service";
import {buildAll, Builder} from "../../../test/builder";
import {Letter} from "../../../infra/learning/markdown-parser.service";
import {DeterministicShuffleProvider, MockNoShuffle} from "../../test/mock-shuffle";
import {StartQuiz} from "../../../domain/training/ports/inbound/start-quiz";
import {QuestionsToQuizRequest} from "../../services/questions-to-quiz-request";
import {quizRepositoryInjectionToken} from "../../../domain/training/ports/outbound/quiz-repository";

const questionsMapper = new QuestionsToQuizRequest();

describe('QuizComponent', () => {

  let component: QuizComponent;
  let fixture: ComponentFixture<QuizComponent>;
  let page: QuizComponentPage;

  let shuffle: MockNoShuffle;
  let shuffleProvider: DeterministicShuffleProvider;

  let trainingSession: StartQuiz;
  let quizRepository: InMemoryQuizRepository;
  let createQuiz: CreateQuiz;

  beforeEach(async () => {
    shuffle = new MockNoShuffle();
    shuffleProvider = new DeterministicShuffleProvider(shuffle);
    quizRepository = new InMemoryQuizRepository();
    trainingSession = new TrainingSession(quizRepository);
    createQuiz = new CreateQuiz(trainingSession, shuffleProvider);

    await TestBed.configureTestingModule({
      imports: [QuizComponent],
      providers: [
        {provide: submitAnswerInjectionToken, useClass: AnswerEvaluator},
        {provide: quizRepositoryInjectionToken, useValue: quizRepository},
        {provide: shuffleProviderInjectionToken, useValue: shuffleProvider}
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
    await havingNoQuiz();

    expect(page.hasNoQuiz()).toBe(true);
  })

  it('page has a quiz', async () => {
    await having(aQuestion());

    expect(page.hasNoQuiz()).toBe(false);
  })

  it('shuffles questions', async () => {
    await having(aQuestion(), aQuestion(), aQuestion());

    expect(shuffle.wasCalled()).toBe(true);
  })

  it('shows progress at 0%', async () => {
    await having(aQuestion());

    expect(page.progress).toBe('0%');
    expect(page.accuracy).toBe(0);
  });

  it('displays first question', async () => {
    await having(aBooleanQuestion('Question text 1'));

    expect(page.questionText).toBe('Question text 1');
    expect(page.questionHeader).toContain('Question 1 of 1');
  });

  it('displays all questions', async () => {
    await having(
      aBooleanQuestion('Question text 1'),
      aBooleanQuestion('Question text 2')
    );

    expect(page.questionText).toBe('Question text 1');
    expect(page.questionHeader).toContain('Question 1 of 2');

    await answer();

    expect(page.questionText).toBe('Question text 2');
    expect(page.questionHeader).toContain('Question 2 of 2');
  });

  it('displays options for multiple choice quiz', async () => {
    await having(
      aSingleChoiceQuestion()
        .labelled('Which feature provides cross-Region disaster recovery for Aurora?')
        .withOptions('A. Aurora Replicas', 'B. Aurora Global Database', 'C. Multi-AZ')
        .withCorrectAnswer('B')
    );

    expect(page.optionCards).toHaveLength(3);
    expect(page.option(0)).toContain('Aurora Replicas');
    expect(page.option(1)).toContain('Aurora Global Database');
    expect(page.option(2)).toContain('Multi-AZ');
  })

  it('selects option and enable submit', async () => {
    await having(aSingleChoiceQuestion()
      .withCorrectAnswer('A'));

    expect(page.isSubmitButtonDisabled()).toBe(true);

    await page.clickOption(0);

    expect(page.isOptionSelected(0)).toBe(true);
    expect(page.isSubmitButtonDisabled()).toBe(false);
  });

  it('unselects option and disable submit', async () => {
    await having(
      aSingleChoiceQuestion(),
      aSingleChoiceQuestion()
    );
    expect(page.isSubmitButtonDisabled()).toBe(true);

    await page.clickOption(0);

    expect(page.isOptionSelected(0)).toBe(true);
    expect(page.isSubmitButtonDisabled()).toBe(false);

    await showNextQuestion();

    expect(page.isOptionSelected(0)).toBe(false);
    expect(page.isSubmitButtonDisabled()).toBe(true);
  });

  it('increments accuracy on correct answer', async () => {
    await having(
      aTrueStatement(),
      aFalseStatement()
    );

    await page.clickTrueButton();
    await page.clickSubmitButton();
    expect(page.accuracy).toBe(50);
    expect(page.progress).toBe('50%');

    await page.clickNextButton();

    await page.clickFalseButton();
    await page.clickSubmitButton();
    expect(page.accuracy).toBe(100);
    expect(page.progress).toBe('100%');
  });

  it('shows incorrect feedback on submit', async () => {
    await having(aTrueStatement());

    await page.clickFalseButton();
    await page.clickSubmitButton();

    expect(page.isFeedbackSuccess()).toBe(false);
    expect(page.isFeedbackError()).toBe(true);
    expect(page.feedbackText).toBe('Incorrect');
  });

  it('marks incorrect option when submitting wrong answer', async () => {
    await having(
      aSingleChoiceQuestion()
        .labelled('Which feature provides cross-Region disaster recovery for Aurora?')
        .withOptions('A. Aurora Replicas', 'B. Aurora Global Database', 'C. Multi-AZ')
        .withCorrectAnswer('B')
    );

    await page.clickOption(0);
    await page.clickSubmitButton();

    expect(page.isOptionWrong(0)).toBe(true);
    expect(page.isOptionWrong(1)).toBe(false);
    expect(page.isOptionWrong(2)).toBe(false);
    expect(page.isOptionCorrect(0)).toBe(false);
    expect(page.isOptionCorrect(1)).toBe(true);
    expect(page.isOptionCorrect(2)).toBe(false);
  });

  it('does not mark incorrect option when submitting correct answer', async () => {
    await having(aSingleChoiceQuestion()
      .withCorrectAnswer('B'));

    await page.clickOption(1);
    await page.clickSubmitButton();

    expect(page.isOptionWrong(0)).toBe(false);
    expect(page.isOptionWrong(1)).toBe(false);
    expect(page.isOptionWrong(2)).toBe(false);
    expect(page.isOptionCorrect(0)).toBe(false);
    expect(page.isOptionCorrect(1)).toBe(true);
    expect(page.isOptionCorrect(2)).toBe(false);
  });

  it('show incorrect feedback on submit (multiple choice)', async () => {
    await having(
      aSingleChoiceQuestion().withCorrectAnswer('B'),
      aSingleChoiceQuestion()
    );

    await page.clickOption(0);
    await page.clickSubmitButton();
    expect(page.isFeedbackError()).toBe(true);
    expect(page.feedbackText).toBe('Incorrect');
  });

  it('can select true and submit', async () => {
    await having(aTrueStatement());

    await page.clickTrueButton();
    expect(page.isTrueButtonActive()).toBe(true);
    expect(page.isFalseButtonActive()).toBe(false);

    await page.clickSubmitButton();
    expect(page.feedbackText).toBe('Correct!');
  });

  it('updates progress bar', async () => {
    await having(
      aSingleChoiceQuestion().withCorrectAnswer('B'),
      aSingleChoiceQuestion(),
    );
    expect(page.progress).contains('0%');

    await page.clickOption(1);
    await page.clickSubmitButton();
    expect(page.feedbackText).toBe('Correct!');

    await page.clickNextButton()
    expect(page.progress).contains('50%');
  });

  it('updates question index', async () => {
    await having(aBooleanQuestion(), aBooleanQuestion(), aBooleanQuestion());

    expect(page.questionHeader).toBe('Question 1 of 3');
    await answer();
    expect(page.questionHeader).toBe('Question 2 of 3');
    await answer();
    expect(page.questionHeader).toBe('Question 3 of 3');
  })

  it('shows completion screen (success)', async () => {
    await havingCompletedQuizWithNoMistakes();

    expect(page.isQuizComplete()).toBe(true);
    expect(page.completionScore).toBe('100');
    expect(page.hasSuccessIcon()).toBe(true);
    expect(page.hasFailureIcon()).toBe(false);
  });

  it('shows completion screen (failure)', async () => {
    await havingCompletedQuizWithLessThan50PercentAccuracy();

    expect(page.isQuizComplete()).toBe(true);
    expect(page.completionScore).toBe('33');
    expect(page.completedAccuracy).toBe(33);
    expect(page.hasSuccessIcon()).toBe(false);
    expect(page.hasFailureIcon()).toBe(true);
  });

  it('resets metrics', async () => {
    await havingCompletedQuiz()

    await page.clickTryAgain();

    expect(page.progress).toBe('0%');
    expect(page.isQuizComplete()).toBe(false);
    expect(page.completionScore).toBe('');
    expect(page.hasSuccessIcon()).toBe(false);
    expect(page.hasFailureIcon()).toBe(false);
  });


  it('shows explanation when answer is wrong and explanation exists', async () => {
    await having(aSingleChoiceQuestion()
      .withOptions('A. Wrong Answer 1', 'B. Correct Answer', 'C. Wrong Answer 2')
      .withCorrectAnswer('B')
      .withExplanation('Some explanation'));

    await page.clickOption(0);
    await page.clickSubmitButton();

    expect(page.explanationText).toContain('Some explanation');
  });

  it('does not show explanation when answer is correct', async () => {
    await having(aSingleChoiceQuestion()
      .withOptions('A. Wrong Answer 1', 'B. Correct Answer', 'C. Wrong Answer 2')
      .withCorrectAnswer('B')
      .withExplanation('Some explanation'));

    await page.clickOption(1);
    await page.clickSubmitButton();

    expect(page.explanationText).toBe('');
  });

  it('does not show explanation when it does not exist', async () => {
    await having(aSingleChoiceQuestion()
      .withCorrectAnswer('B'));

    await page.clickOption(0);
    await page.clickSubmitButton();

    expect(page.explanationText).toBe('');
  });


  async function having(...questions: Builder<any>[]) {
    const built = buildAll(questions);
    const quizRequest = questionsMapper.toQuizRequest(built, true);
    const quizDto = createQuiz.publish(quizRequest);
    fixture.componentRef.setInput('quiz', quizDto);
    await page.stabilize();
  }

  async function havingNoQuiz() {
    fixture.componentRef.setInput('quiz', undefined);
    await page.stabilize();
  }

  async function havingCompletedQuiz() {
    await havingCompletedQuizWithNoMistakes();
  }

  async function havingCompletedQuizWithNoMistakes() {
    await having(aTrueStatement(), aTrueStatement());
    await answer(true);
    await answer(true);
  }

  async function havingCompletedQuizWithLessThan50PercentAccuracy() {
    await having(aTrueStatement(), aTrueStatement(), aTrueStatement());
    await answer(true);
    await answer(false);
    await answer(false);
  }

  async function answer(trueButton: boolean = true) {
    if (trueButton) {
      await page.clickTrueButton();
    } else {
      await page.clickFalseButton();
    }
    await showNextQuestion();
  }

  async function showNextQuestion() {
    await page.clickSubmitButton();
    await page.clickNextButton();
  }

});


function aQuestion(): Builder<any> {
  return aTrueStatement();
}

function aBooleanQuestion(question?: string): BooleanQuestionBuilder {
  return aTrueStatement(question);
}

function aTrueStatement(question: string = 'Question Text'): BooleanQuestionBuilder {
  return new BooleanQuestionBuilder(question, true);
}

function aFalseStatement(question: string = 'Question Text'): BooleanQuestionBuilder {
  return new BooleanQuestionBuilder(question, false);
}

class BooleanQuestionBuilder implements Builder<BooleanQuestion> {

  constructor(
    private readonly label: string,
    private readonly value: boolean
  ) { }

  build(): BooleanQuestion {
    return {label: this.label, answer: new Answer(this.value)};
  }
}

function aSingleChoiceQuestion(): SingleChoiceQuestionBuilder {
  return new SingleChoiceQuestionBuilder();
}

class SingleChoiceQuestionBuilder implements Builder<SingleChoiceQuestion> {

  private label: string = 'Question label';

  private correctAnswer: Letter = 'B';

  private explanation?: string;

  private options: Option[] = [
    new Option('A. Aurora Replicas'),
    new Option('B. Aurora Global Database'),
    new Option('C. Multi-AZ')
  ];

  labelled(label: string): this {
    this.label = label;
    return this;
  }

  withCorrectAnswer(prefix: Letter): this {
    this.correctAnswer = prefix;
    return this;
  }

  withExplanation(explanation: string): this {
    this.explanation = explanation;
    return this;
  }

  withOptions(...options: string[]): this {
    this.options = options.map(option => new Option(option));
    return this;
  }

  build(): SingleChoiceQuestion {
    const correctOption = this.options.find(option => option.prefix === this.correctAnswer) || this.options[1];
    return {
      label: this.label,
      answer: new Answer(correctOption!, this.explanation),
      options: this.options
    }
  }

}

export class QuizComponentPage extends PageObject<QuizComponent> {

  constructor(fixture: ComponentFixture<QuizComponent>) {
    super(fixture);
  }

  get questionHeader(): string {
    return this.lookupTextByDataTestId('question-index');
  }

  get questionText(): string {
    return this.lookupTextByDataTestId('question-text');
  }

  get optionCards(): HTMLElement[] {
    return Array.from(this.fixture.nativeElement.querySelectorAll('.option-card'));
  }

  get option(): (index: number) => string {
    return (index: number) => this.optionCards[index]?.textContent?.trim() || '';
  }

  isOptionCorrect(index: number): boolean {
    return this.hasOptionClass(index, 'correct');
  }

  isOptionWrong(index: number): boolean {
    return this.hasOptionClass(index, 'wrong');
  }

  isOptionSelected(index: number): boolean {
    return this.hasOptionClass(index, 'selected');
  }

  get trueButton(): HTMLElement {
    return this.lookupElement('button.btn-outline-success');
  }

  get falseButton(): HTMLElement {
    return this.lookupElement('button.btn-outline-danger');
  }

  isTrueButtonActive(): boolean {
    return this.trueButton?.classList.contains('active');
  }

  isFalseButtonActive(): boolean {
    return this.falseButton?.classList.contains('active');
  }

  get feedbackSection(): HTMLElement {
    return this.lookupElement('.feedback-section');
  }

  get feedbackText(): string {
    return this.lookupTextOfElement('.feedback-section .fw-bold');
  }

  get explanationText(): string {
    return this.lookupElement('.explanation-text')?.innerHTML || '';
  }

  isFeedbackSuccess(): boolean {
    return this.feedbackSection?.classList.contains('bg-success-light');
  }

  isFeedbackError(): boolean {
    return this.feedbackSection?.classList.contains('bg-danger-light');
  }

  get submitButton(): HTMLElement {
    return this.lookupElement('button.main-button:not([disabled])');
  }

  get nextButton(): HTMLElement {
    return this.lookupElement('button.main-button');
  }

  isSubmitButtonDisabled(): boolean {
    const btn = this.submitButton;
    return btn ? btn.hasAttribute('disabled') : true;
  }

  get progressBar(): HTMLElement {
    return this.lookupElement('.progress-bar');
  }

  get progress(): string {
    return this.progressBar?.style.width || '0%';
  }

  get completionScore(): string {
    return this.lookupTextOfElement('.lead .fw-bold');
  }

  get accuracy(): number {
    return this.fixture.componentInstance.accuracy;
  }

  get completedAccuracy(): number {
    const text = this.lookupTextByDataTestId('completed-accuracy');
    return Number(text);
  }

  get completedHeaderText(): string {
    return this.lookupTextByDataTestId('completed-header');
  }

  get tryAgainButton(): HTMLElement {
    return this.lookupElement('button.btn-primary');
  }

  isQuizComplete(): boolean {
    return this.completedHeaderText === 'Quiz Complete!';
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

  async clickSubmitButton() {
    await this.clickElement(this.nextButton);
  }

  async clickNextButton() {
    await this.clickElement(this.nextButton);
  }

  async clickTryAgain() {
    await this.clickElement(this.tryAgainButton);
  }

  private hasOptionClass(index: number, className: string): boolean {
    const card = this.optionCards[index];
    if (card == null) {
      throw new Error(`Option card at index ${index} not found`);
    }
    return card.classList.contains(className);
  }

}
