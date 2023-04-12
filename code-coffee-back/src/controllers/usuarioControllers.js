const usuarioModel = require('../models/usuarioModels');

const listarUsuarios = async (req, res) => {
	const [listaUsuario] = await usuarioModel.getUsuario();
	return res.status(200).json(listaUsuario);
};

const listarTipoUsuario = async (req, res) => {
	const [listaTipoUsuario] = await usuarioModel.getTipoUsuario();
	return res.status(200).json(listaTipoUsuario);
};

const inserirUsuario = async (req, res) => {
	await usuarioModel.insertUsuario(req.body);
	return res.status(204).json();
};

const editarUsuario = async (req, res) => {
	await usuarioModel.updateUsuario(req.body);
	return res.status(204).json();
};

const excluirUsuario = async (req, res) => {
	await usuarioModel.deleteUsuario(req.body);
	return res.status(204).json();
};

module.exports = {
	listarUsuarios,
	listarTipoUsuario,
	inserirUsuario,
	editarUsuario,
	excluirUsuario
};