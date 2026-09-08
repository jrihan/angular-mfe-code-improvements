import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MultiselectComponent,
  MultiSelectOption,
} from '../../../../../src/app/shared/components/multiselect/multiselect.component';
import { By } from '@angular/platform-browser';

describe('MultiselectComponent', () => {
  let component: MultiselectComponent;
  let fixture: ComponentFixture<MultiselectComponent>;

  const options: MultiSelectOption[] = [
    { value: 1, label: 'Opção 1' },
    { value: 2, label: 'Opção 2' },
    { value: 3, label: 'Opção 3' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiselectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiselectComponent);
    component = fixture.componentInstance;
    // Simula opções projetadas
    component.options = options;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o placeholder quando nada selecionado', () => {
    component.selectedOptions = [];
    component.placeholder = 'Escolha opções';
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css('.select-box span'));
    expect(span.nativeElement.textContent).toContain('Escolha opções');
  });

  it('deve exibir a contagem de selecionados', () => {
    component.selectedOptions = [options[0], options[2]];
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css('.select-box span'));
    expect(span.nativeElement.textContent).toContain('2 selecionado(s)');
  });

  it('deve abrir e fechar o dropdown ao clicar', () => {
    const selectBox = fixture.debugElement.query(By.css('.select-box'));
    expect(component.isOpen).toBe(false);
    selectBox.nativeElement.click();
    fixture.detectChanges();
    expect(component.isOpen).toBe(true);
    selectBox.nativeElement.click();
    fixture.detectChanges();
    expect(component.isOpen).toBe(false);
  });

  it('deve exibir as opções no dropdown quando aberto', () => {
    component.options = [...options];
    fixture.detectChanges();
    component.isOpen = true;
    fixture.detectChanges();
    const optionEls = fixture.debugElement.queryAll(By.css('.option'));
    expect(optionEls.length).toBe(3);
    expect(optionEls[0].nativeElement.textContent).toContain('Opção 1');
    expect(optionEls[1].nativeElement.textContent).toContain('Opção 2');
    expect(optionEls[2].nativeElement.textContent).toContain('Opção 3');
  });

  it('deve selecionar e desmarcar opções, emitindo selectionChange', () => {
    component.options = [...options];
    fixture.detectChanges();
    component.isOpen = true;
    fixture.detectChanges();
    const spy = jest.spyOn(component.selectionChange, 'emit');
    let optionEls = fixture.debugElement.queryAll(By.css('.option'));
    // Seleciona a primeira opção
    optionEls[0].nativeElement.click();
    fixture.detectChanges();
    expect(component.selectedOptions).toContain(options[0]);
    expect(spy).toHaveBeenCalledWith([options[0]]);
    // Seleciona a segunda opção
    optionEls = fixture.debugElement.queryAll(By.css('.option'));
    optionEls[1].nativeElement.click();
    fixture.detectChanges();
    expect(component.selectedOptions).toEqual([options[0], options[1]]);
    // Desmarca a primeira opção
    optionEls = fixture.debugElement.queryAll(By.css('.option'));
    optionEls[0].nativeElement.click();
    fixture.detectChanges();
    expect(component.selectedOptions).toEqual([options[1]]);
  });
});
