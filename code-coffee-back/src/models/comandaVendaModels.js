const connection = require('./connection');

const numeroProximaComanda = async () => {
	var query = 'SELECT id_comanda FROM comanda_venda ORDER BY id_comanda DESC LIMIT 1';
	const [rows] = await connection.execute(query);
	const numeroUltimaComanda = rows[0] ? rows[0].id_comanda : 1;
	return numeroUltimaComanda + 1;
};

const criarComanda = async (req) => {
	const { produto, data } = req;
	const idComanda = await numeroProximaComanda();
  
	const queryComanda = `INSERT INTO comanda_venda (id_comanda, status_comanda, data_venda) VALUES (${idComanda}, 'PP', '${data}')`;
	await connection.execute(queryComanda);

	await inserirProdutoComanda(idComanda, produto);
};

const inserirProdutoComanda = async (idComanda, produto) => {
	var response;

	for (let i = 0; i < produto.length; i++) {
		const queryProdutoComanda = `INSERT INTO produto_has_comanda_venda (id_produto, id_comanda, quantidade_produto) VALUES (${produto[i].id_produto}, ${idComanda}, ${produto[i].quantidade_produto})`;
		response = await connection.execute(queryProdutoComanda);
	}
	return response;
};

const getProdutosComanda = async (req) => {
	const {id_comanda} = req;
	const query = `SELECT p.*, pv.quantidade_produto, (pv.quantidade_produto * p.valor_produto) AS valor_total 
                   FROM produto_has_comanda_venda pv 
                   INNER JOIN produto p ON p.id_produto = pv.id_produto 
                   WHERE pv.id_comanda = ${id_comanda}`;
	const response = await connection.execute(query);
	return response;
};

const getComandasVendas = async (req) => {
	const {id_comanda, status_comanda, data} = req;
	var query = `SELECT c.id_comanda AS comanda,
						CASE c.status_comanda WHEN 'PP' THEN 'Pendente Pagamento' WHEN 'P' THEN 'Pago' ELSE 'Cancelado' END AS status_comanda,
						c.data_venda,
						SUM(pv.quantidade_produto * p.valor_produto) valor_total
				   FROM 
						produto_has_comanda_venda pv
				   INNER JOIN produto p ON p.id_produto = pv.id_produto
				   INNER JOIN comanda_venda c ON c.id_comanda = pv.id_comanda`;
	if(id_comanda != 0 || status_comanda != '' || data != ''){
		query += ' WHERE ';
	}
	if(id_comanda != 0){
		query += `c.id_comanda = ${id_comanda}`;
	}
	if(status_comanda != ''){
		if(id_comanda != 0){
			query += ' AND ';
		}
		query += `c.status_comanda = '${status_comanda}'`;
	}
	if(data != ''){
		if(status_comanda != '' || id_comanda != 0){
			query += ' AND ';
		}
		query += `c.data_venda LIKE '%${data}%'`;
	}
	query += ' group by comanda';
	const response = await connection.execute(query);
	return response;

};


const updateComanda = async (req) => {
	const {id, nome, cpf, senha, telefone, idTipoUsuario} = req;
	const query = 'CALL alterarDadosUsuario(?,?,?,?,?,?)';
	const response = await connection.execute(query, [id, nome, cpf, senha, telefone, idTipoUsuario]);

	return response;
};

const alterarStatusComanda = async (req) => {
	const {idComanda, statusComanda} = req;
	const query = `UPDATE comanda_venda SET status_comanda = "${statusComanda}" WHERE id_comanda = ${idComanda};`;
	const response = await connection.execute(query);

	return response;
};

const finalizarComanda = (req) => {
	try {
		const { produto, idComanda, idOpcaoPagamento } = req;
  
		const deleteQuery = `DELETE FROM produto_has_comanda_venda WHERE id_comanda = ${idComanda}`;
		const updateQuery = `UPDATE comanda_venda SET id_opcao_pagamento = ${idOpcaoPagamento} WHERE id_comanda = ${idComanda}`;
  
		Promise.all([
			connection.execute(deleteQuery),
			connection.execute(updateQuery),
			inserirProdutoComanda(idComanda, produto),
			alterarStatusComanda(req)
		]);
  
		return true;
	} catch (error) {
		// Lidar com o erro adequadamente
		console.error('Ocorreu um erro ao finalizar a comanda:', error);
		return false;
	}
};
  

module.exports = {
	alterarStatusComanda,
	updateComanda,
	getProdutosComanda,
	getComandasVendas,
	criarComanda,
	finalizarComanda,
};