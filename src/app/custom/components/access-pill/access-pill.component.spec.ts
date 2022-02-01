import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessPillComponent } from './access-pill.component';

describe('AccessPillComponent', () => {
  let component: AccessPillComponent;
  let fixture: ComponentFixture<AccessPillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessPillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessPillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
