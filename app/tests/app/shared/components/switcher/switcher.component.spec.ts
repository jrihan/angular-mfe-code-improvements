import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SwitcherComponent } from '../../../../../src/app/shared/components/switcher/switcher.component';

describe('SwitcherComponent', () => {
  let component: SwitcherComponent;
  let fixture: ComponentFixture<SwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitcherComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve alternar state de checked e emitir evento ao chamar toggle()', () => {
    component.checked = false;
    const emitSpy = jest.spyOn(component.checkedChange, 'emit');

    component.toggle();

    expect(component.checked).toBe(true);
    expect(emitSpy).toHaveBeenCalledWith(true);

    component.toggle();

    expect(component.checked).toBe(false);
    expect(emitSpy).toHaveBeenCalledWith(false);
  });
});
