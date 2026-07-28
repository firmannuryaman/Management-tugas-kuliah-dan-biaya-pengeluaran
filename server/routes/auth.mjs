import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'
import { query } from '../db.mjs'
import { JWT_SECRET } from '../middleware/auth.mjs'

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Semua field harus diisi' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password minimal 6 karakter' })
    }

    const existing = await query('SELECT id FROM users WHERE email = $1', [email])
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email sudah terdaftar' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const id = nanoid()

    await query(
      'INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)',
      [id, name, email, hashedPassword]
    )

    const token = jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '7d' })

    res.json({ token, user: { id, name, email } })
  } catch (err) {
    console.error('Register error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password harus diisi' })
    }

    const result = await query(
      'SELECT id, name, email, password FROM users WHERE email = $1',
      [email]
    )

    const row = result.rows[0] || null
    if (!row) {
      return res.status(400).json({ error: 'Email atau password salah' })
    }

    const user = { id: row.id, name: row.name, email: row.email }
    const valid = await bcrypt.compare(password, row.password)

    if (!valid) {
      return res.status(400).json({ error: 'Email atau password salah' })
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })

    res.json({ token, user })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

router.get('/me', async (req, res) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const decoded = jwt.verify(header.split(' ')[1], JWT_SECRET)
    const result = await query(
      'SELECT id, name, email FROM users WHERE id = $1',
      [decoded.id]
    )
    const row = result.rows[0] || null
    if (!row) {
      return res.status(401).json({ error: 'User not found' })
    }
    res.json({ user: { id: row.id, name: row.name, email: row.email } })
  } catch (err) {
    console.error('Get Me error:', err)
    return res.status(401).json({ error: 'Invalid token' })
  }
})

export default router
