/// <reference types="Cypress" />

describe('e2e test', () => {
  beforeEach(function () {
    cy.visit('/');
  });

  it(`
     Dado que eu acesse a página inicial
     Quando carregar 
     Então a base url deve conter a baseURL da configuração
   `, () => {

    cy.url().should('contain', Cypress.config().baseUrl);
  });
});