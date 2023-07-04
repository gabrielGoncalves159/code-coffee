/* eslint-disable no-dupe-else-if */
const connection = require('./connection');

const getProdutos = async (req) => {

	const { id_produto, nome } = req;

	var query = 'SELECT * FROM produto WHERE status_ativo = 1 ';
	
	if ((id_produto && id_produto !== 0)){
		query += `AND id_produto = ${id_produto}`;
	}
	if((nome && nome !== '')){
		query += `AND nome LIKE '%${nome}%'`;
	}
	const response = await connection.execute(query);
	return response;
};

const inserirProdutos = async (req) => {

	if(req.id_produto == 0) {
		const { nomeProduto, valorUnitario, unidadeMedida, ativo } = req;
		const query = 'INSERT INTO produto (nome, valor_produto, unidade_medida, status_ativo) VALUE (?, ?, ?, ?)';
	
		const response = await connection.execute(query, [nomeProduto, valorUnitario, unidadeMedida, ativo]);
		return response;
	}
	else {
		await updateProduto(req);
	}
};

const updateProduto = async (req) => {
	const {id_produto , nomeProduto, valorUnitario, unidadeMedida} = req;
	const query = 'CALL alterarDadosProduto(?, ?, ?, ?);';
	const response = await connection.execute(query, [id_produto, nomeProduto, valorUnitario, unidadeMedida]);
	return response;
};

const deleteProduto = async (req) => {
	const {id} = req;
	const query = `UPDATE produto SET status_ativo = 0 WHERE id_produto = ${id}`;
	const response = await connection.execute(query);
	return response;
};

module.exports = {
	getProdutos,
	inserirProdutos,
	updateProduto,
	deleteProduto,
};