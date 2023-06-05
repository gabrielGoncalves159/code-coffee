/* eslint-disable no-dupe-else-if */
const connection = require('./connection');

const getProdutos = async (req) => {

	const { id_produto, nome } = req;

	var query = 'SELECT * FROM produto ';
	
	if((id_produto && id_produto !== 0) || (nome && nome !== '')){
		query += 'WHERE ';
	}
	if ((id_produto && id_produto !== 0)){
		query += `id_produto = ${id_produto}`;
	}
	if ((id_produto && id_produto !== 0) && (nome && nome !== '')){
		query += ' AND ';
	}
	if((nome && nome !== '')){
		query += `nome = '${nome}'`;
	}
	const response = await connection.execute(query);
	return response;
};

const inserirProdutos = async (req) => {

	const { nomeProduto, valorUnitario, unidadeMedida } = req;
	const query = 'INSERT INTO produto (nome, valor_produto, unidade_medida) VALUE (?, ?, ?)';

	const response = await connection.execute(query, [nomeProduto, valorUnitario, unidadeMedida]);
	return response;
};

const updateProduto = async (req) => {
	const {id, nome, valorUnitario, unidadeMedida} = req;
	const query = 'CALL alterar_produto(?, ?, ?, ?);';
	const response = await connection.execute(query, [id, nome, valorUnitario, unidadeMedida]);
	return response;
};

const deleteProduto = async (req) => {
	const {id_produto} = req;
	const query = 'DELETE FROM produto WHERE id_produto = ?';
	const response = await connection.execute(query, [id_produto]);
	return response;
};

module.exports = {
	getProdutos,
	inserirProdutos,
	updateProduto,
	deleteProduto,
};