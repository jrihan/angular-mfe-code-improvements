export const APP_CONSTANTS = {
  API: {
    BASE_URL: 'https://api.example.com',
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
  },
  UI: {
    DEBOUNCE_TIME: 300,
    ANIMATION_DURATION: 250,
    TOAST_DURATION: 3000,
    URL_TRUNCATE_LENGTH: 50,
    HISTORY_LIMIT: 10,
  },
  HTTP: {
    SUCCESS_MIN: 200,
    SUCCESS_MAX: 300,
    CLIENT_ERROR_MIN: 400,
    CLIENT_ERROR_MAX: 500,
    SERVER_ERROR_MIN: 500,
    FORBIDDEN_STATUS: 403,
  },
  DELAYS: {
    INITIALIZATION: 100,
    REQUEST_SIMULATION: 1000,
    ERROR_SIMULATION: 1500,
    DATA_LOADING: 2000,
    NAVIGATION_TRANSITION: 100,
    TEST_TIMEOUT: 150,
    WEBCOMPONENT_REGISTRATION: 50,
  },
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 8,
    MAX_TEXT_LENGTH: 500,
    EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  STORAGE: {
    TOKEN_KEY: 'auth_token',
    USER_PREFERENCES: 'user_prefs',
  },
  JOURNEY: {
    NAME: 'webcomponent-template-funnel',
    VERSION: '2025.09.11',
    PRODUCT: 'PF' as const,
    PORTAL: 'template-demo',
    MFE_NAME: 'itau-pg6-webcomponent',
    COMMUNITY: 'Cambio e Derivativos',
  },
  FUNNEL: {
    STEPS: {
      INITIALIZATION: 'initialization',
      FEATURE_SELECTION: 'feature-selection',
      INTERACTION: 'interaction',
      COMPLETION: 'completion',
    },
    PAGE_NAMES: {
      MAIN: 'webcomponent-main',
      ROUTING_DEMO: 'routing-demo',
      SINGLETON_SERVICE_DEMO: 'singleton-service-demo',
      SCOPED_SHARED_DEMO: 'scoped-shared-demo',
      HTTP_INTERCEPTOR_DEMO: 'http-interceptor-demo',
    },
  },
  THEME: {
    IDS_TEMA_PREFIX: 'ids-theme',
    COMPONENT_NAME: 'mf-plataformaresseguro-mfe',
  },
};
