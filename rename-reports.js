const fs = require('fs');
const path = require('path');

// Caminhos dos arquivos gerados
const jsonFilePath = path.join(__dirname, 'cypress/reports', 'mochawesome.json'); // Nome padrão do JSON
const htmlFilePath = path.join(__dirname, 'cypress/reports', 'mochawesome_001.html'); // Nome padrão do HTML

// Caminho para os novos nomes
const newJsonFilePath = path.join(__dirname, 'cypress/reports', 'report.json');
const newHtmlFilePath = path.join(__dirname, 'cypress/reports', 'report.html');

// Função para renomear os arquivos
const renameFiles = () => {
  // Renomear o arquivo JSON
  if (fs.existsSync(jsonFilePath)) {
    fs.renameSync(jsonFilePath, newJsonFilePath);
    console.log('Arquivo JSON renomeado para report.json');
  }

  // Renomear o arquivo HTML
  if (fs.existsSync(htmlFilePath)) {
    fs.renameSync(htmlFilePath, newHtmlFilePath);
    console.log('Arquivo HTML renomeado para report.html');
  }
};

// Chama a função de renomeação
renameFiles();
