const express = require('express');
const router = express.Router();
const opcaoPagamentoControllers = require('../controllers/opcaoPagamentoControllers');
const cors = require('cors');

router.get('/listar', cors(), opcaoPagamentoControllers.listarOpcaoPagamento);
module.exports = router;