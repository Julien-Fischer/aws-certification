import { describe, it, expect } from 'vitest';
import { Answer, Option } from "../quiz";

describe('Answer', () => {
    it('constructs with string value', () => {
        const answer = new Answer('hello');

        expect(answer.value).toBe('hello');
    });

    it('constructs with string value', () => {
        const trueAnswer = new Answer(true);
        const falseAnswer = new Answer(false);

        expect(trueAnswer.value).toBe(true);
        expect(falseAnswer.value).toBe(false);
    });

    it('constructs with Option', () => {
        const value = new Option('A. Answer');
        const answer = new Answer(value);

        expect(answer.value).toBe(value);
    });


    it('returns stringified value for string input', () => {
        const answer = new Answer('hello');

        expect(answer.toString()).toBe('hello');
    });

    it('returns stringified value for Optoin input', () => {
        const answer = new Answer(new Option('A. Answer'));

        expect(answer.toString()).toBe('A. Answer');
    });

});