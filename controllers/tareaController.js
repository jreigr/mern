const { validationResult } = require('express-validator');
const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');


// crea una nueva tarea
exports.crearTarea = async (req, res) => {

    // revisar si hay errores
     const errores = validationResult(req);
     if (!errores.isEmpty()) {
         return res.status(400).json(errores.array());
     }

     try {
        // extraer el proyecto y comprobar si existe
        const {proyecto} = req.body;
        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
             return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        // revisar si el proyecto actual pertence al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        // creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea});

     } catch (error) {
         console.log(error);
         res.status(500).send('Hubo un error');
     }
}

// obtiene las tareas por proyecto

exports.obtenerTareas = async (req, res) => {
    try {
        // extraer el proyecto y comprobar si existe
        const {proyecto} = req.query;
        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
             return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        // revisar si el proyecto actual pertence al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        // obtener las tareas por proyecto
        const tareas = await Tarea.find({proyecto});
        res.json({tareas});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');    
    }
}

// actualizar una tarea
exports.actualizarTarea = async (req, res) => {

    try {
        // extraer el proyecto y comprobar si existe
        const {proyecto, nombre, estado} = req.body;

        // si la tarea exisite o no ?
        let tarea = Tarea.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({msg: 'La tarea no existe'});
        }

        // extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        // revisar si el proyecto actual pertence al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        // crear un objeto con la nueva informacion
        const nuevaTarea = {}
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;
        

        // guardar tarea
        tarea = await Tarea.findByIdAndUpdate({_id: req.params.id}, nuevaTarea, {new: true});

        res.json({tarea});


    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');    
    }
}

// eliminar tarea
exports.eliminarTarea = async (req, res) => {
    try {
        // extraer el proyecto y comprobar si existe
        const {proyecto} = req.query;

        // si la tarea exisite o no ?
        let tarea = Tarea.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({msg: 'La tarea no existe'});
        }

        // extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        // revisar si el proyecto actual pertence al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        // eliminar
        await Tarea.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'Tarea eliminada'});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');    
    }
}