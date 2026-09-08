import { MultiselectOptionComponent } from '../../../../../src/app/shared/components/multiselect/multiselect-option.component';

describe('MultiselectOptionComponent', () => {
  let component: MultiselectOptionComponent;

  beforeEach(() => {
    component = new MultiselectOptionComponent();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve usar o label quando informado', () => {
    component.value = 123;
    component.label = 'Rótulo';

    expect(component.resolvedLabel).toBe('Rótulo');
  });

  it('deve usar o value convertido em string quando o label não for informado', () => {
    component.value = 456;

    expect(component.resolvedLabel).toBe('456');
  });
});
