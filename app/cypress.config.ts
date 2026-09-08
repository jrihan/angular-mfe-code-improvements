import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5000',
    video: false,
    env: {
      hideCredentials: true,
      requestMode: true,
    },
    experimentalRunAllSpecs: true,
    chromeWebSecurity: false,
    reporter: 'cypress-multi-reporters',
    reporterOptions: {
      reporterEnabled: 'cypress-mochawesome-reporter, mocha-junit-reporter',
      cypressMochawesomeReporterReporterOptions: {
        reportDir: 'cypress/results/reports',
        charts: true,
        reportPageTitle: 'Report Cypress E2E',
        embeddedScreenshots: true,
        inlineAssets: true,
      },
      mochaJunitReporterReporterOptions: {
        mochaFile: './cypress/results/junitreport.xml',
      },
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
});
