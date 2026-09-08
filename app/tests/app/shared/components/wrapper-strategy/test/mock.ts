import { of } from 'rxjs';
import { Segments } from '@ids/tools';

export const MOCK_CONTEXT_SERVICE = {
  refreshSource$: of({
    token: 'mock-token',
    gateway: 'mock-gateway',
    apikey: 'mock-apikey',
    segmento: Segments.Varejo,
    inputdata: {
      instanceId: 'mock-instance'
    }
  }),
  emit: jest.fn()
};

export const WRAPPER_STRATEGY_MOCK_DATA = {
  BASE_HOST_CLASS: 'itau-pg6-componennt',
  
  THEME_CLASSES: {
    VAREJO: 'ids-theme-varejo',
    EMPRESAS: 'ids-theme-empresas',
    PERSONNALITE: 'ids-theme-personnalite',
    PRIVATE: 'ids-theme-private',
    AREA_DE_PESSOAS: 'ids-theme-area_de_pessoas',
    ATLAS: 'ids-theme-atlas',
    CARTAO_BRANCO: 'ids-theme-cartao_branco',
    CREDICARD: 'ids-theme-credicard',
    CREDICARD_ON: 'ids-theme-credicard_on',
    DECATHLON: 'ids-theme-decathlon',
    EMPS: 'ids-theme-emps',
    FAST_SHOP_PAY: 'ids-theme-fast_shop_pay',
    HIPERCARD: 'ids-theme-hipercard',
    ICARROS: 'ids-theme-icarros',
    IDS: 'ids-theme-ids',
    INVESTMENT_SERVICE: 'ids-theme-investment_service',
    ION: 'ids-theme-ion',
    ITAU_BBA: 'ids-theme-itau_bba',
    ITAU_GESTAO_DE_ATIVOS: 'ids-theme-itau_gestao_de_ativos',
    ITAUCARD: 'ids-theme-itaucard',
    ITI: 'ids-theme-iti',
    MAGALU: 'ids-theme-magalu',
    OCA: 'ids-theme-oca',
    OPEN_FINANCE: 'ids-theme-open_finance',
    PAO_DE_ACUCAR: 'ids-theme-pao_de_acucar',
    PERSONAL_BANK: 'ids-theme-personal_bank',
    PLAYERS_BANK: 'ids-theme-players_bank',
    PORTO_BANK: 'ids-theme-porto_bank',
    REDE: 'ids-theme-rede',
    SAMSUNG: 'ids-theme-samsung',
    UNICLASS: 'ids-theme-uniclass',
    UNICLASS_BETA: 'ids-theme-uniclass_beta',
    VAREJO_BETA: 'ids-theme-varejo_beta',
    VIVO: 'ids-theme-vivo'
  },

  CSS_VARIABLES: {
    FONT_FAMILY_PRIMARY: '--ids-font-family-primary',
    FONT_FAMILY_SECONDARY: '--ids-font-family-secondary',
    FONT_FAMILY_ICON: '--ids-font-family-icon',
    COLOR_ACTION_PRIMARY_BASE: '--ids-color-action-primary-base',
    COLOR_ACTION_PRIMARY_VARIANT: '--ids-color-action-primary-variant',
    COLOR_ACTION_PRIMARY_CONTRAST: '--ids-color-action-primary-contrast',
    COLOR_ACTION_SECONDARY_BASE: '--ids-color-action-secondary-base',
    COLOR_ACTION_SECONDARY_VARIANT: '--ids-color-action-secondary-variant',
    COLOR_ACTION_SECONDARY_CONTRAST: '--ids-color-action-secondary-contrast',
    SPACING_1X: '--ids-spacing-1x',
    SPACING_2X: '--ids-spacing-2x',
    SPACING_4X: '--ids-spacing-4x',
    SPACING_8X: '--ids-spacing-8x'
  },

  TEST_CONTENT: '<div class="test-content">Test Content for Wrapper Strategy</div>',
  
  COMPONENT_SELECTOR: 'app-wrapper-strategy'
};
