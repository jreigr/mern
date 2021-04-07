const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

exports.crearUsuario = async (req, res) => {

    // revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json(errores.array());
    }

    // extraer email y password
    const { email, password } = req.body;
    
    try {
        // validar si el usuario ya existe
        let usuario = await Usuario.findOne({email});
        
        if (usuario) {
            return res.status(400).json({msg: 'El usuario ya existe'});
        } else {

        // crea el nuevo usuario
        usuario = new Usuario(req.body);

        // Hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);


        // guardar nuevo usuario
        await usuario.save();

        // crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        }

        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600
            }, (error, token) => {
                if (error) throw error;
                // mensaje
                res.json({ token });

            }
            );

        
        }
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');   
    }
}