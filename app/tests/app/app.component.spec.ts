import {
  CUSTOM_ELEMENTS_SCHEMA,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from '../../src/app/app.component';
import { IContext, IInteractionEvent } from '@quickweb/mfe-context';
import { ActivatedRoute, Router } from '@angular/router';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    const { BehaviorSubject } = require('rxjs');
    const contextServiceMock = {
      eventSource$: new BehaviorSubject(null),
      refreshSource$: new BehaviorSubject(null),
      segmentSource$: new BehaviorSubject(null),
      emit: jest.fn(),
      getContext: null,
      getSegment: null,
    };
    await TestBed.configureTestingModule({
      imports: [AppComponent, NoopAnimationsModule],
      providers: [
        require('../../src/app/shared/navigation.service').NavigationService,
        {
          provide: require('@quickweb/mfe-context').ContextService,
          useValue: contextServiceMock,
        },
        { provide: ActivatedRoute, useValue: {} },
        { provide: Router, useValue: { navigate: jest.fn() } },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should call changesEventsMfe when ngOnChanges is triggered', () => {
    const changes: SimpleChanges = {
      context: new SimpleChange(
        '',
        '{ "token": "", "segmento": "varejo" }',
        false
      ),
    };
    const changesEventsMfeSpy = jest.spyOn(
      component as any,
      'changesEventsMfe'
    );
    component.ngOnChanges(changes);
    expect(changesEventsMfeSpy).toHaveBeenCalledWith(changes);
  });

  it('should parse context correctly in changesEventsMfe', () => {
    const changes: SimpleChanges = {
      context: new SimpleChange(
        '',
        '{ "token": "", "segmento": "varejo" }',
        false
      ),
    };
    component.ngOnChanges(changes);
    expect(component.contextBase).toEqual({ token: '', segmento: 'varejo' });
  });

  it('should emit interaction event correctly', () => {
    const interactionEventExpect: IInteractionEvent<unknown> = {
      name: 'logEvent',
      data: { teste: 'teste' },
    };
    jest.spyOn(component.interactionEvent, 'emit');
    component.interactionEvents(interactionEventExpect);
    expect(component.interactionEvent.emit).toHaveBeenCalledWith(
      interactionEventExpect
    );
  });

  it('should return true for isContextValid when contextBase is defined', () => {
    component.contextBase = { token: '', segmento: 'varejo' } as IContext;
    expect(component.isContextValid).toBeTruthy();
  });

  it('should return false for isContextValid when contextBase is null', () => {
    component.contextBase = null as unknown as IContext;
    expect(component.isContextValid).toBeFalsy();
  });

  it('should return false for isContextValid when contextBase is undefined', () => {
    component.contextBase = undefined as unknown as IContext;
    expect(component.isContextValid).toBeFalsy();
  });
});
