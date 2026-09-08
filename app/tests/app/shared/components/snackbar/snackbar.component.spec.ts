// Mock para animação web nos testes
beforeAll(() => {
  if (!window.Element.prototype.animate) {
    window.Element.prototype.animate = () =>
      ({
        play: () => {},
        pause: () => {},
        finish: () => {},
        cancel: () => {},
        reverse: () => {},
        // addEventListener e removeEventListener já declarados acima
        onfinish: null,
        oncancel: null,
        onremove: null,
        currentTime: 0,
        startTime: 0,
        playState: 'finished',
        effect: null,
        finished: Promise.resolve(),
        id: '',
        pending: false,
        playbackRate: 1,
        ready: Promise.resolve(),
        replaceState: 'active',
        timeline: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      } as unknown as Animation);
  }
});
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SnackbarComponent } from '../../../../../src/app/shared/components/snackbar/snackbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  SnackbarService,
  SnackbarData,
} from '../../../../../src/app/shared/services/snackbar.service';
import { BehaviorSubject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SnackbarComponent', () => {
  let component: SnackbarComponent;
  let fixture: ComponentFixture<SnackbarComponent>;
  let snackbarService: SnackbarService;
  let snackbarSubject: BehaviorSubject<SnackbarData>;

  beforeEach(async () => {
    snackbarSubject = new BehaviorSubject<SnackbarData>({
      show: false,
      message: '',
      duration: 3000,
      variant: 'info',
    });

    await TestBed.configureTestingModule({
      imports: [SnackbarComponent, BrowserAnimationsModule],
      providers: [
        {
          provide: SnackbarService,
          useValue: {
            snackbar$: snackbarSubject.asObservable(),
            hideSnackbar: jest.fn(),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SnackbarComponent);
    component = fixture.componentInstance;
    snackbarService = TestBed.inject(SnackbarService);
    fixture.detectChanges();
  });

  afterEach(() => {
    snackbarSubject.complete();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve obter valores reativos de snackbarService e mapear properties do IDS', () => {
    snackbarSubject.next({
      show: true,
      message: 'Mensagem de sucesso',
      duration: 4000,
      variant: 'success',
    });
    fixture.detectChanges();

    expect(component.message).toBe('Mensagem de sucesso');
    expect(component.durationInSeconds).toBe(4);
    expect(component.variant).toBe('success');
    expect(component.show).toBe(true);
  });

  it('deve chamar hideSnackbar caso o evento onShowChange retorne falso', () => {
    component.onShowChange(false);
    expect(component.show).toBe(false);
    expect(snackbarService.hideSnackbar).toHaveBeenCalled();
  });

  it('deve cancelar subscriptions no ngOnDestroy', () => {
    if (component['sub']) {
      jest.spyOn(component['sub'], 'unsubscribe');
    }
    component.ngOnDestroy();
    if (component['sub']) {
      expect(component['sub'].unsubscribe).toHaveBeenCalled();
    }
  });
});
