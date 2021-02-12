import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import Template from './../template' 
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'
const app = express()
    /*...Configure express ...*/
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())
app.use(compress())
app.use(helmet())
app.use(cors())
app.use('/',userRoutes)
app.use('/',authRoutes)
app.get('/',(req,res)=>{
    res.status(200).send(Template())
})

/*To handle auth-related errors thrown by express-jwt when it tries to validate JWT
tokens in incoming requests, we need to add the following error-catching code to the
Express app configuration in mern-skeleton/server/express.js, near the end of
the code, after the routes are mounted and before the app is exported: 

validated for some reason. We catch this error here to return a 401 status back to the
requesting client. We also add a response to be sent if other server-side errors are
generated and caught here.
*/
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
    res.status(401).json({"error" : err.name + ": " + err.message})
    }else if (err) {
    res.status(400).json({"error" : err.name + ": " + err.message})
    console.log(err)
    }
   })
   

export default app