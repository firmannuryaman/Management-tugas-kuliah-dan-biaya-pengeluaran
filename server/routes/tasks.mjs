import express from 'express'
import { nanoid } from 'nanoid'
import { query } from '../db.mjs'
import { authMiddleware } from '../middleware/auth.mjs'

const router = express.Router()

router.use(authMiddleware)

router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT id, title, course_name, lecturer_name, status, deadline, description, created_at, updated_at FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    )
    const tasks = result.rows.map(r => ({
      id: r.id, title: r.title, courseName: r.course_name, lecturerName: r.lecturer_name,
      status: r.status, deadline: r.deadline, description: r.description,
      createdAt: r.created_at, updatedAt: r.updated_at,
    }))
    res.json(tasks)
  } catch (err) {
    console.error('Get tasks error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { title, courseName, lecturerName, deadline, description } = req.body
    if (!title) return res.status(400).json({ error: 'Nama tugas wajib diisi' })

    const id = nanoid()
    await query(
      'INSERT INTO tasks (id, user_id, title, course_name, lecturer_name, deadline, description) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [id, req.userId, title, courseName || '', lecturerName || '', deadline || '', description || '']
    )

    const task = { id, title, courseName: courseName || '', lecturerName: lecturerName || '', status: 'todo', deadline: deadline || '', description: description || '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    res.json(task)
  } catch (err) {
    console.error('Create task error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { title, courseName, lecturerName, status, deadline, description } = req.body
    await query(
      `UPDATE tasks SET title=$1, course_name=$2, lecturer_name=$3, status=$4, deadline=$5, description=$6, updated_at=NOW() WHERE id=$7 AND user_id=$8`,
      [title, courseName || '', lecturerName || '', status || 'todo', deadline || '', description || '', req.params.id, req.userId]
    )
    res.json({ ok: true })
  } catch (err) {
    console.error('Update task error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await query('DELETE FROM tasks WHERE id=$1 AND user_id=$2', [req.params.id, req.userId])
    res.json({ ok: true })
  } catch (err) {
    console.error('Delete task error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

export default router
