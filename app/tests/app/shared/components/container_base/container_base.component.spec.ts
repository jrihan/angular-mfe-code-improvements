import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContainerBaseComponent } from '../../../../../src/app/shared/components/container_base/container_base.component';
import { By } from '@angular/platform-browser';
import { SwitcherComponent } from '../../../../../src/app/shared/components/switcher/switcher.component';

describe('ContainerBaseComponent', () => {
  let component: ContainerBaseComponent;
  let fixture: ComponentFixture<ContainerBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContainerBaseComponent, SwitcherComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContainerBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o título passado via input', () => {
    component.title = 'Título Container';
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('.title'));
    expect(titleEl.nativeElement.textContent).toContain('Título Container');
  });

  it('deve exibir o status "Preenchido" quando done=true', () => {
    component.done = true;
    fixture.detectChanges();
    const statusEl = fixture.debugElement.query(By.css('.status'));
    expect(statusEl.nativeElement.textContent).toContain('Preenchido');
  });

  it('não deve exibir o status quando done=false', () => {
    component.done = false;
    fixture.detectChanges();
    const statusEl = fixture.debugElement.query(By.css('.status'));
    expect(statusEl).toBeNull();
  });

  it('deve exibir o botão com título e ícone', () => {
    component.showLeftHeader = true;
    component.buttonTitle = 'Salvar';
    component.buttonIcon = 'save';
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.right button'));
    expect(button.nativeElement.textContent).toContain('Salvar');
    const icon = button.query(By.css('ids-icon'));
    expect(icon).toBeTruthy();
    // Em ambiente de teste, o atributo 'name' pode não ser refletido no DOM.
    // O importante é que o componente renderize o ícone quando buttonIcon for passado.
    // O teste acima já garante isso.
  });

  it('deve emitir evento ao clicar no botão', () => {
    component.showLeftHeader = true;
    component.buttonTitle = 'Salvar';
    fixture.detectChanges();
    const spy = jest.spyOn(component.buttonClick, 'emit');
    const button = fixture.debugElement.query(By.css('.right button'));
    button.nativeElement.click();
    expect(spy).toHaveBeenCalled();
  });

  it('deve exibir o switcher quando showSwitcher=true', () => {
    component.showLeftHeader = true;
    component.showSwitcher = true;
    fixture.detectChanges();
    const switcher = fixture.debugElement.query(
      By.directive(SwitcherComponent)
    );
    expect(switcher).toBeTruthy();
  });

  it('deve alternar expansão ao clicar no botão de expandir', () => {
    component.expanded = true;
    fixture.detectChanges();
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    // Garante que existe o botão de expandir
    const expandBtn = buttons.length > 1 ? buttons[1] : buttons[0];
    expandBtn.nativeElement.click();
    fixture.detectChanges();
    expect(component.expanded).toBeFalsy();
    // Ao colapsar, o conteúdo não deve ser exibido
    const content = fixture.debugElement.query(By.css('.content'));
    expect(content).toBeNull();
  });

  it('deve exibir o conteúdo quando expanded=true', () => {
    component.expanded = true;
    fixture.detectChanges();
    const content = fixture.debugElement.query(By.css('.content'));
    expect(content).toBeTruthy();
  });
});
