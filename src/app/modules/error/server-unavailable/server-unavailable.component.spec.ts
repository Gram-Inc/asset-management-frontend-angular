import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerUnavailableComponent } from './server-unavailable.component';

describe('ServerUnavailableComponent', () => {
  let component: ServerUnavailableComponent;
  let fixture: ComponentFixture<ServerUnavailableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerUnavailableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerUnavailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
