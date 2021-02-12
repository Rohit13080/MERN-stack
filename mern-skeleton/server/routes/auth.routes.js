import express from 'express'
import authCtrl from '../controllers/auth.controller'
/*The two auth APIs are defined in the auth.routes.js file using
express.Router() to declare the route paths with the relevant HTTP methods.
They're also assigned the corresponding controller functions, which should be called
when requests are received for these routes.
The auth routes are as follows:
'/auth/signin': POST request to authenticate the user with their email
and password
'/auth/signout': GET request to clear the cookie containing a JWT that
was set on the response object after sign-in*/
const router = express.Router()
/*A POST request to the signin route and a GET request to the signout route will
invoke the corresponding controller functions defined in the auth.controller.js
file */
router.route('/auth/signin')
    .post(authCtrl.signin)
router.route('/auth/signout')
    .get(authCtrl.signout)


export default router