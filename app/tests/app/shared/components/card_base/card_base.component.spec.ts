import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardBaseComponent } from '../../../../../src/app/shared/components/card_base/card_base.component';
import { By } from '@angular/platform-browser';

describe('CardBaseComponent', () => {
  let component: CardBaseComponent;
  let fixture: ComponentFixture<CardBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardBaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o título passado via input', () => {
    component.title = 'Título Teste';
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('.title'));
    expect(titleEl.nativeElement.textContent).toContain('Título Teste');
  });

  it('deve exibir o valor passado via input', () => {
    component.value = 'R$ 123,45';
    fixture.detectChanges();
    const valueEl = fixture.debugElement.query(By.css('.value'));
    expect(valueEl.nativeElement.textContent).toContain('R$ 123,45');
  });

  it('deve exibir o ícone padrão se não informado', () => {
    fixture.detectChanges();
    const iconEl = fixture.debugElement.query(By.css('ids-icon'));
    expect(iconEl).toBeTruthy();
    expect(iconEl.nativeElement.textContent).toContain('warning_base');
  });

  it('deve ocultar o ícone se icon="none"', () => {
    component.icon = 'none';
    fixture.detectChanges();
    const iconEl = fixture.debugElement.query(By.css('ids-icon'));
    expect(iconEl).toBeNull();
  });

  it('deve aplicar a cor de acento passada via input', () => {
    component.accentColor = '#00ff00';
    fixture.detectChanges();
    const articleEl = fixture.debugElement.query(By.css('article'));
    expect(articleEl.nativeElement.getAttribute('style')).toContain(
      '--accent: #00ff00'
    );
  });

  it('deve adicionar classe clickable quando clickable=true', () => {
    component.clickable = true;
    fixture.detectChanges();
    const articleEl = fixture.debugElement.query(By.css('article'));
    expect(articleEl.nativeElement.classList).toContain('clickable');
  });

  it('deve adicionar classe is-round no ícone quando roundIcon=true', () => {
    component.roundIcon = true;
    fixture.detectChanges();
    const iconWrap = fixture.debugElement.query(By.css('.icon-wrap'));
    expect(iconWrap.nativeElement.classList).toContain('is-round');
  });
});
