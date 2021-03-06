// Joi, validation helper
import Joi from 'joi';

import pool from './../db/config';
import moment from 'moment';

import jwt from 'jsonwebtoken';
require('dotenv').config();

// cancel parcel order
const create = (req, response, next) =>{   
    if(!authVerify.isTokenExist(req.token)) return res.send({message: "Sorry, Error occured while processing your token"})
    // if logged in
    const {error} = validateLocation(req.body);
    if(error){
        response.status(400).send(error.details[0].message);
        return;
    }
    const location = {
        id_parcel: req.body.id_parcel,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        message: req.body.message,
        created_time:moment().format("YYYY-MM-DD HH:mm")
    }
    const text = 'INSERT INTO locations( id_parcel, latitude, longitude, message,created_time) VALUES($1, $2, $3, $4, $5) RETURNING *'
    const values = [location.id_parcel, location.latitude, location.longitude, location.message, location.created_time];

    // // callback
    pool.query(text, values, (err, res) => {
        if (err) {
            response.send({
                message: err.stack
            });
        } else {
            response.send({
                message: `Locations: "${location.title}" has been registered successfully!`
            });
        }
    });
   
    req.setTimeout(10000);
};

// // verify location
function validateLocation(location){
    const schema = {
        latitude: Joi.string(),
        longitude: Joi.string(),
        id_parcel: Joi.number(),
        message: Joi.string().min(2).max(300)
    };
    return Joi.validate(location, schema);
}

export default {create}