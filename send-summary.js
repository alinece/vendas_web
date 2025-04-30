const fs = require('fs');
const axios = require('axios');

// URL do seu webhook do Discord
const webhookURL = 'https://discord.com/api/webhooks/1367148496292937769/GUXfFN-YPdBFgfpLuD10_6izFkq8SD0Uux1zFa0DKwmDEn9qAWbuJUCsRL57qWfTpDHP';

// Caminho do arquivo JSON gerado pelo mochawesome
const jsonReportPath = './cypress/reports/mochawesome.json';

// Função para enviar o resumo para o Discord
async function sendSummaryToDiscord() {
  try {
    const jsonContent = fs.readFileSync(jsonReportPath, 'utf-8'); // Lê o conteúdo do arquivo JSON
    const report = JSON.parse(jsonContent); // Parseia o JSON

    // Extração de informações do relatório
    const passed = report.stats.passes;
    const failed = report.stats.failures;
    const pending = report.stats.pending;
    const totalDuration = report.stats.duration / 1000; // Duração total em segundos

    // Formatação da mensagem para o Discord
    const message = {
      content: '📊 Resumo dos Testes Cypress:',
      embeds: [
        {
          title: 'Relatório de Testes - Vendas Web',
          description: `Aqui está o resumo dos testes executados.`,
          fields: [
            {
              name: '✅ Passaram',
              value: passed.toString(),
              inline: true,
            },
            {
              name: '❌ Falharam',
              value: failed.toString(),
              inline: true,
            },
            {
              name: '⏭️ Ignorados',
              value: pending.toString(),
              inline: true,
            },
            {
              name: '⏱️ Duração total',
              value: `${totalDuration.toFixed(2)}s`,
              inline: true,
            }
          ],
          color: 5814783, // Cor da borda do embed
        }
      ]
    };

    // Envia a mensagem para o Discord
    const response = await axios.post(webhookURL, message);
    console.log('Resumo enviado com sucesso:', response.data);
  } catch (error) {
    console.error('Erro ao enviar resumo para o Discord:', error);
  }
}

sendSummaryToDiscord();
