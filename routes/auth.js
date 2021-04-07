// Rutas para autenticar usuarios
const express = require('express');
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');


const router = express.Router();

// crea un usuario (/api/auth)
router.post('/',
    authController.autenticarUsuario
);

// obtiene el usuario autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado
);

module.exports= router;