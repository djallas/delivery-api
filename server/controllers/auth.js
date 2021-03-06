import Joi from 'joi';

// import users from './../data/users';

import pool from './../db/config';

// validators 

import validator from './../validation/index';

// manage auth
import jwt from 'jsonwebtoken';
import Auth from '../db/jwt';
import validation from '../validation';
// IMPORT SECRET DATA
require('dotenv').config();

const saltRounds = 10;
const bcrypt = require('bcrypt');

// create new user
const createNewUser = (req, response, next) => {    
    
    const password = req.body.password;
    const hash = bcrypt.hashSync(password, saltRounds);
    try{      
         
        const user = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            password:hash,
            state:'active'
        };
        const text = 'INSERT INTO users( name, email, password, state, role) VALUES($1, $2, $3, $4, $5) RETURNING *'
        const values = [user.name, user.email, user.password, user.state, user.role];
        // callback
        pool.query(text, values, (err, res) => {
            if (err) {
                response.status(409).send({
                    message:`Whoochs, Account with ${user.email} already exist.`
                });
            } else {
                response.status(200).send({
                    message: `Account with ${user.email} has been registered successfully!`
                });
            }
        });
    }catch(err){
        response.send({
            message: `Whoochs, Error occured. Try again later`
        });
    }
   
    req.setTimeout(10000);
}

// login user
const loginUser = (req, res, next) => {
    const email = validator.emailIsValid(req.body.email,res);
    const password = validator.passwordIsValid(req.body.password);
    if(!email || !password){    
        // server status 422 is used for Unprocessable Entity   
        res.status(422).send({
            message: "Invalid inputs"
        })
    }else{
        pool.query(`SELECT * from users where email = $1 LIMIT 1`, [email]).then(response =>{
          
            if(!response.rows) return res.status(401).send({message:'not found'});
            if(!response.rows[0]) return res.status(401).send({message:'not found'});
            
            const { userId } = response.rows[0];
            const verify = bcrypt.compare(password, response.rows[0].password)
            if(verify){
                const token = jwt.sign({ user: userId }, process.env.SECRET);
                return res.status(200).send({token});
            }else{
                return res.status(401).send({
                    message:"Sorry, your password is incorrect."
                })
            }
        }).catch(err =>{
            console.log(err.stack)
        }); 
    }
}

// // login user
// const deleteUser = (req, res, next) => {
//     // const email = parseInt(req.body.email);
//     // console.log(email);
//     // if(!email === 'test@test.com') return res.status(401).send({message:email+"Action not allowed"})
//     pool.query(`DELETE FROM users where email = 'test@test.com'`).then(response =>{    
    
//        res.status(200).send({
//             message:"User deleted"
//         })
//     }).catch(err =>{                
//         res.status(401).send({
//             message:"Sorry can't delete this user!"
//         })
//     }); 
// }

// // validating user
// function validateUser(user){
//     // defining schema
//     const schema = {
//         name: Joi.string().max(30).min(3).required(),
//         email: Joi.string().email().min(6).max(60).required();
//     };
//     return Joi.validate(user, schema);
// }


export default { createNewUser, loginUser}