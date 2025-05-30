import { Router } from 'express'
import UserController from '../Controllers/User.controller'
import { auth } from "../Middlewares/Auth.middleware"
import { ROLE } from '../Common/Constants/enums'
const path = '/user'
const RoleRoutes = Router({ mergeParams: true });

RoleRoutes.post(`${path}/signup`, auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }), UserController.signup)

export default RoleRoutes
