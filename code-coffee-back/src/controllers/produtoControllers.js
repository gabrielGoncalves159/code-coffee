const produtoModels = require('../models/produtoModels');

const listarProdutos = async (req, res) => {
	const [listaProdutos] = await produtoModels.getProdutos(req.body);
	return res.status(200).json(listaProdutos);
};

const inserirProduto = async (req, res) => {
	await produtoModels.inserirProdutos(req.body);
	return res.status(200).json();
};

const editarProduto = async (req, res) => {
	await produtoModels.updateProduto(req.body);
	return res.status(204).json();
};

const excluirProduto = async (req, res) => {
	await produtoModels.deleteProduto(req.body);
	return res.status(204).json();
};

module.exports = {
	listarProdutos,
	inserirProduto,
	editarProduto,
	excluirProduto,
};