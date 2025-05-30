import { Router } from 'express'
import UserController from '../Controllers/User.controller'
import { auth } from "../Middlewares/Auth.middleware"
import ValidationMiddleware from '../Middlewares/Validation.middleware';
import { UserDto } from '../Validators/User.dto';
import { LoginDto } from '../Validators/LoginDto';

const router = Router({ mergeParams: true });



router.post('/signup', ValidationMiddleware(UserDto, 'body'), UserController.signup);

router.post('/login', ValidationMiddleware(LoginDto, 'body'), UserController.login);

export default router;
