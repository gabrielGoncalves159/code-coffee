const express = require('express');
const router = express.Router();
const usuarioControllers = require('./controllers/usuarioControllers');
const validarDadosUsuario = require('./middlewares/usuarioMiddlewares');
var cors = require('cors');

router.get('/listar', cors(), usuarioControllers.listarUsuarios);
router.get('/listarTipoUsuario', cors(), usuarioControllers.listarTipoUsuario);
router.post('/inserir', cors(), validarDadosUsuario.validerBody, usuarioControllers.inserirUsuario);
router.patch('/editar', cors(), validarDadosUsuario.validerBody, usuarioControllers.editarUsuario);
router.delete('/excluir', cors(), usuarioControllers.excluirUsuario);
module.exports = router;
