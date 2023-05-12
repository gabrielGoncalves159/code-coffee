const comandaVendaModels = require('../models/comandaVendaModels');

const inserirProdutoComanda = async (req, res) => {
	await comandaVendaModels.inserirProdutoComanda(req.body);
	return res.status(200).json();
};

const listarProdutosComanda = async (req, res) => {
	const [listaProdutosComanda] = await comandaVendaModels.getProdutosComanda(req.body);
	return res.status(200).json(listaProdutosComanda);
};

const listarComandaVenda = async (req, res) => {
	const [listaComandaVenda] = await comandaVendaModels.getComandasVendas(req.body);
	return res.status(200).json(listaComandaVenda);
};

module.exports = {
	listarProdutosComanda,
	listarComandaVenda,
	inserirProdutoComanda,
};