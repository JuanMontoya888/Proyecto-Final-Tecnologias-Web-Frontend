import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelReservacionesComponent } from './panel-reservaciones.component';

describe('PanelReservacionesComponent', () => {
  let component: PanelReservacionesComponent;
  let fixture: ComponentFixture<PanelReservacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelReservacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelReservacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
