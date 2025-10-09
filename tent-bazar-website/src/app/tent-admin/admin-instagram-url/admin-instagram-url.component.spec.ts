import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInstagramUrlComponent } from './admin-instagram-url.component';

describe('AdminInstagramUrlComponent', () => {
  let component: AdminInstagramUrlComponent;
  let fixture: ComponentFixture<AdminInstagramUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminInstagramUrlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminInstagramUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
