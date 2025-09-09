import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabServiceSectionComponent } from './tab-service-section.component';

describe('TabServiceSectionComponent', () => {
  let component: TabServiceSectionComponent;
  let fixture: ComponentFixture<TabServiceSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabServiceSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabServiceSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
