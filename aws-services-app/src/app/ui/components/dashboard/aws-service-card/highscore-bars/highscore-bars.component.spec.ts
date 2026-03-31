import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from "vitest";

import { HighscoreBarsComponent } from './highscore-bars.component';
import Highscore from "../../../../../domain/scoring/models/highscore";
import {aHighscore, HighscoreBuilder} from "../../../../../domain/scoring/test/utils/score-builder";
import PageObject from "../../../../test/page-object";
import {gamificationInjectionToken} from "../../../../services/gamification";
import {StubGamificationService} from "../../../../test/stub-gamification";

describe('HighscoreBarsComponent', () => {
  let component: HighscoreBarsComponent;
  let fixture: ComponentFixture<HighscoreBarsComponent>;
  let page: HighscoreBarsPage;
  const gamification = new StubGamificationService();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighscoreBarsComponent],
      providers: [
        {
          provide: gamificationInjectionToken,
          useValue: gamification
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HighscoreBarsComponent);
    component = fixture.componentInstance;
    page = new HighscoreBarsPage(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows zero percent when no highscore', async () => {
    expect(page.progressValue).toBe('0%');
    expect(page.accuracyValue).toBe('0%');
    expect(page.progressWidth).toBe('0%');
    expect(page.accuracyWidth).toBe('0%');
  });

  it('shows progress and accuracy indicators', async () => {
    await having(aHighscore()
        .completed(75)
        .withAccuracy(92));

    expect(page.progressValue).toBe('75%');
    expect(page.accuracyValue).toBe('92%');
    expect(page.progressWidth).toBe('75%');
    expect(page.accuracyWidth).toBe('92%');
  });

  it('resets to zero highscore is removed', async () => {
    await having(aHighscore()
        .completed(75)
        .withAccuracy(92));
    expect(page.progressValue).toBe('75%');

    fixture.componentRef.setInput('highscore', Highscore.NONE);
    fixture.detectChanges();

    expect(page.progressValue).toBe('0%');
    expect(page.accuracyValue).toBe('0%');
  });

  it('displays progress labels', async () => {
    await having(aHighscore()
        .completed(42)
        .withAccuracy(0));

    expect(page.progressLabel).toBe('Progress');
    expect(page.progressValue).toBe('42%');
    expect(page.accuracyLabel).toBe('Accuracy');
  });

  async function having(highscore: HighscoreBuilder) {
    fixture.componentRef.setInput('highscore', highscore.build());
    fixture.detectChanges();
    await fixture.whenStable();
  }

});


export class HighscoreBarsPage extends PageObject<HighscoreBarsComponent> {

  constructor(fixture: ComponentFixture<HighscoreBarsComponent>) {
    super(fixture);
  }

  get progressLabel() {
    return this.lookupTextOfElement('.progress-label');
  }

  get progressValue() {
    return this.lookupTextOfElement('.progress-value');
  }

  get progressBar() {
    return this.lookupElement('.progress-bar');
  }

  get progressWidth() {
    return this.progressBar.style.width;
  }

  get accuracyLabel() {
    return this.lookupTextOfElement('.accuracy-label');
  }

  get accuracyValue() {
    return this.lookupTextOfElement('.accuracy-value');
  }

  get accuracyBar() {
    return this.lookupElement('.progress-bar.accuracy');
  }

  get accuracyWidth() {
    return this.accuracyBar.style.width;
  }

}