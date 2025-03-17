import { Router } from 'express'
import UserController from '../Controllers/User.controller'
import { auth } from "../Middlewares/Auth.middleware"
import { ROLE } from '../Common/Constants/enums'
const path = '/user';
const UserRoutes = Router({ mergeParams: true });

UserRoutes.post(`${path}/signup`, auth({ isTokenRequired: false, usersAllowed: [ROLE.USER] }), UserController.signup)

UserRoutes.post(`${path}/login`, auth({ isTokenRequired: false, usersAllowed: [ROLE.USER] }), UserController.signup)

UserRoutes.put(`${path}/delete/:id`, auth({ isTokenRequired: false, usersAllowed: [ROLE.USER] }), UserController.signup)

UserRoutes.put(`${path}/update/:id`, auth({ isTokenRequired: false, usersAllowed: [ROLE.USER] }), UserController.signup)

UserRoutes.get(`${path}/get-users`, auth({ isTokenRequired: false, usersAllowed: [ROLE.USER] }), UserController.signup)

export default UserRoutes
