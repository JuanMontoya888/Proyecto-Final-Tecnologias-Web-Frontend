import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoteldistComponent } from './hoteldist.component';

describe('HoteldistComponent', () => {
  let component: HoteldistComponent;
  let fixture: ComponentFixture<HoteldistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoteldistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoteldistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
