const axios = require('axios');

// URL do seu webhook do Discord
const webhookURL = 'https://discord.com/api/webhooks/SEU_WEBHOOK';

// Link público do relatório (ajuste com seu nome de usuário e repositório)
const publicReportURL = 'https://SEU_USUARIO.github.io/SEU_REPOSITORIO/report.html';

// Função para enviar a mensagem
async function sendReportToDiscord() {
  try {
    const message = {
      content: '📊 Relatório de Testes Cypress',
      embeds: [
        {
          title: 'Relatório de Testes - Cypress',
          description: `[Clique aqui para visualizar o relatório](${publicReportURL})`,
          color: 5814783
        }
      ]
    };

    const response = await axios.post(webhookURL, message);
    console.log('Relatório enviado com sucesso para o Discord:', response.data);
  } catch (error) {
    console.error('Erro ao enviar relatório para o Discord:', error);
  }
}

sendReportToDiscord();
