import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SelectComponent,
  SelectOption,
} from '../../../../../src/app/shared/components/select/select.component';
import { By } from '@angular/platform-browser';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  const options: SelectOption[] = [
    { value: 1, label: 'Opção 1' },
    { value: 2, label: 'Opção 2' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o placeholder quando nada selecionado', () => {
    component.placeholder = 'Escolha uma opção';
    component.selected = undefined;
    fixture.detectChanges();
    const valueEl = fixture.debugElement.query(By.css('.value'));
    expect(valueEl.nativeElement.textContent).toContain('Escolha uma opção');
  });

  it('deve exibir o label da opção selecionada', () => {
    component.selected = options[1];
    fixture.detectChanges();
    const valueEl = fixture.debugElement.query(By.css('.value'));
    expect(valueEl.nativeElement.textContent).toContain('Opção 2');
  });

  it('deve abrir e fechar o dropdown ao clicar', () => {
    const selectDiv = fixture.debugElement.query(By.css('.select'));
    expect(component.isOpen).toBeFalsy();
    selectDiv.nativeElement.click();
    fixture.detectChanges();
    expect(component.isOpen).toBe(true);
    selectDiv.nativeElement.click();
    fixture.detectChanges();
    expect(component.isOpen).toBeFalsy();
  });

  it('deve exibir as opções no dropdown quando aberto', () => {
    component.options = options;
    component.isOpen = true;
    fixture.detectChanges();
    const optionEls = fixture.debugElement.queryAll(By.css('.option'));
    expect(optionEls.length).toBe(2);
    expect(optionEls[0].nativeElement.textContent).toContain('Opção 1');
    expect(optionEls[1].nativeElement.textContent).toContain('Opção 2');
  });

  it('deve selecionar uma opção e emitir valueChange', () => {
    component.options = options;
    component.isOpen = true;
    fixture.detectChanges();
    const spy = jest.spyOn(component.valueChange, 'emit');
    const optionEls = fixture.debugElement.queryAll(By.css('.option'));
    optionEls[1].nativeElement.click();
    fixture.detectChanges();
    expect(component.selected).toEqual(options[1]);
    expect(component.isOpen).toBeFalsy();
    expect(spy).toHaveBeenCalledWith(2);
  });
});
