import {TestBed} from '@angular/core/testing';
import {describe, it, expect, beforeEach} from 'vitest';

import {Letter, MarkdownParserService} from '../markdown-parser.service';
import {Answer, Option} from "../../../domain/learning/models/question";
import {FlashCard} from "../../../domain/learning/models/flash-card";

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
                .with(aMultiChoiceQuestion())
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
                    aMultiChoiceQuestion()
                        .labelled('Which service provides **API activity history** for auditing?')
                        .withOptions('A. CloudWatch', 'B. CloudTrail', 'C. Config', 'D. GuardDuty')
                        .withAnswer('B'),
                )
                .toMarkdown();

            const parsed = service.parse(markdown);

            expectFlashCard(parsed)
                .toHaveMultipleChoiceQuestions([
                    {
                        question: 'Which service provides **API activity history** for auditing?',
                        options: toOptions('A. CloudWatch', 'B. CloudTrail', 'C. Config', 'D. GuardDuty'),
                        answer: new Answer(new Option('B. CloudTrail'))
                    }
                ])
        });

        it('parses multiple questions', () => {
            const markdown = aFlashCard()
                .with(
                    aMultiChoiceQuestion()
                        .labelled('Which service provides **API activity history** for auditing?')
                        .withOptions('A. CloudWatch', 'B. CloudTrail', 'C. Config', 'D. GuardDuty')
                        .withAnswer('B'),
                    aMultiChoiceQuestion()
                        .labelled('Which CloudWatch feature allows analyzing logs with SQL-like queries?')
                        .withOptions('A. Contributor Insights', 'B. Logs Insights', 'C. Metrics Explorer', 'D. Unified Agent')
                        .withAnswer('B')
                )
                .toMarkdown();

            const parsed = service.parse(markdown);

            expectFlashCard(parsed)
                .toHaveMultipleChoiceQuestions([
                    {
                        question: 'Which service provides **API activity history** for auditing?',
                        options: toOptions('A. CloudWatch', 'B. CloudTrail', 'C. Config', 'D. GuardDuty'),
                        answer: new Answer(new Option('B. CloudTrail'))
                    },
                    {
                        question: 'Which CloudWatch feature allows analyzing logs with SQL-like queries?',
                        options: toOptions('A. Contributor Insights', 'B. Logs Insights', 'C. Metrics Explorer', 'D. Unified Agent'),
                        answer: new Answer(new Option('B. Logs Insights'))
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
                aTrueStatement().labelled('CloudWatch Unified Agent collects both logs and OS-level metrics.')
            ).toMarkdown();

            const parsed = service.parse(markdown);

            expectFlashCard(parsed)
                .toHaveTrueFalseQuestions([
                    {
                        question: 'CloudWatch Unified Agent collects both logs and OS-level metrics.',
                        answer: new Answer(true)
                    }
                ])
        });

        it('parses multiple questions', () => {
            const markdown = aFlashCard().with(
                aTrueStatement().labelled('CloudWatch Unified Agent collects both logs and OS-level metrics.'),
                aFalseStatement().labelled('CloudTrail Insights automatically fixes misconfigurations.'),
                aTrueStatement().labelled('CloudWatch Alarms can trigger Auto Scaling policies.'),
            ).toMarkdown();

            const parsed = service.parse(markdown);

            expectFlashCard(parsed)
                .toHaveTrueFalseQuestions([
                    {
                        question: 'CloudWatch Unified Agent collects both logs and OS-level metrics.',
                        answer: new Answer(true)
                    },
                    {
                        question: 'CloudTrail Insights automatically fixes misconfigurations.',
                        answer: new Answer(false)
                    },
                    {
                        question: 'CloudWatch Alarms can trigger Auto Scaling policies.',
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
                        aMultiChoiceQuestion()
                            .labelled('Which solution can comply with the requirement?')
                            .withOptions('A. Option A', 'B. Option B', 'C. Option C', 'D. Option D')
                            .withAnswer('C')
                            .withExplanation(explanation)
                    )
                    .toMarkdown();

                const parsed = service.parse(markdown);

                expectFlashCard(parsed)
                    .toHaveMultipleChoiceQuestions([
                        {
                            question: 'Which solution can comply with the requirement?',
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
                        aMultiChoiceQuestion()
                            .labelled('Which solution can comply with the requirement?')
                            .withOptions('A. Option A', 'B. Option B', 'C. Option C', 'D. Option D')
                            .withAnswer('C')
                            .withExplanation(explanation1),
                        aMultiChoiceQuestion()
                            .labelled('Which CloudWatch feature allows analyzing logs with SQL-like queries?')
                            .withOptions('A. Contributor Insights', 'B. Logs Insights', 'C. Metrics Explorer', 'D. Unified Agent')
                            .withAnswer('B')
                            .withExplanation('explanation2')
                    )
                    .toMarkdown();

                const parsed = service.parse(markdown);

                expectFlashCard(parsed)
                    .toHaveMultipleChoiceQuestions([
                        {
                            question: 'Which solution can comply with the requirement?',
                            options: toOptions('A. Option A', 'B. Option B', 'C. Option C', 'D. Option D'),
                            answer: new Answer(new Option('C. Option C'), explanation1)
                        },
                        {
                            question: 'Which CloudWatch feature allows analyzing logs with SQL-like queries?',
                            options: toOptions('A. Contributor Insights', 'B. Logs Insights', 'C. Metrics Explorer', 'D. Unified Agent'),
                            answer: new Answer(new Option('B. Logs Insights'), 'explanation2')
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
                        .labelled('Alias records are free, while CNAME queries are billed.')
                        .withMultilineExplanation(explanation)
                )
                .toMarkdown();

            const parsed = service.parse(markdown);

            expectFlashCard(parsed)
                .toHaveTrueFalseQuestions([
                    {
                        question: 'Alias records are free, while CNAME queries are billed.',
                        answer: new Answer(true, explanation)
                    }
                ])
            })

            it('inline', () => {
                const markdown = aFlashCard()
                    .with(
                        aTrueStatement()
                            .labelled('Alias records are free, while CNAME queries are billed.')
                            .withInlineExplanation('explanation')
                    )
                    .toMarkdown();

                const parsed = service.parse(markdown);

                expectFlashCard(parsed)
                    .toHaveTrueFalseQuestions([
                        {
                            question: 'Alias records are free, while CNAME queries are billed.',
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
                    .toHaveTrueFalseQuestions([
                        {
                            question: 'A true statement',
                            answer: new Answer(true, 'inline explanation')
                        },
                        {
                            question: 'A false statement',
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

// builders

interface QuestionStringBuilder {
    build(): string;
}

class TrueFalseQuestionStringBuilder implements QuestionStringBuilder {
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

class MultiChoiceQuestionStringBuilder implements QuestionStringBuilder {
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

    with(...multiChoiceQuiz: QuestionStringBuilder[]): this {
        this.multiChoiceQuiz = multiChoiceQuiz.map(quiz => quiz.build());
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

function aTrueStatement(): TrueFalseQuestionStringBuilder {
    return aBooleanStatement().thatIs(true);
}
function aFalseStatement(): TrueFalseQuestionStringBuilder {
    return aBooleanStatement().thatIs(false);
}

function aBooleanStatement(): TrueFalseQuestionStringBuilder {
    return new TrueFalseQuestionStringBuilder();
}

function aMultiChoiceQuestion(): MultiChoiceQuestionStringBuilder {
    return new MultiChoiceQuestionStringBuilder();
}

function aFlashCard(): FlashCardStringBuilder {
    return new FlashCardStringBuilder();
}

interface ExpectedMultipleChoiceQuestion {
    question: string;
    options: Option[];
    answer: Answer<Option>;
}

interface ExpectedTrueFalseQuestion {
    question: string;
    answer: Answer<boolean>;
}

class FlashCardExpectation {

    constructor(private readonly flashCard: FlashCard) {
    }

    toHaveContent(content: string): this {
        expect(this.flashCard.mainContent).toBe(toMarkdown(content));
        return this;
    }

    toHaveMultipleChoiceQuestions(expected: ExpectedMultipleChoiceQuestion[]): this {
        expect(this.flashCard.multipleChoiceQuestions)
            .toStrictEqual(expected)
        return this;
    }

    toHaveTrueFalseQuestions(expected: ExpectedTrueFalseQuestion[]): this {
        expect(this.flashCard.trueFalseQuestions)
            .toStrictEqual(expected)
        return this;
    }
}

function expectFlashCard(flashCard: FlashCard): FlashCardExpectation {
    return new FlashCardExpectation(flashCard);
}
