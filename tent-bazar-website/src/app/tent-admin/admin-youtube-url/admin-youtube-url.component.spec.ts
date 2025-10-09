import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminYoutubeUrlComponent } from './admin-youtube-url.component';

describe('AdminYoutubeUrlComponent', () => {
  let component: AdminYoutubeUrlComponent;
  let fixture: ComponentFixture<AdminYoutubeUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminYoutubeUrlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminYoutubeUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
