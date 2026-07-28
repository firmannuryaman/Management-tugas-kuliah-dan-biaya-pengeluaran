import express from 'express'
import { nanoid } from 'nanoid'
import { query } from '../db.mjs'
import { authMiddleware } from '../middleware/auth.mjs'

const router = express.Router()

router.use(authMiddleware)

router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT id, title, category, amount, expense_date, semester, note, created_at FROM expenses WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    )
    const expenses = result.rows.map(r => ({
      id: r.id, title: r.title, category: r.category, amount: r.amount,
      expenseDate: r.expense_date, semester: r.semester, note: r.note, createdAt: r.created_at,
    }))
    res.json(expenses)
  } catch (err) {
    console.error('Get expenses error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { title, category, amount, expenseDate, semester, note } = req.body
    if (!title || amount === undefined) {
      return res.status(400).json({ error: 'Nama dan nominal wajib diisi' })
    }

    const id = nanoid()
    await query(
      'INSERT INTO expenses (id, user_id, title, category, amount, expense_date, semester, note) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [id, req.userId, title, category || '', Number(amount), expenseDate || '', semester || '', note || '']
    )

    res.json({ id, title, category: category || '', amount: Number(amount), expenseDate: expenseDate || '', semester: semester || '', note: note || '', createdAt: new Date().toISOString() })
  } catch (err) {
    console.error('Create expense error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { title, category, amount, expenseDate, semester, note } = req.body
    await query(
      'UPDATE expenses SET title=$1, category=$2, amount=$3, expense_date=$4, semester=$5, note=$6 WHERE id=$7 AND user_id=$8',
      [title, category || '', Number(amount), expenseDate || '', semester || '', note || '', req.params.id, req.userId]
    )
    res.json({ ok: true })
  } catch (err) {
    console.error('Update expense error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await query('DELETE FROM expenses WHERE id=$1 AND user_id=$2', [req.params.id, req.userId])
    res.json({ ok: true })
  } catch (err) {
    console.error('Delete expense error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

export default router
