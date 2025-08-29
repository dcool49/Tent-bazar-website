import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileSectionComponent } from './mobile-section.component';

describe('MobileSectionComponent', () => {
  let component: MobileSectionComponent;
  let fixture: ComponentFixture<MobileSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
