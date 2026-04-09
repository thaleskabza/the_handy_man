/**
 * Vercel Serverless Function Entry Point
 * All requests are routed here via vercel.json rewrites
 */

import { handle } from 'hono/vercel'
import app from '../src/app'

export const config = {
  runtime: 'nodejs20.x',
}

export default handle(app)
