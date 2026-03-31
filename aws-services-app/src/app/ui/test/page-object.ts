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

    protected lookupElement(searchString: string) {
        return this.fixture.nativeElement.querySelector(searchString);
    }

    protected lookupTextOfElement(searchString: string) {
        return this.lookupElement(searchString)?.textContent?.trim() || '';
    }

}