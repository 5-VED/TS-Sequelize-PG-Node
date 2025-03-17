import { Router } from 'express'
import UserController from '../Controllers/User.controller'
import { auth } from "../Middlewares/Auth.middleware"
import { ROLE } from '../Common/Constants/enums'
const path = '/user';
const RoleRoutes = Router({ mergeParams: true });

RoleRoutes.post(`${path}/signup`, auth({ isTokenRequired: false, usersAllowed: [ROLE.USER] }), UserController.signup)


RoleRoutes.put(`${path}/update/:id`, auth({ isTokenRequired: false, usersAllowed: [ROLE.USER] }), UserController.signup)

RoleRoutes.get(`${path}/get-users`, auth({ isTokenRequired: false, usersAllowed: [ROLE.USER] }), UserController.signup)

export default RoleRoutes
