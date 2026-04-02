import { describe, it, expect } from "vitest";
import {FlashCardId} from "./flash-card-id";

describe("FlashCardId", () => {

    describe("constructor", () => {
        it("rejects nullish values", () => {
            expect(() => new FlashCardId(null as any)).toThrow(
                "Invalid FlashCardId: 'null'"
            );
            expect(() => new FlashCardId(undefined as any)).toThrow(
                "Invalid FlashCardId: 'undefined'"
            );
        });

        it.for(['', ' ', '  ', '\t', '\n', '\r\n', '\r'])
        ("throws when value is blank", (blankString) => {
            expect(() => new FlashCardId(blankString))
                .toThrow(/Invalid FlashCardId: '\W*'/);
        });

        it("accepts non‑empty strings", () => {
            const id = new FlashCardId("non-empty-string");

            expect(id.value).toBe("non-empty-string");
        });
    });

    describe("hasValue", () => {
        it("returns true for the same value", () => {
            const id = new FlashCardId("card-1");

            expect(id.hasValue("card-1")).toBe(true);
        });

        it("returns false for a different value", () => {
            const id = new FlashCardId("card-1");

            expect(id.hasValue("card-2")).toBe(false);
        });
    });

    describe("toString", () => {
        it("returns the value as string", () => {
            const id = new FlashCardId("card-1");

            expect(id.toString()).toBe("card-1");
        });
    });
});