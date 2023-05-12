const express = require('express');
const app = express();
const usuarios = require('./routers/usuarios');
const produtos = require('./routers/produtos');
const opcaoPagamento = require('./routers/opcaoPagamento');
const comandaVenda = require('./routers/comandaVenda');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use('/produtos', produtos);
app.use('/usuarios', usuarios);
app.use('/opcao-pagamento', opcaoPagamento);
app.use('/comanda-venda', comandaVenda);

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Ops!! algo deu errado!');

	next();
});

module.exports = app;
