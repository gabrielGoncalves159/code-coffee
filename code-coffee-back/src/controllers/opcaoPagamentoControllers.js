const opcaoPagamentoModels = require('../models/opcaoPagamentoModels');

const listarOpcaoPagamento = async (req, res) => {
	const [listaOpcaoPagamento] = await opcaoPagamentoModels.getOpcaoPagamento();
	return res.status(200).json(listaOpcaoPagamento);
};

module.exports = {
	listarOpcaoPagamento
};