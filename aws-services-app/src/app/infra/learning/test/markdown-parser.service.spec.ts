import {TestBed} from '@angular/core/testing';
import {describe, it, expect, beforeEach} from 'vitest';

import {MarkdownParserService} from '../markdown-parser.service';
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

    describe('title', () => {
        it('removes title if present', () => {
            const markdown = toMarkdown(`
                # 📊 AWS Audit & Monitoring – Flash Card
                
                ---
                
                ## ☁️ Amazon CloudWatch
                
                ### ✅ Keypoints Summary
                1. **Monitoring & observability** service for AWS resources & applications.  
                2. Collects **metrics, logs, and events** for real-time visibility.  
                3. Integrates with alarms, dashboards, and automation.  
                
                ---`);

            const parsed = service.parse(markdown);

            expect(parsed.mainContent)
                .not.toContain('# 📊 AWS Audit & Monitoring – Flash Card')
            expect(parsed.mainContent)
                .toBe(toMarkdown(`
                ## ☁️ Amazon CloudWatch
                
                ### ✅ Keypoints Summary
                1. **Monitoring & observability** service for AWS resources & applications.  
                2. Collects **metrics, logs, and events** for real-time visibility.  
                3. Integrates with alarms, dashboards, and automation. 
                 
                ---`))
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
            const markdown = title + '\n' + mainContent + toMarkdown(`
                ## ❓ Exam Practice Quiz

                ### 🔹 Multiple Choice
                **Q1.** Which service provides **API activity history** for auditing?  
                A. CloudWatch  
                B. CloudTrail  
                C. Config  
                D. GuardDuty  
                ✅ **Answer: B**
                
                ---
                
                **Q2.** Which CloudWatch feature allows analyzing logs with SQL-like queries?  
                A. Contributor Insights  
                B. Logs Insights  
                C. Metrics Explorer  
                D. Unified Agent  
                ✅ **Answer: B**
            `);

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

    });

    describe('true/false questions', () => {

        it('parses one question', () => {
            const markdown = restOfTheFile() + toMarkdown(` 
                ### 🔹 True / False
                **Q4.** CloudWatch Unified Agent collects both logs and OS-level metrics.  
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

});

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