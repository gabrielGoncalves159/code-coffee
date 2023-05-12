const express = require('express');
const router = express.Router();
const produtoControllers = require('../controllers/produtoControllers');
const cors = require('cors');

router.post('/listar', cors(), produtoControllers.listarProdutos);
router.post('/inserir', cors(), produtoControllers.inserirProduto);
router.patch('/alterar', cors(), produtoControllers.editarProduto);
router.delete('/excluir', cors(), produtoControllers.excluirProduto);
module.exports = router;