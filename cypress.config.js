const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // outros configs aqui...
  },
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: false,
    json: true
  }
});
