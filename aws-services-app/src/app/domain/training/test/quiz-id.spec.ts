import { describe, it, expect } from "vitest";
import {QuizId} from "../quiz-id";

describe("QuizId", () => {

    describe("constructor", () => {
        it("rejects nullish values", () => {
            expect(() => new QuizId(null as any)).toThrow(
                "Invalid QuizId: 'null'"
            );
            expect(() => new QuizId(undefined as any)).toThrow(
                "Invalid QuizId: 'undefined'"
            );
        });

        it.for(['', ' ', '  ', '\t', '\n', '\r\n', '\r'])
        ("throws when value is blank", (blankString) => {
            expect(() => new QuizId(blankString))
                .toThrow(/Invalid QuizId: '\W*'/);
        });

        it("accepts non‑empty strings", () => {
            const id = new QuizId("non-empty-string");

            expect(id.value).toBe("non-empty-string");
        });
    });

    describe("random", () => {
      const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

      it('generates a quiz id', () => {
        const id = QuizId.random();

        expect(id.value).toMatch(UUID_PATTERN);
      })
    })

    describe("hasValue", () => {
        it("returns true for the same value", () => {
            const id = new QuizId("id-1");

            expect(id.hasValue("id-1")).toBe(true);
        });

        it("returns false for a different value", () => {
            const id = new QuizId("id-1");

            expect(id.hasValue("id-2")).toBe(false);
        });
    });

    describe("toString", () => {
        it("returns the value as string", () => {
            const id = new QuizId("id-1");

            expect(id.toString()).toBe("id-1");
        });
    });
});
