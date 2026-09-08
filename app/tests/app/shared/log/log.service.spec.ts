import { CustomLogService } from '../../../../src/app/shared/services/log/log.service';

describe('CustomLogService', () => {
  let service: CustomLogService;

  beforeEach(() => {
    service = new CustomLogService();
    jest.clearAllMocks();
  });

  it('deve chamar console.debug no debug', () => {
    const spy = jest.spyOn(console, 'debug').mockImplementation();
    service.debug('msg', { foo: 'bar' });
    expect(spy).toHaveBeenCalledWith('[DEBUG]', 'msg', { foo: 'bar' });
  });

  it('deve chamar console.info no info', () => {
    const spy = jest.spyOn(console, 'info').mockImplementation();
    service.info('info', 123);
    expect(spy).toHaveBeenCalledWith('[INFO]', 'info', 123);
  });

  it('deve chamar console.info no notice', () => {
    const spy = jest.spyOn(console, 'info').mockImplementation();
    service.notice('notice', 'extra');
    expect(spy).toHaveBeenCalledWith('[NOTICE]', 'notice', 'extra');
  });

  it('deve chamar console.warn no warn', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();
    service.warn('warn', 1, 2);
    expect(spy).toHaveBeenCalledWith('[WARN]', 'warn', 1, 2);
  });

  it('deve chamar console.error no error', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation();
    service.error('error', 'err');
    expect(spy).toHaveBeenCalledWith('[ERROR]', 'error', 'err');
  });

  it('deve chamar console.error no critical', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation();
    service.critical('critical', 42);
    expect(spy).toHaveBeenCalledWith('[CRITICAL]', 'critical', 42);
  });

  it('deve chamar console.error no alert', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation();
    service.alert('alert', 'msg');
    expect(spy).toHaveBeenCalledWith('[ALERT]', 'alert', 'msg');
  });

  it('deve chamar console.error no emergency', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation();
    service.emergency('emergency', 'msg');
    expect(spy).toHaveBeenCalledWith('[EMERGENCY]', 'emergency', 'msg');
  });

  it('deve chamar console.log no ok', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    service.ok('ok', 123);
    expect(spy).toHaveBeenCalledWith('[OK]', 'ok', 123);
  });
});
