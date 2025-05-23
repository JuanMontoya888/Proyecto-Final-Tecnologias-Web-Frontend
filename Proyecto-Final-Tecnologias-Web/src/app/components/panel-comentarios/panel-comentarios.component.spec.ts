import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelComentariosComponent } from './panel-comentarios.component';

describe('PanelComentariosComponent', () => {
  let component: PanelComentariosComponent;
  let fixture: ComponentFixture<PanelComentariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelComentariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelComentariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
