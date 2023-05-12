const connection = require('./connection');

const numeroProximaComanda = async () => {
	var query = 'SELECT id_comanda FROM comanda_venda ORDER BY id_comanda DESC LIMIT 1';
	const [rows] = await connection.execute(query);
	const numeroUltimaComanda = rows[0].id_comanda;
	return numeroUltimaComanda + 1;
};

const inserirProdutoComanda = async (req) => {
	const { produto, data } = req;
	const numeroComanda = await numeroProximaComanda();
  
	const queryComanda = `INSERT INTO comanda_venda (id_comanda, status_comanda, data_venda) VALUES (${numeroComanda}, 'PP', '${data}')`;
	await connection.execute(queryComanda);
  
	var response;
	for (let i = 0; i < produto.length; i++) {
		const queryProdutoComanda = `INSERT INTO produto_has_comanda_venda (id_produto, id_comanda, quantidade_produto) VALUES (${produto[i].id}, ${numeroComanda}, ${produto[i].quantidade})`;
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
						CASE c.status WHEN 'PP' THEN 'Pendente Pagamento' WHEN 'P' THEN 'Pago' ELSE 'Cancelado' END AS status_venda,
						c.data_venda,
						SUM(pv.quantidade_produto), 
						SUM(p.valor_produto) 
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
		query += `c.status = ${status_comanda}`;
	}
	if(data != ''){
		if(status_comanda != '' || id_comanda != 0){
			query += ' AND ';
		}
		query += `c.data_venda = ${data}`;
	}
	query += ' group by comanda';
	const response = await connection.execute(query);
	return response;
};

module.exports = {
	getProdutosComanda,
	getComandasVendas,
	inserirProdutoComanda,
};