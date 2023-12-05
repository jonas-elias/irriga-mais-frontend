import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PivoPage } from './pivo.page';

describe('PivoPage', () => {
  let component: PivoPage;
  let fixture: ComponentFixture<PivoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PivoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
