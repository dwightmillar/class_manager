require('dotenv').config()

const compression = require('compression')
const express = require('express'), app = express()
const bodyParser = require('body-parser')
const path = require('path')
const session = require('express-session')
const classRouter = require('./routers/classes.js')
const studentRouter = require('./routers/students.js')
const assignmentRouter = require('./routers/assignments.js')

const publicDir = path.join(__dirname, 'dist')
const staticMiddlewareFunction = express.static(publicDir)

const sessionMiddleWare = session({
  secret: 'fP4nfWsjK39fbdIo9an4sFoJ3vYe8L12qPjce',
  saveUninitialized: true,
  resave: true,
  proxy: true,
  cookie: {
    expires: 6000000,
    secure: false,
    sameSite: true
  }
})
app.set('trust proxy', 1)
app.use(compression())
app.use(bodyParser.json())
app.use(sessionMiddleWare)
app.use(staticMiddlewareFunction)


app.use('/api', assignmentRouter)
app.use('/api', studentRouter)
app.use('/api', classRouter)

app.get('*', async (req, res) => res.sendFile(path.join(publicDir, 'index.html')));

app.use(async (error, req, res, next) => res.status(500))

app.listen(process.env.APP_PORT)
