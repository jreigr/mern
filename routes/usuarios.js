// Rutas para crear usuarios
const express = require('express');
const { check } = require('express-validator');
const usuarioController = require('../controllers/usuarioController'); 

const router = express.Router();

// crea un usuario (/api/usuarios)
router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un email valido').isEmail(),
        check('password', 'El password debe ser de un mínimo de 6 caracteres').isLength({min: 6})
    ],
    usuarioController.crearUsuario);

module.exports= router;