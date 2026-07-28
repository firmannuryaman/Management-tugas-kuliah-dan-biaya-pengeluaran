import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

import authRoutes from './routes/auth.mjs'
import taskRoutes from './routes/tasks.mjs'
import expenseRoutes from './routes/expenses.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/expenses', expenseRoutes)

const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))

app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Terjadi kesalahan server' })
})

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

export default app
