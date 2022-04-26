import fastify, { FastifyInstance } from 'fastify'
import { default as dbPlugin } from './database'
import { routes } from './routes'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

export const buildApp = (): { app: FastifyInstance } => {
  const app = fastify()
  
  const dirname = path.dirname(fileURLToPath(import.meta.url))
  const root = path.join(dirname, '..')
  dotenv.config({
    path: path.join(root, '.env'),
  })  

  app.register(dbPlugin)
  app.register(routes, { prefix: '/api' })
  
  return { app }
}

const { app } = buildApp()

export const viteNodeApp = app
