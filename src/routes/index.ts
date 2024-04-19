import express, { type Request, type Response, type NextFunction } from 'express'
import { HealthchecksController } from '../controllers/healthchecksController'
import { AuthTokenController } from '../controllers/authTokenController'

const authUrl = process.env.AUTH_URL ?? undefined
const clientId = process.env.CLIENT_ID ?? undefined
const clientSecret = process.env.CLIENT_SECRET ?? undefined

if (authUrl === undefined) throw new Error('AUTH_URL undefined.')
if (clientId === undefined) throw new Error('CLIENT_ID undefined.')
if (clientSecret === undefined) throw new Error('CLIENT_SECRET undefined.')

const healthchecksController = new HealthchecksController()
const authTokenController = new AuthTokenController(authUrl, clientId, clientSecret)
const router = express.Router()

router.get('/test', async (req, res) => {
  const token = await authTokenController.fetchToken()
})

router.get('/healthcheck', (req, res) => { healthchecksController.show(req, res) })
router.get('/healthcheckz', (req, res) => { healthchecksController.showz(req, res) })
router.get('/', (_req: Request, res: Response, _next: NextFunction) => {
  res.render('index.html', { title: 'FPO Frontend Developer Hub', name: 'Sam' })
})

export default router
