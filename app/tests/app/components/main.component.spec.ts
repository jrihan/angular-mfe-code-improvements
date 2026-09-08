/* eslint-disable @typescript-eslint/no-unused-vars */

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EventTrackingService } from '@quickweb/mfe-analytics';
import {
  ContextService,
  SubjectService,
  IContext,
  IOutputProcess,
  IRedirect,
} from '@quickweb/mfe-context';
import { of } from 'rxjs';
import { MainComponent } from 'src/app/components/main/main.component';
import { ActivatedRoute, Router } from '@angular/router';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let contextService: ContextService;
  let trackService: EventTrackingService;
  let outputProcessService: SubjectService<IOutputProcess<any>>;
  let redirectService: SubjectService<IRedirect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainComponent, NoopAnimationsModule],
      providers: [
        ContextService,
        {
          provide: EventTrackingService,
          useValue: { listen: jest.fn().mockReturnValue(of(true)) },
        },
        {
          provide: SubjectService,
          useValue: {
            getInstance: jest
              .fn()
              .mockReturnValue({ listen: jest.fn().mockReturnValue(of(true)) }),
          },
        },
        { provide: ActivatedRoute, useValue: {} },
        { provide: Router, useValue: { navigate: jest.fn() } },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    contextService = TestBed.inject(ContextService);
    contextService.emit({} as IContext);
    component.context = {} as IContext<any>;

    trackService = TestBed.inject(EventTrackingService);
    outputProcessService = SubjectService.getInstance('outputProcess');
    redirectService = SubjectService.getInstance('redirect');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle empty context', () => {
    component.context = {} as unknown as IContext<any>;
    component.ngOnChanges();
    expect(component.isContextValid).toBe(true);
  });

  it('should validate context correctly', () => {
    component.context = {
      segmento: 'segment',
      inputdata: { mensagem: { titulo: 'title' } },
    } as IContext<any>;
    expect(component.validateContext(component.context)).toBe(true);
  });

  it('should consider context valid even with missing fields', () => {
    component.context = {
      segmento: '',
      inputdata: { mensagem: { titulo: undefined } },
    } as IContext<any>;
    expect(component.validateContext(component.context)).toBe(true);
    expect(component.listFails).toHaveLength(0);
  });

  it('should keep listFails empty on OnChanges', () => {
    component.listFails = [];
    component.context = {
      segmento: '',
      inputdata: { mensagem: { titulo: undefined } },
    } as IContext<any>;
    component.ngOnChanges();
    expect(component.listFails).toHaveLength(0);
  });

  it('should emit interaction event on refresh', () => {
    const spy = jest.spyOn(component.interactionEventLib, 'emit');
    contextService.refresh({} as IContext);
    expect(spy).toHaveBeenCalledWith({
      name: 'refreshTokenEvent',
      data: contextService.getContext,
    });
  });

  it('should emit interaction event on output process', () => {
    const spy = jest.spyOn(component.interactionEventLib, 'emit');
    const spyOutput = jest.spyOn(outputProcessService, 'listen');
    component.ngOnInit();
    outputProcessService.emit({} as IOutputProcess<any>);
    expect(spyOutput).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith({
      name: 'outputProcessEvent',
      data: expect.anything(),
    });
  });

  it('should emit interaction event on tracking', () => {
    const spy = jest.spyOn(component.interactionEventLib, 'emit');
    const spyTracking = jest.spyOn(trackService, 'listen');
    component.ngOnInit();
    expect(spyTracking).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith({
      name: 'analyticsEvent',
      data: expect.anything(),
    });
  });

  it('should emit interaction event on redirect', () => {
    const spy = jest.spyOn(component.interactionEventLib, 'emit');
    const spyRedirect = jest.spyOn(redirectService, 'listen');
    component.ngOnInit();
    redirectService.emit({} as IRedirect);
    expect(spyRedirect).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith({
      name: 'redirectEvent',
      data: expect.anything(),
    });
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    const unsubscribeSpy = jest.spyOn(
      component['subscribes'][0],
      'unsubscribe'
    );
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
