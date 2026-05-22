import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighscoreDetailsComponent } from './highscore-details.component';

describe('HighscoreDetailsComponent', () => {
  let component: HighscoreDetailsComponent;
  let fixture: ComponentFixture<HighscoreDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighscoreDetailsComponent]
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
