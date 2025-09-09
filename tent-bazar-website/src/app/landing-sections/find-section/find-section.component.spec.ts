import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindSectionComponent } from './find-section.component';

describe('FindSectionComponent', () => {
  let component: FindSectionComponent;
  let fixture: ComponentFixture<FindSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
