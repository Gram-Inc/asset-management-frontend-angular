import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveConfirmationComponent } from './move-confirmation.component';

describe('MoveConfirmationComponent', () => {
  let component: MoveConfirmationComponent;
  let fixture: ComponentFixture<MoveConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
