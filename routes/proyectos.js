const express = require('express');
const { check } = require('express-validator');
const proyectoController = require('../controllers/proyectoController');
const router = express.Router();
const auth = require('../middleware/auth');


// crea proyectos (api/proyectos)
router.post('/', 
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto);

// obtener todos los proyectos
router.get('/',
    auth,
    proyectoController.obtenerProyectos);

module.exports = router;

// actualizar proyecto via ID
router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto);

// eliminar un proyecto
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto);