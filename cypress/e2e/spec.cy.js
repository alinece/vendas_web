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

    // Localiza o campo "Pessoa" dentro do p-autocomplete
    cy.get('p-autocomplete[formcontrolname="pessoaDoc"] input.p-autocomplete-input', { timeout: 10000 })
    .should('be.visible')
    .click({ force: true })
    .clear({ force: true })
    .type('1682', { force: true })

    // Aguarda e seleciona a primeira sugestão da lista
    cy.get('span.autocomplete-item-list', { timeout: 10000 })
    .should('be.visible')
    .first()
    .click({ force: true })

    // Preenche o campo "Configuração do pedido" com a opção de código 1
    cy.get('button.p-autocomplete-dropdown', { timeout: 10000 })
      .first()
      .should('be.visible')
      .click({ force: true })

    cy.get('span.autocomplete-item-list', { timeout: 10000 })
      .contains(/^1\b/)
      .click({ force: true })

    // Avançar para a tela de Campos Personalizados
    cy.contains('button', 'Avançar')  // Encontrando o botão "Avançar"
      .should('be.visible')  // Garantir que o botão está visível
      .click({ force: true })  // Forçar o clique no botão

    // Aguarda a tela de "Campos Personalizados" carregar
    cy.contains('Campos Personalizados', { timeout: 10000 }).should('exist')

    // Espera um pouco extra para garantir que a transição visual termine
    cy.wait(1000)

    // Avançar para a Tela de Itens    
    cy.get('button.btn.btn-secondary.m-l-10.btn-square.ripple.light')  // Localiza o botão pelo seletor
    .contains('Avançar')  // Verifica se o botão contém o texto 'Avançar'
    .should('be.visible')  // Garante que o botão esteja visível
    .click({ force: true }); // Força o clique no botão

    //Tela de Itens
    // Selecionar o Tipo de Frete
    // Aguarda a tela de "Itens" carregar
    cy.contains('Itens', { timeout: 10000 }).should('exist');

    // Espera extra para garantir que a transição visual da tela tenha terminado
    cy.wait(1000);

    // Clica no botão do dropdown de Tipo de Frete
    // Encontra o label "Frete" e depois o botão dentro do mesmo container
    cy.contains('Frete')
      .parent() // Sobe para o container do dropdown
      .find('.p-dropdown-trigger') // Encontra o botão de abrir
      .click();

    // Aguarda 2 segundos para garantir que o dropdown esteja completamente aberto
    cy.wait(2000);

    // Seleciona a 2ª opção: "CIF - Por conta do Emitente (Fornecedor)"
    cy.get('span.ng-star-inserted')
      .contains('CIF - Por conta do Emitente (Fornecedor)')
      .click({ force: true });

    // Rola a tela para o topo
    cy.scrollTo('top');


    // Parcelamento
    // Digita o código 1 no campo de Parcelamento (forçando se necessário)
    cy.get('input[placeholder="Pesquise por cód. ou descrição"]')
      .should('be.visible') // Garante que o campo está visível
      .first()              // Garante que está pegando apenas o primeiro visível
      .type('1', { force: true }); // Força o preenchimento, se necessário

    // Aguarda a lista carregar
    cy.wait(1000); // Você pode ajustar esse tempo ou usar interceptação se preferir

    // Aguarda a opção "1- A VISTA" aparecer (até 5s)
    cy.contains('A VISTA', { timeout: 5000 })
      .should('be.visible')
      .click({ force: true }); // Seleciona a opção

    // Rola a tela para o topo
    cy.scrollTo('top');


    // Local de Estoque
    // Clica no campo de Local de Estoque para garantir que ele esteja ativo
    cy.contains('Local de estoque')  // Localiza o label "Local de estoque"
      .parent()                      // Sobe para o contêiner do campo de input
      .find('input[placeholder="Pesquise por cód. ou descrição"]')  // Encontra o campo de input
      .click();  // Clica no campo para ativá-lo

    // Digita o código 1 no campo de Local de Estoque
    cy.contains('Local de estoque')  // Localiza novamente o label "Local de estoque"
      .parent()                      // Sobe para o contêiner
      .find('input[placeholder="Pesquise por cód. ou descrição"]')  // Encontra o campo de input
      .type('1', { force: true });   // Força o preenchimento, se necessário

    // Aguarda a lista carregar
    cy.wait(1000); // Você pode ajustar esse tempo ou usar interceptação se preferir

    // Aguarda a opção "ESTOQUE REVENDA" aparecer (até 5s)
    cy.contains('ESTOQUE REVENDA', { timeout: 5000 })
      .should('be.visible')
      .click({ force: true });  // Seleciona a opção
    // Rola a tela para o topo
    cy.scrollTo('top');

    // Local de Retirada - Busca e interage com o campo
    cy.get('input[placeholder="Pesquise por cód. ou endereço"]')
      .scrollIntoView()  // Rola para o campo, se necessário
      .should('be.visible')  // Garante que o campo está visível
      .click({ force: true })  // Clica no campo
      .type('20', { force: true });  // Digita o valor
      
    // Rola a tela para o topo
    cy.scrollTo('top');

    // Aguarda a lista carregar
    cy.wait(1000);

    // Aguarda a opção "AL TOCANTINS" aparecer (até 5s)
    cy.contains('AL TOCANTINS', { timeout: 5000 })
      .should('be.visible')
      .click({ force: true });  // Seleciona a opção

    // Rola a tela para o topo
    cy.scrollTo('top');

// Pessoa da Retirada - Busca e interage com o campo
cy.get('label')  // Localiza o label "Pessoa da retirada"
  .contains('Pessoa da retirada')  // Garante que é o campo correto
  .parent()  // Sobe até o contêiner do campo
  .find('input[aria-autocomplete="list"]')  // Localiza o campo de input dentro do contêiner
  .scrollIntoView()  // Rola até o campo, se necessário
  .should('be.visible')  // Garante que o campo está visível
  .click({ force: true })  // Clica no campo para ativá-lo
  .type('1', { force: true });  // Digita o código "1" no campo
  // Rola a tela para o topo
  cy.scrollTo('top');

// Aguarda a lista carregar
cy.wait(1000);  // Você pode ajustar o tempo ou usar interceptação de requisição se necessário

// Aguarda a opção "PESSOA - SEM VALOR FISCAL 4" aparecer (até 5s)
cy.contains('PESSOA - SEM VALOR FISCAL 4', { timeout: 5000 })
  .should('be.visible')
  .click({ force: true });  // Seleciona a opção correta

// Rola a tela para o topo
cy.scrollTo('top');


// Placa - Busca e interage com o campo
cy.get('label')  // Localiza o label "Placa"
  .contains('Placa')  // Garante que é o campo correto
  .parent()  // Sobe até o contêiner do campo
  .find('input[aria-autocomplete="list"]')  // Localiza o campo de input dentro do contêiner
  .scrollIntoView()  // Rola até o campo, se necessário
  .should('be.visible')  // Garante que o campo está visível
  .click({ force: true })  // Clica no campo para ativá-lo
  .type('OUV2176', { force: true });  // Digita a placa "OUV2176"
  // Rola a tela para o topo
  cy.scrollTo('top');

// Aguarda a lista carregar
cy.wait(1000);  // Você pode ajustar o tempo ou usar interceptação de requisição se necessário

// Aguarda a opção "OUV2176" aparecer (até 5s)
cy.contains('OUV2176', { timeout: 5000 })
  .should('be.visible')
  .click({ force: true });  // Seleciona a placa correta

// Rola a tela para o topo
cy.scrollTo('top');

// Adicionar Item - Clica no botão "Adicionar item"
cy.get('button')
  .contains('Adicionar item')  // Garante que o botão contém o texto "Adicionar item"
  .should('be.visible')  // Garante que o botão esteja visível
  .click();  // Clica no botão
// Localiza a coluna "Item" e clica para garantir a ordenação, caso necessário
cy.contains('Item')  // Localiza a coluna "Item"
  .parent()           // Sobe até o cabeçalho da tabela
  .click();           // Garante que a coluna de itens seja clicada (para ordenação)

cy.get('td')  // Localiza todas as células da tabela
  .contains('10000')  // Encontra a célula que contém o código "10000"
  .click();  // Clica na célula com o código 10000

  // Localiza o botão "Adicionar" específico e clica nele
cy.get('button.mat-button')  // Localiza o botão com a classe 'mat-button'
.contains('Adicionar')     // Garante que o texto do botão seja "Adicionar"
.click({ force: true });   // Clica no botão


// Rola a tela para baixo
cy.scrollTo('bottom');

// Localiza o campo Quantidade e preenche com o valor 100,00
cy.get('input[name="quantidade"]')  // Localiza o campo de input "quantidade" pelo nome
  .should('be.visible')  // Garante que o campo está visível
  .click({ force: true })  // Clica no campo para ativá-lo
  .type('100,00', { force: true });  // Digita o valor 100,00

 // Avançar para a Detalhes  
 // Aguarda a tela de itens carregar completamente
cy.wait(1000);  // Ajuste o tempo conforme necessário

// Localiza e clica em todos os botões "Avançar"
cy.get('button.btn.btn-secondary.m-l-10.btn-square.ripple.light')
  .should('be.visible')
  .click({ force: true, multiple: true });

// Aguarda 2 segundos antes de clicar no botão "Avançar"
cy.wait(2000);

// Localiza e clica em todos os botões "Avançar" na tela de detalhes
cy.get('button.btn.btn-secondary.m-l-10.btn-square.ripple.light')
  .should('be.visible')
  .click({ force: true, multiple: true });

// Tela de Confirmação
// Aguarda 2 segundos antes de clicar no botão "Salvar"
cy.wait(2000);

// Localiza e clica no botão "Salvar" na tela de confirmação
cy.get('button.btn.btn-secondary.m-r-5.ripple.light')
  .should('be.visible')
  .click({ force: true });

// Aguarda 5 segundos antes de clicar no botão "Não"
cy.wait(5000);

// Localiza e clica no botão "Não" na tela de confirmação
cy.get('button.swal2-cancel.swal2-styled')
  .should('be.visible')
  .click({ force: true });


  })
})
