const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const routerModels = require('./routes/models.router')
const routerErrorHandler = require('./routes/errorhandler.router')


const app = express()
const PORT = process.env.PORT || 8000

/*
Cors Settings
*/
const whitelist = ['http://localhost:8000']
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) ||  !origin) {
      callback(null, true)
    } else {
      callback(new Error('Denied By CORS'))
    }
  }
}

if (process.env.NODE_ENV === 'production') {
  app.use(cors());
  /* Set security HTTP headers */
  /* For Error ERR_BLOCKED_BY_RESPONSE.NotSameOrigin 200 
       https://stackoverflow.com/questions/70752770/helmet-express-err-blocked-by-response-notsameorigin-200
  */
  app.use(helmet({ crossOriginResourcePolicy: false }));

  /**
   *  Rate Limiter for this API - ONLY Server
   */

  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });

  app.use(limiter);
} else {
  app.use(cors())
}

/*
Accept Json & form-urlencoded
*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

/* 
    Tell everyone the state of your api
*/
app.get('/', ({ res }) => {
  return res.json({
    status: 'Up',
    maintenance: false,
  })
})

/*
Routes
*/
routerModels(app)
routerErrorHandler(app)

if (process.env.NODE_ENV != 'test') {
  app.listen(PORT, () => {
    console.log(`Server on PORT: ${PORT}`)
  })
}

module.exports = {app}