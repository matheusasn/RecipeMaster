import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanoAssinaturaComponent } from './plano-assinatura.component';

describe('PlanoAssinaturaComponent', () => {
  let component: PlanoAssinaturaComponent;
  let fixture: ComponentFixture<PlanoAssinaturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanoAssinaturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanoAssinaturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
