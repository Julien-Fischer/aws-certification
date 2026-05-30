import {Injectable} from '@angular/core';
import {Answer, MultipleChoiceQuestion, Option, BooleanQuestion} from "../../domain/search/models/question";
import {FlashCard} from "../../domain/search/models/flash-card";

export type Letter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
export const LETTERS: Letter[] = ['A', 'B', 'C', 'D', 'E', 'F'];

@Injectable({
    providedIn: 'root',
})
export class MarkdownParserService {

    private multipleChoiceQuestionsParser = new MultipleChoiceQuestionParser()
    private booleanQuestionsParser = new BooleanQuestionParser();

    parse(content: string): FlashCard {
        const quizSection = this.extractQuizSection(content);
        const mainContent = this.extractMainContent(content, quizSection);

        if (!quizSection) {
            return {mainContent, multipleChoiceQuestions: [], booleanQuestions: []};
        }

        const {multipleChoiceQuestions, booleanQuestions} = this.parseAllQuizzesFrom(quizSection);

        if (this.hasNoQuizzes(multipleChoiceQuestions, booleanQuestions)) {
            throw new Error('No valid questions found in this quiz');
        }

        return {mainContent, multipleChoiceQuestions, booleanQuestions};
    }

    private extractQuizSection(content: string): string | null {
        const quizHeader = /## *.+ *Exam Practice Quiz/i;
        const quizIndex = content.search(quizHeader);
        return quizIndex === -1 ? null : content.substring(quizIndex);
    }

    private extractMainContent(content: string, quizSection: string | null): string {
        const removeTitle = (text: string): string => {
            return text
                .replace(/^# .*\n/, '')
                .replace(/^\n*---\n*/, '')
                .trim();
        };

        if (quizSection) {
            const quizIndex = content.indexOf(quizSection);
            return removeTitle(content.substring(0, quizIndex));
        }

        return removeTitle(content);
    }

    private parseAllQuizzesFrom(quizContent: string): {
        multipleChoiceQuestions: MultipleChoiceQuestion[];
        booleanQuestions: BooleanQuestion[];
    } {
        const {multipleChoiceContent, booleanContent} = this.splitQuizIntoMcAndTf(quizContent);

        const multipleChoiceQuestions = this.multipleChoiceQuestionsParser.parse(multipleChoiceContent);
        const booleanQuestions = this.booleanQuestionsParser.parse(booleanContent);

        return {multipleChoiceQuestions, booleanQuestions};
    }

    private splitQuizIntoMcAndTf(quizContent: string): {
        multipleChoiceContent: string;
        booleanContent: string;
    } {
        const booleanQuizHeader = /### 🔹 True \/ False/i;
        const match = quizContent.match(booleanQuizHeader);

        if (!match || match.index === undefined) {
            return {
                multipleChoiceContent: quizContent,
                booleanContent: '',
            };
        }

        const tfIndex = match.index;
        return {
            multipleChoiceContent: quizContent.substring(0, tfIndex),
            booleanContent: quizContent.substring(tfIndex),
        };
    }

    private hasNoQuizzes(
        multipleChoiceQuestions: MultipleChoiceQuestion[],
        booleanQuestions: BooleanQuestion[]
    ): boolean {
        return (
            multipleChoiceQuestions.length === 0 &&
            booleanQuestions.length === 0
        );
    }
}


class BooleanQuestionParser {

    parse(booleanContent: string): BooleanQuestion[] {
        if (!booleanContent.trim()) return [];

        const rawQuestions = this.splitBooleanQuestionsBlocks(booleanContent);
        return rawQuestions.map((q) => this.parseBooleanBlock(q));
    }

    private splitBooleanQuestionsBlocks(booleanContent: string): string[] {
        return booleanContent.split(/\*\*Q\d+\.\*\*/).slice(1);
    }

    private parseBooleanBlock(block: string): BooleanQuestion {
        const allLines = block.split('\n').map(l => l.trim());
        const lines = allLines.filter(line => line !== '');
        const questionLine = lines[0];
        const answerLine = lines[1];

        if (!questionLine || !answerLine) {
            throw new Error(`Invalid True/False question format (missing answer): ${block}`);
        }

        const questionText = extractQuestionText(questionLine);

        const answerLineIndex = allLines.indexOf(answerLine);
        const explanation = findExplanation(allLines, answerLineIndex);

        const answer = this.parseBooleanAnswerLine(answerLine, explanation);

        return {question: questionText, answer};
    }

    private parseBooleanAnswerLine(line: string, explanation?: string): Answer<boolean> {
        let value: boolean;
        if (line.includes('True')) {
            value = true;
        } else if (line.includes('False')) {
            value = false;
        } else {
            throw new Error(`Invalid True/False answer format: ${line}`);
        }

        if (!explanation) {
            const inlineMatch = line.match(/\((.+)\)/);
            if (inlineMatch) {
                explanation = inlineMatch[1].trim();
            }
        }

        return new Answer(value, explanation);
    }

}


class MultipleChoiceQuestionParser {

    parse(mcContent: string): MultipleChoiceQuestion[] {
        if (!mcContent.trim()) return [];

        const rawQuestions = this.splitMultipleChoiceBlocks(mcContent);
        return rawQuestions.map((q) => this.parseMultipleChoiceBlock(q));
    }

    private splitMultipleChoiceBlocks(mcContent: string): string[] {
        return mcContent.split(/\*\*Q\d+\.\*\*/).slice(1);
    }

    private parseMultipleChoiceBlock(block: string): MultipleChoiceQuestion {
        const questionLine = block.split('\n').map(l => l.trim()).find(Boolean) || '';
        const questionText = extractQuestionText(questionLine);

        const {options, answer} = this.parseMultipleChoiceAnswerLines(block);

        if (!questionText || options.length === 0) {
            throw new Error(`Invalid Multiple Choice question format (missing options): ${block}`);
        }

        if (!answer) {
            throw new Error(`Invalid Multiple Choice question format (missing answer): ${block}`);
        }

        return {question: questionText, options, answer};
    }

    private parseMultipleChoiceAnswerLines(block: string): { options: Option[], answer: Answer<Option> | null } {
        const lines = block.split('\n').map(l => l.trim());
        const options: Option[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (this.isOptionLine(line)) {
                options.push(new Option(line));
            } else if (line.includes('✅ **Answer:')) {
                const letter = this.findLetter(line);
                const answerOption = this.findAnswer(letter, options);

                const explanation = findExplanation(lines, i);
                return {options, answer: new Answer(answerOption, explanation)};
            }
        }

        return {options, answer: null};
    }

    private findLetter(line: string) {
        const match = line.match(/Answer:\s*([A-F])/);
        if (!match) {
            throw new Error(`Invalid Multiple Choice answer format: ${line}`);
        }
        return toLetter(match[1]);
    }

    private findAnswer(letter: Letter, options: Option[]): Option {
        const answerOption = options.find(option => option.hasPrefix(letter));
        if (!answerOption) {
            throw new Error(`Answer letter "${letter}" does not match any option`);
        }
        return answerOption;
    }

    private isOptionLine(line: string): boolean {
        return LETTERS.some((prefix) => line.startsWith(`${prefix}.`));
    }

}


function toLetter(character: string): Letter {
    for (const letter of LETTERS) {
        if (character === letter) {
            return letter;
        }
    }
    throw new Error(`Invalid letter: ${character}`);
}

function extractQuestionText(line: string): string {
    return line.replace(/^[ \t]*\d+\.[ \t]*/, '').trim();
}

function findExplanation(lines: string[], i: number): string | undefined {
    let explanation: string | undefined;
    const remainingContent = lines.slice(i + 1).join('\n').trim();
    if (remainingContent.startsWith('Explanation:')) {
        const explanationMatch = remainingContent.match(/Explanation:\s*\n*```\n?([\s\S]*?)\n?```/);
        if (explanationMatch) {
            explanation = explanationMatch[1].trim();
        }
    }
    return explanation;
}
