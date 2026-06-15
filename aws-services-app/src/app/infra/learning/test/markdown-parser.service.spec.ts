import {TestBed} from '@angular/core/testing';
import {describe, it, expect, beforeEach} from 'vitest';

import {Letter, MarkdownParserService} from '../markdown-parser.service';
import {Answer, Option} from "../../../domain/search/models/question";
import {FlashCard} from "../../../domain/search/models/flash-card";
import {buildAll, Builder} from "../../../test/builder";

describe('MarkdownParserService', () => {

    let service: MarkdownParserService;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      service = TestBed.inject(MarkdownParserService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('main content', () => {
        it('removes title if present', () => {
            const markdown = aFlashCard()
                .withTitle('📊 AWS Audit & Monitoring – Flash Card')
                .withContent(`
                    ## ☁️ Amazon CloudWatch

                    ### ✅ Keypoints Summary
                    1. **Monitoring & observability** service for AWS resources & applications.
                    2. Collects **metrics, logs, and events** for real-time visibility.
                    3. Integrates with alarms, dashboards, and automation.
                `)
                .toMarkdown();

            const parsed = service.parse(markdown);

            expect(parsed.mainContent)
                .not.toContain('📊 AWS Audit & Monitoring – Flash Card')
            expect(parsed.mainContent)
                .toBe(toMarkdown(`
                    ## ☁️ Amazon CloudWatch

                    ### ✅ Keypoints Summary
                    1. **Monitoring & observability** service for AWS resources & applications.
                    2. Collects **metrics, logs, and events** for real-time visibility.
                    3. Integrates with alarms, dashboards, and automation.
                `))
        })

        it('returns content if title is absent', () => {
            const input = `
                ## ☁️ Amazon CloudWatch

                ### ✅ Keypoints Summary
                1. **Monitoring & observability** service for AWS resources & applications.
                2. Collects **metrics, logs, and events** for real-time visibility.
                3. Integrates with alarms, dashboards, and automation.
                ---`.trim();

            const parsed = service.parse(input);

            expect(parsed.mainContent)
                .toBe(input)
        })

        it('removes quizzes from mainContent', () => {
            const markdown = aFlashCard()
                .withContent(`
                    ## ☁️ Amazon CloudWatch

                    ### ✅ Keypoints Summary
                    1. **Monitoring & observability** service for AWS resources & applications.
                    2. Collects **metrics, logs, and events** for real-time visibility.
                    3. Integrates with alarms, dashboards, and automation.
                `)
                .toMarkdown();

            const parsed = service.parse(markdown);

            expectFlashCard(parsed).toHaveContent(`
                    ## ☁️ Amazon CloudWatch

                    ### ✅ Keypoints Summary
                    1. **Monitoring & observability** service for AWS resources & applications.
                    2. Collects **metrics, logs, and events** for real-time visibility.
                    3. Integrates with alarms, dashboards, and automation.
                `);
        });

        it('removes content after quizzes from mainContent', () => {
            const markdown = aFlashCard()
                .withContent(`
                    ## ☁️ Amazon CloudWatch

                    ### ✅ Keypoints Summary
                    1. **Monitoring & observability** service for AWS resources & applications.
                    2. Collects **metrics, logs, and events** for real-time visibility.
                    3. Integrates with alarms, dashboards, and automation.
                `)
                .with(aSingleChoiceQuestion())
                .withAdditionalInfo(` ✅ **Exam Tip**: Some tip. `)
                .toMarkdown();

            const parsed = service.parse(markdown);

            expectFlashCard(parsed).toHaveContent(`
                    ## ☁️ Amazon CloudWatch

                    ### ✅ Keypoints Summary
                    1. **Monitoring & observability** service for AWS resources & applications.
                    2. Collects **metrics, logs, and events** for real-time visibility.
                    3. Integrates with alarms, dashboards, and automation.
                `);
        });
    })

    describe('multiple choice questions', () => {
      it('parses one question', () => {
        const markdown = aFlashCard()
          .with(
            aMultipleChoiceQuestion()
              .labelled('Some question?')
              .withOptions('A. Option A', 'B. Option B', 'C. Option C', 'D. Option D')
              .withAnswer(['A', 'C']),
          )
          .toMarkdown();

        const parsed = service.parse(markdown);

        expectFlashCard(parsed)
          .toHaveMultipleChoiceQuestions([
            {
              label: 'Some question?',
              options: toOptions('A. Option A', 'B. Option B', 'C. Option C', 'D. Option D'),
              answer: selection('A. Option A', 'C. Option C')
            },
          ]);
      })

      it('parses multiple questions', () => {
        const markdown = aFlashCard()
          .with(
            aMultipleChoiceQuestion()
              .labelled('Some question?')
              .withOptions('A. Option A', 'B. Option B', 'C. Option C', 'D. Option D')
              .withAnswer(['A', 'C']),
            aMultipleChoiceQuestion()
              .labelled('Some other question?')
              .withOptions('A. Option A', 'B. Option B', 'C. Option C', 'D. Option D')
              .withAnswer(['B', 'D']),
          )
          .toMarkdown();

        const parsed = service.parse(markdown);

        expectFlashCard(parsed)
          .toHaveMultipleChoiceQuestions([
            {
              label: 'Some question?',
              options: toOptions('A. Option A', 'B. Option B', 'C. Option C', 'D. Option D'),
              answer: selection('A. Option A', 'C. Option C')
            },
            {
              label: 'Some other question?',
              options: toOptions('A. Option A', 'B. Option B', 'C. Option C', 'D. Option D'),
              answer: selection('B. Option B', 'D. Option D')
            },
          ]);
      })
    })

    describe('single choice questions', () => {
        it('parses one question', () => {
            const markdown = aFlashCard()
                .with(
                    aSingleChoiceQuestion()
                        .labelled('Some question?')
                        .withOptions('A. Option A', 'B. Option B', 'C. Option C', 'D. Option D')
                        .withAnswer('C'),
                )
                .toMarkdown();

            const parsed = service.parse(markdown);

            expectFlashCard(parsed)
                .toHaveSingleChoiceQuestions([
                    {
                        label: 'Some question?',
                        options: toOptions('A. Option A', 'B. Option B', 'C. Option C', 'D. Option D'),
                        answer: new Answer(new Option('C. Option C'))
                    }
                ])
        });

        it('parses multiple questions', () => {
            const markdown = aFlashCard()
                .with(
                    aSingleChoiceQuestion()
                        .labelled('Some question?')
                        .withOptions('A. Option A', 'B. Option B', 'C. Option C', 'D. Option D')
                        .withAnswer('C'),
                    aSingleChoiceQuestion()
                        .labelled('Some other question?')
                        .withOptions('A. Option 1', 'B. Option 2', 'C. Option 3', 'D. Option 4')
                        .withAnswer('B')
                )
                .toMarkdown();

            const parsed = service.parse(markdown);

            expectFlashCard(parsed)
                .toHaveSingleChoiceQuestions([
                    {
                        label: 'Some question?',
                        options: toOptions('A. Option A', 'B. Option B', 'C. Option C', 'D. Option D'),
                        answer: new Answer(new Option('C. Option C'))
                    },
                    {
                        label: 'Some other question?',
                        options: toOptions('A. Option 1', 'B. Option 2', 'C. Option 3', 'D. Option 4'),
                        answer: new Answer(new Option('B. Option 2'))
                    }
                ])
        });

        describe('Incomplete quizzes', () => {
            it('throws error for missing answer', () => {
                const questionWithMissingAnswer = toMarkdown(`
                    ## ❓ Exam Practice Quiz

                    ### 🔹 Multiple Choice
                    **Q1.** What is the capital of France?
                    A. Paris
                    B. London
                    C. Berlin
                    D. Madrid
                `);

                expect(() => service.parse(questionWithMissingAnswer))
                    .toThrow(/Invalid Multiple Choice question format \(missing answer\)/);
            })

            it('throws error for missing options', () => {
                const questionWithMisingQuestionText = toMarkdown(`
                    ## ❓ Exam Practice Quiz

                    ### 🔹 Multiple Choice
                    A. Paris
                    B. London
                    C. Berlin
                    D. Madrid
                    ✅ **Answer: B**
                `);

                expect(() => service.parse(questionWithMisingQuestionText))
                    .toThrow('No valid questions found in this quiz');
            })

            it('throws error for missing question text', () => {
                const questionWithMissingOptions = toMarkdown(`
                    ## ❓ Exam Practice Quiz

                    ### 🔹 Multiple Choice
                    **Q1.** What is the capital of France?
                `);

                expect(() => service.parse(questionWithMissingOptions))
                    .toThrow(/Invalid Multiple Choice question format \(missing options\)/);
            })
        })

    });

    describe('true/false questions', () => {

        it('parses one question', () => {
            const markdown = aFlashCard().with(
                aTrueStatement().labelled('A true statement.')
            ).toMarkdown();

            const parsed = service.parse(markdown);

            expectFlashCard(parsed)
                .toHaveBooleanQuestions([
                    {
                        label: 'A true statement.',
                        answer: new Answer(true)
                    }
                ])
        });

        it('parses multiple questions', () => {
            const markdown = aFlashCard().with(
                aTrueStatement().labelled('A true statement.'),
                aFalseStatement().labelled('A false statement.'),
                aTrueStatement().labelled('Another true statement.'),
            ).toMarkdown();

            const parsed = service.parse(markdown);

            expectFlashCard(parsed)
                .toHaveBooleanQuestions([
                    {
                        label: 'A true statement.',
                        answer: new Answer(true)
                    },
                    {
                        label: 'A false statement.',
                        answer: new Answer(false)
                    },
                    {
                        label: 'Another true statement.',
                        answer: new Answer(true)
                    }
                ])
        });

        it('throws error for missing answer', () => {
            const markdownWithMissingAnswer = toMarkdown(`
                ## ❓ Exam Practice Quiz

                ### 🔹 True / False
                **Q4.** CloudWatch Unified Agent collects both logs and OS-level metrics.
                ✅ True
                **Q6.** CloudWatch Alarms can trigger Auto Scaling policies.
            `);

            expect(() => service.parse(markdownWithMissingAnswer))
                .toThrow(/Invalid True\/False question format \(missing answer\):/);
        });

    })

    describe('explanation', () => {

        describe('multiple choice quiz', () => {
            it('one explanation', () => {
                const explanation = toMarkdown(`
                    First line.

                    Second line
                    Third line
                    Fourth line

                    Fifth line.
                `);

                const markdown = aFlashCard()
                    .with(
                        aSingleChoiceQuestion()
                            .labelled('Some question?')
                            .withOptions('A. Option A', 'B. Option B', 'C. Option C', 'D. Option D')
                            .withAnswer('C')
                            .withExplanation(explanation)
                    )
                    .toMarkdown();

                const parsed = service.parse(markdown);

                expectFlashCard(parsed)
                    .toHaveSingleChoiceQuestions([
                        {
                            label: 'Some question?',
                            options: toOptions('A. Option A', 'B. Option B', 'C. Option C', 'D. Option D'),
                            answer: new Answer(new Option('C. Option C'), explanation)
                        }
                    ])
            })

            it('multiple explanations', () => {
                const explanation1 = toMarkdown(`
                    First line.

                    Second line
                    Third line
                    Fourth line

                    Fifth line.
                `);

                const markdown = aFlashCard()
                    .with(
                        aSingleChoiceQuestion()
                            .labelled('Some question?')
                            .withOptions('A. Option A', 'B. Option B', 'C. Option C', 'D. Option D')
                            .withAnswer('C')
                            .withExplanation(explanation1),
                        aSingleChoiceQuestion()
                            .labelled('Some other question?')
                            .withOptions('A. Option 1', 'B. Option 2', 'C. Option 3', 'D. Option 4')
                            .withAnswer('B')
                            .withExplanation('explanation2')
                    )
                    .toMarkdown();

                const parsed = service.parse(markdown);

                expectFlashCard(parsed)
                    .toHaveSingleChoiceQuestions([
                        {
                            label: 'Some question?',
                            options: toOptions('A. Option A', 'B. Option B', 'C. Option C', 'D. Option D'),
                            answer: new Answer(new Option('C. Option C'), explanation1)
                        },
                        {
                            label: 'Some other question?',
                            options: toOptions('A. Option 1', 'B. Option 2', 'C. Option 3', 'D. Option 4'),
                            answer: new Answer(new Option('B. Option 2'), 'explanation2')
                        }
                    ])
            })
        })

        describe('true/false quiz', () => {
            it('multiline', () => {
                const explanation = toMarkdown(`
                First line.

                Second line
                Third line
                Fourth line

                Fifth line.
            `);

            const markdown = aFlashCard()
                .with(
                    aTrueStatement()
                        .labelled('A true statement')
                        .withMultilineExplanation(explanation)
                )
                .toMarkdown();

            const parsed = service.parse(markdown);

            expectFlashCard(parsed)
                .toHaveBooleanQuestions([
                    {
                        label: 'A true statement',
                        answer: new Answer(true, explanation)
                    }
                ])
            })

            it('inline', () => {
                const markdown = aFlashCard()
                    .with(
                        aTrueStatement()
                            .labelled('A true statement')
                            .withInlineExplanation('explanation')
                    )
                    .toMarkdown();

                const parsed = service.parse(markdown);

                expectFlashCard(parsed)
                    .toHaveBooleanQuestions([
                        {
                            label: 'A true statement',
                            answer: new Answer(true, 'explanation')
                        }
                    ])
            })

            it('multiple explanations', () => {
                const markdown = aFlashCard()
                    .with(
                        aTrueStatement()
                            .labelled('A true statement')
                            .withInlineExplanation('inline explanation'),
                        aFalseStatement()
                            .labelled('A false statement')
                            .withMultilineExplanation('multiline explanation')
                    )
                    .toMarkdown();

                const parsed = service.parse(markdown);

                expectFlashCard(parsed)
                    .toHaveBooleanQuestions([
                        {
                            label: 'A true statement',
                            answer: new Answer(true, 'inline explanation')
                        },
                        {
                            label: 'A false statement',
                            answer: new Answer(false, 'multiline explanation')
                        }
                    ])
            })
        })
    })

});

// helpers

function toOptions(...options: string[]): Option[] {
    return options.map(option => new Option(option));
}

function toMarkdown(markdown: string): string {
    return markdown
        .trim()
        .split('\n')
        .map(line => line.trim())
        .join('\n');
}

function selection(...options: string[]): Answer<Option[]> {
    return new Answer(options.map(option => new Option(option)));
}

// builders

class BooleanQuestionStringBuilder implements Builder<string> {
    private questionText = 'The question text';
    private answer: boolean = false;
    private explanation = '';

    labelled(questionText: string): this {
        this.questionText = questionText;
        return this;
    }
    thatIs(answer: boolean): this {
        this.answer = answer;
        return this;
    }
    withMultilineExplanation(explanation: string): this {
        this.explanation = explanation.trim().length === 0
            ? ''
            : `\n\nExplanation:\n\`\`\`\n${explanation}\n\`\`\``;
        return this;
    }
    build(): string {
        const answer = this.answer
            ? '✅ True'
            : '❌ False'
        return toMarkdown(`
            ---

            ### 🔹 True / False

            **Q1.** ${this.questionText}
            ${answer}${this.explanation}
        `);
    }

    withInlineExplanation(explanation: string): this {
        this.explanation = ` (${explanation})`;
        return this;
    }
}

class MultipleChoiceQuestionStringBuilder implements Builder<string> {
    private questionText = 'The question text';
    private options: string[] = ['A. Option A', 'B. Option B', 'C. Option C', 'D. Option D'];
    private answer: Letter[] = ['A', 'B'];
    private explanation = '';

    labelled(questionText: string): this {
        this.questionText = questionText;
        return this;
    }
    withOptions(...options: string[]): this {
        this.options = options;
        return this;
    }
    withAnswer(answer: Letter[]): this {
        this.answer = answer;
        return this;
    }
    withExplanation(explanation: string): this {
        this.explanation = explanation;
        return this;
    }
    build(): string {
        const options = this.options.join('\n');
        const explanation = this.explanation.trim().length === 0
            ? ''
            : `Explanation:\n\`\`\`\n${this.explanation}\n\`\`\``
        return toMarkdown(`
            ---

            ### 🔹 Multiple Choice

            **Q1.** ${this.questionText}
            ${options}
            ✅ **Answer: ${this.answer.join(', ')}**

            ${explanation}
        `);
    }
}

class SingleChoiceQuestionStringBuilder implements Builder<string> {
    private questionText = 'The question text';
    private options: string[] = ['A. Option A', 'B. Option B', 'C. Option C', 'D. Option D'];
    private answer: Letter = 'A';
    private explanation = '';

    labelled(questionText: string): this {
        this.questionText = questionText;
        return this;
    }
    withOptions(...options: string[]): this {
        this.options = options;
        return this;
    }
    withAnswer(answer: Letter): this {
        this.answer = answer;
        return this;
    }
    withExplanation(explanation: string): this {
        this.explanation = explanation;
        return this;
    }
    build(): string {
        const options = this.options.join('\n');
        const explanation = this.explanation.trim().length === 0
            ? ''
            : `Explanation:\n\`\`\`\n${this.explanation}\n\`\`\``
        return toMarkdown(`
            ---

            ### 🔹 Multiple Choice

            **Q1.** ${this.questionText}
            ${options}
            ✅ **Answer: ${this.answer}**

            ${explanation}
        `);
    }
}

class FlashCardStringBuilder {
    private title = '📊 AWS Audit & Monitoring – Flash Card';

    private content = `
        ## ☁️ Amazon CloudWatch

        ### ✅ Keypoints Summary
        1. **Monitoring & observability** service for AWS resources & applications.
        2. Collects **metrics, logs, and events** for real-time visibility.
        3. Integrates with alarms, dashboards, and automation.
    `;

    private multiChoiceQuiz: string[] = [];

    private additionalInfo = '';

    withTitle(title: string): this {
        this.title = title;
        return this;
    }

    with(...builders: Builder<string>[]): this {
        this.multiChoiceQuiz = buildAll(builders);
        return this;
    }

    withContent(content: string): this {
        this.content = content;
        return this;
    }

    withAdditionalInfo(additionalInfo: string): this {
        this.additionalInfo += `\n---\n\n${additionalInfo}`;
        return this;
    }

    toMarkdown(): string {
        const quiz = this.multiChoiceQuiz.length === 0
            ? ''
            : `\n\n## ❓ Exam Practice Quiz\n${this.multiChoiceQuiz.join('\n\n---\n\n')}`;
        return toMarkdown(`
            # ${this.title}

            ---
            ${this.content}${quiz}
            ${this.additionalInfo}
        `);
    }
}

function aTrueStatement(): BooleanQuestionStringBuilder {
    return aBooleanStatement().thatIs(true);
}
function aFalseStatement(): BooleanQuestionStringBuilder {
    return aBooleanStatement().thatIs(false);
}

function aBooleanStatement(): BooleanQuestionStringBuilder {
    return new BooleanQuestionStringBuilder();
}

function aSingleChoiceQuestion(): SingleChoiceQuestionStringBuilder {
    return new SingleChoiceQuestionStringBuilder();
}

function aMultipleChoiceQuestion(): MultipleChoiceQuestionStringBuilder {
    return new MultipleChoiceQuestionStringBuilder();
}

function aFlashCard(): FlashCardStringBuilder {
    return new FlashCardStringBuilder();
}

interface ExpectedMultipleChoiceQuestion {
   label: string;
   options: Option[];
   answer: Answer<Option[]>;
}

interface ExpectedSingleChoiceQuestion {
    label: string;
    options: Option[];
    answer: Answer<Option>;
}

interface ExpectedBooleanQuestion {
    label: string;
    answer: Answer<boolean>;
}

class FlashCardExpectation {

    constructor(private readonly flashCard: FlashCard) {
    }

    toHaveContent(content: string): this {
        expect(this.flashCard.mainContent).toBe(toMarkdown(content));
        return this;
    }

    toHaveSingleChoiceQuestions(expected: ExpectedSingleChoiceQuestion[]): this {
        expect(this.flashCard.singleChoiceQuestions)
            .toStrictEqual(expected)
        return this;
    }

    toHaveMultipleChoiceQuestions(expected: ExpectedMultipleChoiceQuestion[]): this {
        expect(this.flashCard.multipleChoiceQuestions)
            .toStrictEqual(expected)
        return this;
    }

    toHaveBooleanQuestions(expected: ExpectedBooleanQuestion[]): this {
        expect(this.flashCard.booleanQuestions)
            .toStrictEqual(expected)
        return this;
    }
}

function expectFlashCard(flashCard: FlashCard): FlashCardExpectation {
    return new FlashCardExpectation(flashCard);
}
