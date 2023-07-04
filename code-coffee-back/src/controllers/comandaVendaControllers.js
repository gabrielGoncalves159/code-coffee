const comandaVendaModels = require('../models/comandaVendaModels');

const inserirProdutoComanda = async (req, res) => {
	await comandaVendaModels.criarComanda(req.body);
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

const alterarStatusComanda = async (req, res) => {
	await comandaVendaModels.alterarStatusComanda(req.body);
	return res.status(204).json();
};

const finalizarComanda = async (req, res) => {
	await comandaVendaModels.finalizarComanda(req.body);
	return res.status(204).json();
};

module.exports = {
	alterarStatusComanda,
	listarProdutosComanda,
	listarComandaVenda,
	inserirProdutoComanda,
	finalizarComanda,
};