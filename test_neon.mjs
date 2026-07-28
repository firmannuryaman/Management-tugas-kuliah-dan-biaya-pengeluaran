"import { Pool } from '@neondatabase/serverless';"  
"const pool = new Pool({ connectionString: process.env.DATABASE_URL });"  
"try { const r = await pool.query('SELECT NOW() as now'); console.log('OK:', r.rows[0].now); } catch(e) { console.error('FAIL:', e.message); } finally { await pool.end(); }"  
