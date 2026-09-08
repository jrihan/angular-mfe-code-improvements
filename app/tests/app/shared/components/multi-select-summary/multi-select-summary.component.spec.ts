import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MultiselectSummaryComponent,
  MultiselectOption,
} from '../../../../../src/app/shared/components/multi-select-summary/multiselect-summary.component';
import { By } from '@angular/platform-browser';

describe('MultiselectSummaryComponent', () => {
  let component: MultiselectSummaryComponent;
  let fixture: ComponentFixture<MultiselectSummaryComponent>;

  const options: MultiselectOption[] = [
    { value: 1, label: 'Opção 1' },
    { value: 2, label: 'Opção 2' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiselectSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiselectSummaryComponent);
    component = fixture.componentInstance;
    component.label = 'Selecionados';
    component.options = [...options];
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o label e as opções', () => {
    const labelEl = fixture.debugElement.query(By.css('.summary-label'));
    expect(labelEl.nativeElement.textContent).toContain('Selecionados:');
    const chips = fixture.debugElement.queryAll(By.css('.chip'));
    expect(chips.length).toBe(2);
    expect(chips[0].nativeElement.textContent).toContain('Opção 1');
    expect(chips[1].nativeElement.textContent).toContain('Opção 2');
  });

  it('deve emitir evento ao clicar no botão de remover', () => {
    const spy = jest.spyOn(component.remove, 'emit');
    const chips = fixture.debugElement.queryAll(By.css('.chip'));
    const btn = chips[0].query(By.css('button'));
    btn.nativeElement.click();
    expect(spy).toHaveBeenCalledWith(options[0]);
  });

  it('deve exibir a dica de remoção', () => {
    const hint = fixture.debugElement.query(By.css('.hint'));
    expect(hint.nativeElement.textContent).toContain(
      'Clique no ícone X para remover um item da seleção'
    );
  });

  it('não deve renderizar nada se options estiver vazio', () => {
    component.options = [];
    fixture.detectChanges();
    const summary = fixture.debugElement.query(By.css('.summary'));
    expect(summary).toBeNull();
  });
});
