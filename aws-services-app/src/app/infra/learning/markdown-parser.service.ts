import {Injectable} from '@angular/core';
import {Answer, MultipleChoiceQuestion, Option, TrueFalseQuestion} from "../../domain/search/models/question";
import {FlashCard} from "../../domain/search/models/flash-card";

export type Letter = 'A' | 'B' | 'C' | 'D';
const LETTERS: Letter[] = ['A', 'B', 'C', 'D'];

@Injectable({
    providedIn: 'root',
})
export class MarkdownParserService {

    private multipleChoiceParser = new MultipleChoiceParser()
    private trueFalseParser = new TrueFalseParser();

    parse(content: string): FlashCard {
        const quizSection = this.extractQuizSection(content);
        const mainContent = this.extractMainContent(content, quizSection);

        if (!quizSection) {
            return {mainContent, multipleChoiceQuestions: [], trueFalseQuestions: []};
        }

        const {multipleChoiceQuestions, trueFalseQuestions} = this.parseAllQuizzesFrom(quizSection);

        if (this.hasNoQuizzes(multipleChoiceQuestions, trueFalseQuestions)) {
            throw new Error('No valid questions found in this quiz');
        }

        return {mainContent, multipleChoiceQuestions, trueFalseQuestions};
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
        trueFalseQuestions: TrueFalseQuestion[];
    } {
        const {multipleChoiceContent, trueFalseContent} = this.splitQuizIntoMcAndTf(quizContent);

        const multipleChoiceQuestions = this.multipleChoiceParser.parse(multipleChoiceContent);
        const trueFalseQuestions = this.trueFalseParser.parse(trueFalseContent);

        return {multipleChoiceQuestions, trueFalseQuestions};
    }

    private splitQuizIntoMcAndTf(quizContent: string): {
        multipleChoiceContent: string;
        trueFalseContent: string;
    } {
        const trueFalseHeader = /### 🔹 True \/ False/i;
        const match = quizContent.match(trueFalseHeader);

        if (!match || match.index === undefined) {
            return {
                multipleChoiceContent: quizContent,
                trueFalseContent: '',
            };
        }

        const tfIndex = match.index;
        return {
            multipleChoiceContent: quizContent.substring(0, tfIndex),
            trueFalseContent: quizContent.substring(tfIndex),
        };
    }

    private hasNoQuizzes(
        multipleChoiceQuestions: MultipleChoiceQuestion[],
        trueFalseQuestions: TrueFalseQuestion[]
    ): boolean {
        return (
            multipleChoiceQuestions.length === 0 &&
            trueFalseQuestions.length === 0
        );
    }
}


class TrueFalseParser {

    parse(tfContent: string): TrueFalseQuestion[] {
        if (!tfContent.trim()) return [];

        const rawQuestions = this.splitTrueFalseBlocks(tfContent);
        return rawQuestions.map((q) => this.parseTrueFalseBlock(q));
    }

    private splitTrueFalseBlocks(tfContent: string): string[] {
        return tfContent.split(/\*\*Q\d+\.\*\*/).slice(1);
    }

    private parseTrueFalseBlock(block: string): TrueFalseQuestion {
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

        const answer = this.parseTrueFalseAnswerLine(answerLine, explanation);

        return {question: questionText, answer};
    }

    private parseTrueFalseAnswerLine(line: string, explanation?: string): Answer<boolean> {
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


class MultipleChoiceParser {

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
        const match = line.match(/Answer:\s*([A-D])/);
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

function trimLines(multiLineString: string): string[] {
    return multiLineString
        .trim()
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '');
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
