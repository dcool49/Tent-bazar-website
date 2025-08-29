import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferServiceComponent } from './offer-service.component';

describe('OfferServiceComponent', () => {
  let component: OfferServiceComponent;
  let fixture: ComponentFixture<OfferServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferServiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
