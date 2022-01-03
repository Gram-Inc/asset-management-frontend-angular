import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UamDetailComponent } from './uam-detail.component';

describe('UamDetailComponent', () => {
  let component: UamDetailComponent;
  let fixture: ComponentFixture<UamDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UamDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UamDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
