import {describe, it, expect} from "vitest";
import {expectArray} from "./expect-array";

describe('expectArray', () => {

  describe('toContainExactlyInAnyOrder', () => {
    describe('identical', () => {
      it.for([
        [],
        [0],
        [0, 1],
        [0, 1, 2],
        [2, 1, 0],
        ['a'],
        ['a', 'b'],
        ['ab', 'cd'],
      ])('contains exactly in same order', (arr: any[]) => {
        expectArray(arr).toContainExactlyInAnyOrder(arr);
      })
    })

    describe('same elements, different order', () => {
      it.for([
        {a: [0, 1],       b: [1, 0]},
        {a: [0, 1, 2],    b: [2, 0, 1]},
        {a: [2, 1, 0],    b: [2, 0, 1]},
        {a: ['a', 'b'],   b: ['b', 'a']},
        {a: ['ab', 'cd'], b: ['cd', 'ab']},
      ])('contains exactly in same order', (test: {a: any[], b: any[]}) => {
        expectArray(test.a).toContainExactlyInAnyOrder(test.b);
      })
    })

    describe('different lengths', () => {
      it.for([
        {a: [],           b: [0]},
        {a: [0],          b: []},
        {a: [0, 1],       b: [0]},
        {a: [0],          b: [0, 1]},
        {a: [0, 1],       b: [0, 1, 2]},
        {a: ['a', 'b'],   b: ['a', 'b', 'c']},
        {a: ['ab', 'cd'], b: ['ab', 'cd', 'ef']},
      ])('fails when length differ', (test: {a: any[], b: any[]}) => {
        expect(() => {
          expectArray(test.a).toContainExactlyInAnyOrder(test.b);
        }).toThrow('Arrays differ in length');
      })
    })

    describe('duplicates, same order', () => {
      it.for([
        {a: [0, 0, 1],       b: [0, 0, 1]},
        {a: [0, 1, 1],       b: [0, 1, 1]},
        {a: [0, 0, 0],       b: [0, 0, 0]},
        {a: ['a', 'b', 'b'], b: ['a', 'b', 'b']},
        {a: ['a', 'a', 'b'], b: ['a', 'a', 'b']},
        {a: ['a', 'a', 'a'], b: ['a', 'a', 'a']},
      ])('passes', (test: {a: any[], b: any[]}) => {
        expectArray(test.a).toContainExactlyInAnyOrder(test.b);
      })
    })

    describe('duplicates, different order', () => {
      it.for([
        {a: [0, 0, 1],       b: [0, 1, 0]},
        {a: [0, 1, 1],       b: [1, 1, 0]},
        {a: ['a', 'b', 'b'], b: ['b', 'a', 'b']},
        {a: ['a', 'a', 'b'], b: ['b', 'a', 'a']},
      ])('passes', (test: {a: any[], b: any[]}) => {
        expectArray(test.a).toContainExactlyInAnyOrder(test.b);
      })
    })

    describe('duplicates, different elements', () => {
      it.for([
        {a: [0, 0, 1],       b: [0, 1, 1]},
        {a: [0, 1, 1],       b: [0, 0, 1]},
        {a: [0, 1, 1],       b: [1, 1, 1]},
        {a: ['a', 'b', 'b'], b: ['a', 'a', 'b']},
        {a: ['a', 'a', 'b'], b: ['a', 'b', 'b']},
      ])('fails', (test: {a: any[], b: any[]}) => {
        expect(() => {
          expectArray(test.a).toContainExactlyInAnyOrder(test.b);
        }).toThrow('Array does not contain expected element:');
      })
    })

    describe('duplicates, different lengths', () => {
      it.for([
        {a: [0, 0, 1],       b: [0, 0, 1, 1]},
        {a: [0, 1, 1],       b: [0, 1, 1, 1]},
        {a: [0, 0, 0],       b: [0, 0, 0, 0]},
        {a: ['a', 'b', 'b'], b: ['a', 'b', 'b', 'b']},
        {a: ['a', 'a', 'b'], b: ['a', 'a', 'b', 'a']},
        {a: ['a', 'a', 'a'], b: ['a', 'a', 'a', 'a']},
      ])('fails when length differ', (test: {a: any[], b: any[]}) => {
        expect(() => {
          expectArray(test.a).toContainExactlyInAnyOrder(test.b);
        }).toThrow('Arrays differ in length');
      })
    })

  })

})
