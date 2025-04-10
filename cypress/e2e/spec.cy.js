describe('Login e acesso ao Cadastro de Pedido', () => {
  it('Deve logar e acessar a tela de cadastro de pedido', () => {
    cy.visit('http://127.0.0.1:8091/#/login')

    // Intercepta os endpoints que estavam retornando 404
    cy.intercept('GET', '/vendasweb-api/v2/customizacoes/PEDIDO_GRID', {
      statusCode: 200,
      body: {}
    }).as('pedidoGrid')

    cy.intercept('GET', '/vendasweb-api/v2/customizacoes/ITENS_GRID', {
      statusCode: 200,
      body: {}
    }).as('itensGrid')

    cy.intercept('GET', '/vendasweb-api/v2/customizacoes/PRECO_CUSTOM', {
      statusCode: 200,
      body: {}
    }).as('precoCustom')

    // Login
    cy.get('input[name="usuario"]').type('admin')
    cy.get('input[name="senha"]').type('123')
    cy.get('button.login100-form-btn')
      .should('not.be.disabled')
      .click()

    cy.url().should('not.include', '/login')

    // Abre o menu lateral (ícone hambúrguer)
    cy.get('i.icon-menu')
      .filter(':visible')
      .first()
      .click()

    // Clica no 3º botão do menu lateral (índice 2) - "Pedidos"
    cy.get('div.menu-ripple')
      .eq(2)
      .click({ force: true })

    // Aguarda o submenu "Cadastro" aparecer e clica
    cy.get('a[href="#/pedidos/cadastro"]', { timeout: 10000 })
      .should('have.css', 'visibility', 'visible')
      .click({ force: true })

    // Confirma que está na tela de cadastro
    cy.url().should('include', '/pedidos/cadastro')

    // Aguarda as requisições interceptadas
    cy.wait('@pedidoGrid')
    cy.wait('@itensGrid')
    cy.wait('@precoCustom')

    // Verifica a existência do título ou conteúdo da tela
    cy.contains('Cadastro').should('exist')

    // Aguarda o campo de pessoa ficar visível e digita 1682
cy.get('input[aria-autocomplete="list"]', { timeout: 10000 })
  .should('be.visible')
  .clear({ force: true })
  .type('1682', { force: true })

// Aguarda a lista de sugestões e seleciona o primeiro item
cy.get('span.autocomplete-item-list', { timeout: 10000 })
  .should('be.visible')
  .first()
  .click({ force: true })

  })
})
