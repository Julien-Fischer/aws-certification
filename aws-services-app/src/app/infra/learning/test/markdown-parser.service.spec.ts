import {TestBed} from '@angular/core/testing';
import {describe, it, expect, beforeEach} from 'vitest';

import {Letter, MarkdownParserService} from '../markdown-parser.service';
import {Answer, Option} from "../../../domain/learning/models/question";

const title = toMarkdown(`
    # 📊 AWS Audit & Monitoring – Flash Card

    ---

    `);

const mainContent = toMarkdown(`
    ## ☁️ Amazon CloudWatch

    ### ✅ Keypoints Summary
    1. **Monitoring & observability** service for AWS resources & applications.
    2. Collects **metrics, logs, and events** for real-time visibility.
    3. Integrates with alarms, dashboards, and automation.

    ---

    `);

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
                .with(aMultiChoiceQuestion())
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

                    ---`
                ))
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
            const markdown = title + '\n' + mainContent + '\n' + toMarkdown(`
                ## ❓ Exam Practice Quiz

                ### 🔹 Multiple Choice
                **Q1.** Which service provides **API activity history** for auditing?
                A. CloudWatch
                B. CloudTrail
                C. Config
                D. GuardDuty
                ✅ **Answer: B**
                `);

            const parsed = service.parse(markdown);

            expect(parsed.mainContent).toBe(mainContent);
        });

        it('removes content after quizzes from mainContent', () => {
            const quiz = toMarkdown(`
                ## ❓ Exam Practice Quiz

                ### 🔹 Multiple Choice
                **Q1.** Question?
                A. Yes
                ✅ **Answer: A**
                `);
            const afterQuiz = toMarkdown(`
                ---
                ✅ **Exam Tip**: Some tip.
                `);
            const markdown = title + '\n' + mainContent + '\n' + quiz + '\n' + afterQuiz;

            const parsed = service.parse(markdown);

            expect(parsed.mainContent).toBe(mainContent);
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

            expect(parsed).toStrictEqual({
                mainContent,
                multipleChoiceQuestions: [
                    {
                        question: 'Which service provides **API activity history** for auditing?',
                        options: toOptions('A. CloudWatch', 'B. CloudTrail', 'C. Config', 'D. GuardDuty'),
                        answer: new Answer(new Option('B. CloudTrail'))
                    }
                ],
                trueFalseQuestions: []
            });
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

            expect(parsed).toStrictEqual({
                mainContent,
                multipleChoiceQuestions: [
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
                ],
                trueFalseQuestions: []
            });
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
            const markdown = aFlashCard()
                .with(aBooleanStatement()
                    .labelled('CloudWatch Unified Agent collects both logs and OS-level metrics.')
                    .thatIs(true)
                ).toMarkdown();

            const parsed = service.parse(markdown);

            expect(parsed).toStrictEqual({
                mainContent,
                multipleChoiceQuestions: [],
                trueFalseQuestions: [
                    {
                        question: 'CloudWatch Unified Agent collects both logs and OS-level metrics.',
                        answer: new Answer(true)
                    }
                ]
            });
        });

        it('parses multiple questions', () => {
            const markdown = restOfTheFile() + toMarkdown(`
                ### 🔹 True / False

                **Q4.** CloudWatch Unified Agent collects both logs and OS-level metrics.
                ✅ True

                **Q5.** CloudTrail Insights automatically fixes misconfigurations.
                ❌ False (that’s **Config Remediation**).

                **Q6.** CloudWatch Alarms can trigger Auto Scaling policies.
                ✅ True
            `);

            const parsed = service.parse(markdown);

            expect(parsed).toStrictEqual({
                mainContent,
                multipleChoiceQuestions: [],
                trueFalseQuestions: [
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
                ]
            });
        });

        it('throws error for missing answer', () => {
            const markdown = restOfTheFile() + toMarkdown(`
                ### 🔹 True / False
                **Q4.** CloudWatch Unified Agent collects both logs and OS-level metrics.
                ✅ True
                **Q6.** CloudWatch Alarms can trigger Auto Scaling policies.
            `);

            expect(() => service.parse(markdown))
                .toThrow(/Invalid True\/False question format \(missing answer\):/);
        });

    })

    describe('explanation', () => {
        it('parses explanation if present', () => {
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

            expect(parsed).toStrictEqual({
                mainContent,
                multipleChoiceQuestions: [
                    {
                        question: 'Which solution can comply with the requirement?',
                        options: toOptions('A. Option A', 'B. Option B', 'C. Option C', 'D. Option D'),
                        answer: new Answer(new Option('C. Option C'), explanation)
                    }
                ],
                trueFalseQuestions: []
            })
        })
    })

});

// helpers

function restOfTheFile(): string {
    return mainContent + `## ❓ Exam Practice Quiz
`
}

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
    withExplanation(explanation: string): this {
        this.explanation = explanation;
        return this;
    }
    build(): string {
        const explanation = this.explanation.trim().length === 0
            ? ''
            : `Explanation:\n\`\`\`\n${this.explanation}\n\`\`\``;
        const answer = this.answer
            ? '✅ True'
            : '❌ False'
        return toMarkdown(`
            ---

            ### 🔹 True / False

            **Q1.** ${this.questionText}
            ${answer}

            ${explanation}
        `);
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

    toMarkdown(): string {
        const quiz = this.multiChoiceQuiz.length === 0
            ? ''
            : `\n---\n## ❓ Exam Practice Quiz\n${this.multiChoiceQuiz.join('\n\n---\n\n')}`;
        return toMarkdown(`
            # ${this.title}

            ---
            ${this.content}${quiz}
        `);
    }
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
