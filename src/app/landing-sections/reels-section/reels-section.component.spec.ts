import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReelsSectionComponent } from './reels-section.component';

describe('ReelsSectionComponent', () => {
  let component: ReelsSectionComponent;
  let fixture: ComponentFixture<ReelsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReelsSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReelsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
