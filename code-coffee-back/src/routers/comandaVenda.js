const express = require('express');
const router = express.Router();
const comandaVendaControllers = require('../controllers/comandaVendaControllers');
const cors = require('cors');

router.post('/listar-produtos-comanda', cors(), comandaVendaControllers.listarProdutosComanda);
router.post('/listar-comanda-venda', cors(), comandaVendaControllers.listarComandaVenda);
router.post('/inserir-produto-comanda', cors(), comandaVendaControllers.inserirProdutoComanda);
module.exports = router;