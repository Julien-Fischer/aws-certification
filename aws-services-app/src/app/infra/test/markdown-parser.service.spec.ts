import {TestBed} from '@angular/core/testing';
import {describe, it, expect, beforeEach} from 'vitest';

import {MarkdownParserService} from '../markdown-parser.service';
import {Answer, Option} from "../../domain/learning/models/quiz";

const mainContent = `
# 📊 AWS Audit & Monitoring – Revision Card

---

## ☁️ Amazon CloudWatch

### ✅ Keypoints Summary
1. **Monitoring & observability** service for AWS resources & applications.  
2. Collects **metrics, logs, and events** for real-time visibility.  
3. Integrates with alarms, dashboards, and automation.  

---`.trim();

describe('MarkdownParserService', () => {

    let service: MarkdownParserService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MarkdownParserService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('multiple choice questions', () => {
        it('parses one question', () => {
            const markdown = mainContent + `## ❓ Exam Practice Quiz

### 🔹 Multiple Choice
**Q1.** Which service provides **API activity history** for auditing?  
A. CloudWatch  
B. CloudTrail  
C. Config  
D. GuardDuty  
✅ **Answer: B**
`;

            const parsed = service.parse(markdown);

            expect(parsed).toStrictEqual({
                mainContent,
                multipleChoiceQuizzes: [
                    {
                        question: 'Which service provides **API activity history** for auditing?',
                        options: toOptions('A. CloudWatch', 'B. CloudTrail', 'C. Config', 'D. GuardDuty'),
                        answer: new Answer(new Option('B. CloudTrail'))
                    }
                ],
                trueFalseQuizzes: []
            });
        });

        it('parses multiple questions', () => {
            const markdown = mainContent + `## ❓ Exam Practice Quiz

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
`;

            const parsed = service.parse(markdown);

            expect(parsed).toStrictEqual({
                mainContent,
                multipleChoiceQuizzes: [
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
                trueFalseQuizzes: []
            });
        });

        it('throws error for missing answer', () => {
            const questionWithMissingAnswer = `## ❓ Exam Practice Quiz

### 🔹 Multiple Choice
**Q1.** What is the capital of France?
A. Paris
B. London
C. Berlin
D. Madrid`;

            expect(() => service.parse(questionWithMissingAnswer))
                .toThrow(/Invalid Multiple Choice question format \(missing answer\)/);
        })

        it('throws error for missing options', () => {
            const questionWithMisingQuestionText = `## ❓ Exam Practice Quiz

### 🔹 Multiple Choice
A. Paris
B. London
C. Berlin
D. Madrid
✅ **Answer: B**`;

            expect(() => service.parse(questionWithMisingQuestionText))
                .toThrow('No valid questions found in this quiz');
        })

        it('throws error for missing question text', () => {
            const questionWithMissingOptions = `## ❓ Exam Practice Quiz

### 🔹 Multiple Choice
**Q1.** What is the capital of France?`;

            expect(() => service.parse(questionWithMissingOptions))
                .toThrow(/Invalid Multiple Choice question format \(missing options\)/);
        })

    });

    describe('true/false questions', () => {

        it('parses one question', () => {
            const markdown = restOfTheFile() + ` ### 🔹 True / False
**Q4.** CloudWatch Unified Agent collects both logs and OS-level metrics.  
✅ True  
`;

            const parsed = service.parse(markdown);

            expect(parsed).toStrictEqual({
                mainContent,
                multipleChoiceQuizzes: [],
                trueFalseQuizzes: [
                    {
                        question: 'CloudWatch Unified Agent collects both logs and OS-level metrics.',
                        answer: new Answer(true)
                    }
                ]
            });
        });

        it('parses multiple questions', () => {
            const markdown = restOfTheFile() + ` ### 🔹 True / False

**Q4.** CloudWatch Unified Agent collects both logs and OS-level metrics.  
✅ True  

**Q5.** CloudTrail Insights automatically fixes misconfigurations.  
❌ False (that’s **Config Remediation**).  

**Q6.** CloudWatch Alarms can trigger Auto Scaling policies.  
✅ True  
`;

            const parsed = service.parse(markdown);

            expect(parsed).toStrictEqual({
                mainContent,
                multipleChoiceQuizzes: [],
                trueFalseQuizzes: [
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
            const markdown = restOfTheFile() + ` ### 🔹 True / False
**Q4.** CloudWatch Unified Agent collects both logs and OS-level metrics.  
✅ True  
**Q6.** CloudWatch Alarms can trigger Auto Scaling policies.  
`;

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