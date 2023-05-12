const app = require('./app.js');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

try {
	app.listen(PORT, () => console.log(`Exemplo de audição da porta ${PORT}!`));
} catch (err) {
	console.error(`Erro ao iniciar o servidor: ${err.message}`);
}