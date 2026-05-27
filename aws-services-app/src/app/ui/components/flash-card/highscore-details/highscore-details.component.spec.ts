import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighscoreDetailsComponent } from './highscore-details.component';
import {gamificationInjectionToken} from "../../../../domain/scoring/gamification";
import {GamificationService} from "../../../services/gamification.service";
import GamificationLocalStorageAccessor, {GAMIFICATION_STORAGE} from "../../../../infra/scoring/gamification-local-storage-accessor";

describe('HighscoreDetailsComponent', () => {
  let component: HighscoreDetailsComponent;
  let fixture: ComponentFixture<HighscoreDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighscoreDetailsComponent],
      providers: [
        {
          provide: gamificationInjectionToken,
          useClass: GamificationService
        },
        {
          provide: GAMIFICATION_STORAGE,
          useClass: GamificationLocalStorageAccessor
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HighscoreDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
