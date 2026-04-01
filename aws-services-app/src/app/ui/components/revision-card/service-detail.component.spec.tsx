import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import {RevisionCardComponent} from "./revision-card.component";

describe('ServiceDetailComponent', () => {
    let component: RevisionCardComponent;
    let fixture: ComponentFixture<RevisionCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RevisionCardComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RevisionCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
