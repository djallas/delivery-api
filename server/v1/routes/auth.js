// require express
import express from 'express';

// register router
const router = express.Router();

// import users controller
import AuthController from './../../controllers/auth';


//POST signup
router.post('/signup', AuthController.createNewUser);

//POST login
router.post('/login', AuthController.loginUser);
// delete user
// router.delete('/delete', Auth, AuthController.deleteUser);


export default router;