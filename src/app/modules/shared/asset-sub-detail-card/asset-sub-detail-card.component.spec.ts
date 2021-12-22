import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetSubDetailCardComponent } from './asset-sub-detail-card.component';

describe('AssetSubDetailCardComponent', () => {
  let component: AssetSubDetailCardComponent;
  let fixture: ComponentFixture<AssetSubDetailCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetSubDetailCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetSubDetailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
