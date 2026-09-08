import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuickAccessCardComponent } from '../../../../../src/app/shared/components/quick-access-card/quick-access-card.component';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('QuickAccessCardComponent', () => {
  let component: QuickAccessCardComponent;
  let fixture: ComponentFixture<QuickAccessCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickAccessCardComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(QuickAccessCardComponent);
    component = fixture.componentInstance;
    component.icon = 'home';
    component.label = 'Início';
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve renderizar o ícone e o label', () => {
    const iconEl = fixture.debugElement.query(By.css('.icon ids-icon'));
    expect(iconEl.nativeElement.textContent).toContain('home');
    const labelEl = fixture.debugElement.query(By.css('.label .ids-title'));
    expect(labelEl.nativeElement.textContent).toContain('Início');
  });

  it('deve aplicar as classes clickable e não disabled por padrão', () => {
    const card = fixture.debugElement.query(By.css('.quick-access-card'));
    expect(card.nativeElement.classList).toContain('clickable');
    expect(card.nativeElement.classList).not.toContain('disabled');
  });

  it('deve aplicar a classe disabled quando disabled=true', () => {
    component.disabled = true;
    fixture.detectChanges();
    const card = fixture.debugElement.query(By.css('.quick-access-card'));
    expect(card.nativeElement.classList).toContain('disabled');
  });

  it('deve aplicar tabindex=0 quando clickable=true', () => {
    component.clickable = true;
    fixture.detectChanges();
    const card = fixture.debugElement.query(By.css('.quick-access-card'));
    expect(card.nativeElement.getAttribute('tabindex')).toBe('0');
  });

  it('deve aplicar tabindex=-1 quando clickable=false', () => {
    component.clickable = false;
    fixture.detectChanges();
    const card = fixture.debugElement.query(By.css('.quick-access-card'));
    expect(card.nativeElement.getAttribute('tabindex')).toBe('-1');
  });

  it('deve emitir quickAccessClick ao clicar quando habilitado', () => {
    const spy = jest.spyOn(component.quickAccessClick, 'emit');
    const card = fixture.debugElement.query(By.css('.quick-access-card'));
    card.nativeElement.click();
    expect(spy).toHaveBeenCalled();
  });

  it('não deve emitir quickAccessClick se disabled=true', () => {
    component.disabled = true;
    fixture.detectChanges();
    const spy = jest.spyOn(component.quickAccessClick, 'emit');
    const card = fixture.debugElement.query(By.css('.quick-access-card'));
    card.nativeElement.click();
    expect(spy).not.toHaveBeenCalled();
  });

  it('não deve emitir quickAccessClick se clickable=false', () => {
    component.clickable = false;
    fixture.detectChanges();
    const spy = jest.spyOn(component.quickAccessClick, 'emit');
    const card = fixture.debugElement.query(By.css('.quick-access-card'));
    card.nativeElement.click();
    expect(spy).not.toHaveBeenCalled();
  });
});
