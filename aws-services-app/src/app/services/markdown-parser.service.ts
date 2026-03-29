import { Injectable } from '@angular/core';
import {Answer, MultipleChoiceQuiz, Option, TrueFalseQuiz} from '../models/aws-service.model';

type Page = {
  mainContent: string;
  multipleChoiceQuizzes: MultipleChoiceQuiz[];
  trueFalseQuizzes: TrueFalseQuiz[];
};

@Injectable({
  providedIn: 'root',
})
export class MarkdownParserService {

  private multipleChoiceParser = new MultipleChoiceParser()
  private trueFalseParser = new TrueFalseParser();

  parse(content: string): Page {
    const quizSection = this.extractQuizSection(content);
    const mainContent = this.extractMainContent(content, quizSection);

    if (!quizSection) {
      return { mainContent, multipleChoiceQuizzes: [], trueFalseQuizzes: [] };
    }

    const { multipleChoiceQuizzes, trueFalseQuizzes } = this.parseAllQuizzesFrom(quizSection);

    if (this.hasNoQuizzes(multipleChoiceQuizzes, trueFalseQuizzes)) {
      throw new Error('No valid questions found in this quiz');
    }

    return { mainContent, multipleChoiceQuizzes, trueFalseQuizzes };
  }

  private extractQuizSection(content: string): string | null {
    const quizHeader = /## *.+ *Exam Practice Quiz/;
    const quizIndex = content.search(quizHeader);
    return quizIndex === -1 ? null : content.substring(quizIndex);
  }

  private extractMainContent(content: string, quizSection: string | null): string {
    if (!quizSection) return content;
    return content.substring(0, content.indexOf(quizSection));
  }

  private parseAllQuizzesFrom(quizContent: string): {
    multipleChoiceQuizzes: MultipleChoiceQuiz[];
    trueFalseQuizzes: TrueFalseQuiz[];
  } {
    const { multipleChoiceContent, trueFalseContent } = this.splitQuizIntoMcAndTf(quizContent);

    const multipleChoiceQuizzes = this.multipleChoiceParser.parse(multipleChoiceContent);
    const trueFalseQuizzes = this.trueFalseParser.parse(trueFalseContent);

    return { multipleChoiceQuizzes, trueFalseQuizzes };
  }

  private splitQuizIntoMcAndTf(quizContent: string): {
    multipleChoiceContent: string;
    trueFalseContent: string;
  } {
    const trueFalseHeader = '### 🔹 True / False';
    const tfIndex = quizContent.indexOf(trueFalseHeader);

    if (tfIndex === -1) {
      return {
        multipleChoiceContent: quizContent,
        trueFalseContent: '',
      };
    }

    return {
      multipleChoiceContent: quizContent.substring(0, tfIndex),
      trueFalseContent: quizContent.substring(tfIndex),
    };
  }

  private hasNoQuizzes(
      mcQuizzes: MultipleChoiceQuiz[],
      tfQuizzes: TrueFalseQuiz[]
  ): boolean {
    return mcQuizzes.length === 0 && tfQuizzes.length === 0;
  }
}


class TrueFalseParser {

  parse(tfContent: string): TrueFalseQuiz[] {
    if (!tfContent.trim()) return [];

    const rawQuestions = this.splitTrueFalseBlocks(tfContent);
    return rawQuestions.map((q) => this.parseTrueFalseBlock(q));
  }

  private splitTrueFalseBlocks(tfContent: string): string[] {
    return tfContent.split(/\*\*Q\d+\.\*\*/).slice(1);
  }

  private parseTrueFalseBlock(block: string): TrueFalseQuiz {
    const lines = trimLines(block);
    const questionLine = lines[0];
    const answerLine = lines[1];

    if (!questionLine || !answerLine) {
      throw new Error(`Invalid True/False question format (missing answer): ${block}`);
    }

    const questionText = extractQuestionText(questionLine);
    const answer = this.parseTrueFalseAnswerLine(answerLine);

    return { question: questionText, answer };
  }

  private parseTrueFalseAnswerLine(line: string): Answer<boolean> {
    if (line.includes('True')) return new Answer(true);
    if (line.includes('False')) return new Answer(false);
    throw new Error(`Invalid True/False answer format: ${line}`);
  }

}


class MultipleChoiceParser {

  parse(mcContent: string): MultipleChoiceQuiz[] {
    if (!mcContent.trim()) return [];

    const rawQuestions = this.splitMultipleChoiceBlocks(mcContent);
    return rawQuestions.map((q) => this.parseMultipleChoiceBlock(q));
  }

  private splitMultipleChoiceBlocks(mcContent: string): string[] {
    return mcContent.split(/\*\*Q\d+\.\*\*/).slice(1);
  }

  private parseMultipleChoiceBlock(block: string): MultipleChoiceQuiz {
    const lines = trimLines(block);
    const questionLine = lines[0];
    const optionLines = lines.slice(1);

    if (!questionLine || optionLines.length === 0) {
      throw new Error(`Invalid Multiple Choice question format (missing options): ${block}`);
    }

    const questionText = extractQuestionText(questionLine);
    const {options, answer} = this.parseMultipleChoiceAnswerLines(optionLines);

    if (!questionText || options.length === 0 || !answer) {
      throw new Error(`Invalid Multiple Choice question format (missing answer): ${block}`);
    }

    return { question: questionText, options, answer };
  }

  private parseMultipleChoiceAnswerLines(lines: string[]): {options: Option[], answer: Answer<Option> | null} {
    const options: Option[] = [];
    for (const line of lines) {
      if (this.isOptionLine(line)) {
        options.push(new Option(line.trim()));
      } else if (line.includes('✅ **Answer:')) {
        const match = line.match(/Answer:\s*([A-D])/);
        if (!match) {
          throw new Error(`Invalid Multiple Choice answer format: ${line}`);
        }

        const letter = match[1];
        const matchingOption = options.find((o) => o.hasPrefix(letter));
        if (!matchingOption) {
          throw new Error(`Answer letter "${letter}" does not match any option`);
        }

        return {options, answer: new Answer(matchingOption)};
      }
    }

    return {options, answer: null};
  }

  private isOptionLine(line: string): boolean {
    return ['A.', 'B.', 'C.', 'D.'].some((prefix) => line.startsWith(prefix));
  }

}


function trimLines(text: string): string[] {
  return text
      .trim()
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
}

function extractQuestionText(line: string): string {
  return line.replace(/^[ \t]*\d+\.[ \t]*/, '').trim();
}
