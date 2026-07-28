import { Pool } from '@neondatabase/serverless'

let pool

export async function getDb() {
  if (pool) return pool

  pool = new Pool({ connectionString: process.env.DATABASE_URL })

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      course_name TEXT DEFAULT '',
      lecturer_name TEXT DEFAULT '',
      status TEXT DEFAULT 'todo',
      deadline TEXT DEFAULT '',
      description TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      category TEXT DEFAULT '',
      amount NUMERIC DEFAULT 0,
      expense_date TEXT DEFAULT '',
      semester TEXT DEFAULT '',
      note TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS reset_codes (
      email TEXT NOT NULL,
      code TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL
    )
  `)

  return pool
}

export async function query(text, params) {
  const p = await getDb()
  return p.query(text, params)
}
