const express = require('express');
const router = express.Router();
const usuarioControllers = require('../controllers/usuarioControllers');
const validarDadosUsuarioMiddleware = require('../middlewares/usuarioMiddlewares');
const cors = require('cors');

router.post('/listar', cors(), usuarioControllers.listarUsuarios);
router.get('/listarTipoUsuario', cors(), usuarioControllers.listarTipoUsuario);
router.post('/inserir', cors(), validarDadosUsuarioMiddleware.validarBody, usuarioControllers.inserirUsuario);
router.patch('/editar', cors(), validarDadosUsuarioMiddleware.validarBody, usuarioControllers.editarUsuario);
router.post('/excluir', cors(), usuarioControllers.excluirUsuario);
module.exports = router;
