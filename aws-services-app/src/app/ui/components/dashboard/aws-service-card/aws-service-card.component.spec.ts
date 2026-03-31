import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AwsServiceCardComponent } from './aws-service-card.component';
import { AwsService } from '../../../../domain/learning/models/aws-service.model';
import Highscore from "../../../../domain/scoring/models/highscore";
import {provideGamification, StubGamificationService} from "../../../test/stub-gamification";

describe('AwsServiceCardComponent', () => {
  let component: AwsServiceCardComponent;
  let fixture: ComponentFixture<AwsServiceCardComponent>;

  const awsService: AwsService = {
    id: 's3',
    name: 'S3',
    description: 'Scalable storage in the cloud',
    icon: 'fa-bucket',
    category: 'Storage',
    markdownFile: 's3.md'
  };

  const highscore = Highscore.NONE;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AwsServiceCardComponent],
      providers: [provideGamification()]
    }).compileComponents();

    fixture = TestBed.createComponent(AwsServiceCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('service', awsService);
    fixture.componentRef.setInput('highscore', highscore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders service details', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.service-title')?.textContent).toContain('S3');
    expect(compiled.querySelector('.service-description')?.textContent).toContain('Scalable storage in the cloud');
    expect(compiled.querySelector('i')?.className).toContain('fa-bucket');
  });

  it('emits serviceClick event when clicked', () => {
    const emitSpy = vi.spyOn(component.serviceClick, 'emit');
    const cardElement = fixture.nativeElement.querySelector('.card');
    cardElement.click();
    
    expect(emitSpy).toHaveBeenCalledWith('s3');
  });
});
