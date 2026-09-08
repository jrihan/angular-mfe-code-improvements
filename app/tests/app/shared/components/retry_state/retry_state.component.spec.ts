import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RetryStateComponent } from '../../../../../src/app/shared/components/retry_state/retry_state.component';

describe('RetryStateComponent', () => {
  let component: RetryStateComponent;
  let fixture: ComponentFixture<RetryStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetryStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RetryStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente com textos padrão', () => {
    expect(component).toBeTruthy();
    expect(component.title).toBe('Não foi possível carregar os dados');
    expect(component.description).toBe(
      'Tente novamente em instantes ou volte para a tela anterior.'
    );
    expect(component.showRetryAction).toBe(true);
    expect(component.retryLabel).toBe('Tentar novamente');
    expect(component.backLabel).toBe('Voltar');
  });

  it('deve renderizar título, descrição e as duas ações quando showRetryAction for true', () => {
    component.title = 'Falha ao carregar';
    component.description = 'Descrição customizada';
    component.retryLabel = 'Repetir';
    component.backLabel = 'Retornar';
    component.showRetryAction = true;
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('h2'));
    const description = fixture.debugElement.query(By.css('p'));
    const buttons = fixture.debugElement.queryAll(By.css('button'));

    expect(title.nativeElement.textContent).toContain('Falha ao carregar');
    expect(description.nativeElement.textContent).toContain(
      'Descrição customizada'
    );
    expect(buttons).toHaveLength(2);
    expect(buttons[0].nativeElement.textContent).toContain('Retornar');
    expect(buttons[1].nativeElement.textContent).toContain('Repetir');
  });

  it('deve ocultar a ação de retry quando showRetryAction for false', () => {
    component.showRetryAction = false;
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));

    expect(buttons).toHaveLength(1);
    expect(buttons[0].nativeElement.textContent).toContain('Voltar');
  });

  it('deve emitir retry ao acionar o método correspondente', () => {
    const retrySpy = jest.spyOn(component.retry, 'emit');

    component.onRetry();

    expect(retrySpy).toHaveBeenCalled();
  });

  it('deve emitir back ao acionar o método correspondente', () => {
    const backSpy = jest.spyOn(component.back, 'emit');

    component.onBack();

    expect(backSpy).toHaveBeenCalled();
  });
});
