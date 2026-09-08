import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HomePage } from 'src/app/features/home/presentation/home.component';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NavigationRoute } from 'src/app/shared/navigation-routes';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

declare const expect: jest.Expect;

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let navigationService: NavigationService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HomePage, RouterTestingModule, HttpClientTestingModule],
      providers: [
        {
          provide: NavigationService,
          useValue: {
            navigate: jest.fn(),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    navigationService = TestBed.inject(NavigationService);
    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar ngOnInit sem erros', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });

  describe('goTo', () => {
    it('deve navegar para CompanhiaResseguradaHome quando rota for companhia-ressegurada-home', () => {
      component.goTo('companhia-ressegurada-home');
      expect(navigationService.navigate).toHaveBeenCalledWith(
        NavigationRoute.CompanhiaResseguradaHome
      );
    });

    it('deve navegar para ResseguradoresHome quando rota for home-ressegurador', () => {
      component.goTo('home-ressegurador');
      expect(navigationService.navigate).toHaveBeenCalledWith(
        NavigationRoute.ResseguradoresHome
      );
    });

    it('não deve navegar para nenhuma rota quando o valor de rota for inválido ou não correspondido', () => {
      component.goTo('rota-invalida');
      expect(navigationService.navigate).not.toHaveBeenCalled();
    });
  });
});
