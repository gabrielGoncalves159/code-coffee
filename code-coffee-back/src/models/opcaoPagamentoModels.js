const connection = require('./connection');

const getOpcaoPagamento = async () => {
	const response = await connection.execute('SELECT * FROM opcao_pagamento');
	return response;
};

module.exports = {
	getOpcaoPagamento
};