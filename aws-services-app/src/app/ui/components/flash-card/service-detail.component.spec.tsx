import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import {FlashCardComponent} from "./flash-card.component";

describe('ServiceDetailComponent', () => {
    let component: FlashCardComponent;
    let fixture: ComponentFixture<FlashCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FlashCardComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FlashCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
