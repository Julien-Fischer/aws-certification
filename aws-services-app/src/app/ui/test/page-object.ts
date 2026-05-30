import {ComponentFixture} from "@angular/core/testing";

export default abstract class PageObject<T> {

    protected constructor(
        protected fixture: ComponentFixture<T>
    ) { }

    async stabilize() {
        this.fixture.detectChanges();
        await this.fixture.whenStable();
    }

    protected async clickElement(element: HTMLElement | null) {
        if (element == null) {
            throw new Error('Clickable element is null');
        }
        element.click();
        this.fixture.detectChanges();
        await this.stabilize();
    }

    protected lookupElement(searchString: string): HTMLElement {
        return this.fixture.nativeElement.querySelector(searchString);
    }

    protected lookupTextOfElement(searchString: string): string {
        return this.lookupElement(searchString)?.textContent?.trim() || '';
    }

  /**
   * Looks up an element by its data-test-id attribute.
   * Supports any level of nesting.
   *
   * @example
   * lookupByDataTestId('container')
   * lookupByDataTestId('container button span')
   */
    protected lookupByDataTestId(testIds: string): HTMLElement {
      const selector = testIds
        .trim()
        .split(/\s+/)
        .map((id) => `[data-test-id="${id}"]`)
        .join(' ');

      return this.lookupElement(selector);
    }

    protected lookupTextByDataTestId(dataTestId: string): string {
        return this.lookupByDataTestId(dataTestId)?.textContent?.trim() || '';
    }

}
