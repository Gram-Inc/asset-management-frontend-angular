import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UamListComponent } from './uam-list.component';

describe('UamListComponent', () => {
  let component: UamListComponent;
  let fixture: ComponentFixture<UamListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UamListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
