import express, { type Request, type Response, type NextFunction } from 'express'
import { HealthchecksController } from '../controllers/healthchecksController'

const healthchecksController = new HealthchecksController()
const router = express.Router()

router.get('/healthcheck', (req, res) => { healthchecksController.show(req, res) })
router.get('/healthcheckz', (req, res) => { healthchecksController.showz(req, res) })
router.get('/', (_req: Request, res: Response, _next: NextFunction) => {
  res.render('index.njk', { title: 'FPO Frontend Developer Hub', name: 'Sam' })
})

export default router
