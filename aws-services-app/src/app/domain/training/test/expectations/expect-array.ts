export function expectArray<T>(array: T[]) {
  return {
    toContainExactlyInAnyOrder(expected: T[]) {
      if (array.length !== expected.length) {
        throw new Error('Arrays differ in length');
      }

      const frequencyMap = new Map<T, number>();
      for (const elem of array) {
        frequencyMap.set(elem, (frequencyMap.get(elem) ?? 0) + 1);
      }

      const checkedElements = new Map<T, number>();
      for (const element of expected) {
        const countSoFar = checkedElements.get(element) ?? 0;
        const actualCount = frequencyMap.get(element);

        if (actualCount === undefined) {
          throw new Error(`Array does not contain expected element: ${element}`);
        }

        if (countSoFar + 1 > actualCount) {
          throw new Error(`Array does not contain expected element: ${element}`);
        }

        checkedElements.set(element, countSoFar + 1);
      }

      return this;
    },
  };
}
