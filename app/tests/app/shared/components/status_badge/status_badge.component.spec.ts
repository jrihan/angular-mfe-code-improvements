import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusBadgeComponent } from '../../../../../src/app/shared/components/status_badge/status-badge.component';
import { By } from '@angular/platform-browser';

describe('StatusBadgeComponent', () => {
  let component: StatusBadgeComponent;
  let fixture: ComponentFixture<StatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir "Em Andamento" e classe correta', () => {
    component.status = 'em-andamento';
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css('.status-badge'));
    expect(span.nativeElement.textContent).toContain('Em Andamento');
    expect(span.nativeElement.classList).toContain('status-in-progress');
  });

  it('deve exibir "Concluído" e classe correta', () => {
    component.status = 'concluido';
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css('.status-badge'));
    expect(span.nativeElement.textContent).toContain('Concluído');
    expect(span.nativeElement.classList).toContain('status-done');
  });

  it('deve exibir "Com Rateio" e classe correta', () => {
    component.status = 'com-rateio';
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css('.status-badge'));
    expect(span.nativeElement.textContent).toContain('Com Rateio');
    expect(span.nativeElement.classList).toContain('status-with-split');
  });

  it('deve exibir "Carregar Arquivos" e classe correta', () => {
    component.status = 'carregar-arquivos';
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css('.status-badge'));
    expect(span.nativeElement.textContent).toContain('Carregar Arquivos');
    expect(span.nativeElement.classList).toContain('status-upload-required');
  });

  it('deve exibir status desconhecido e classe status-unknown', () => {
    component.status = 'outro-status';
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css('.status-badge'));
    expect(span.nativeElement.textContent).toContain('outro-status');
    expect(span.nativeElement.classList).toContain('status-unknown');
  });

  it('deve ter role="status" e aria-label correto', () => {
    component.status = 'concluido';
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css('.status-badge'));
    expect(span.nativeElement.getAttribute('role')).toBe('status');
    expect(span.nativeElement.getAttribute('aria-label')).toContain(
      'Status: Concluído'
    );
  });
});
