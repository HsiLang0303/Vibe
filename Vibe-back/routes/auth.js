const express = require('express')
const bcrypt = require('bcryptjs')

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const phone = String((req.body && req.body.phone) || '').trim()
    const password = String((req.body && req.body.password) || '')
    const username = String((req.body && req.body.username) || '').trim() || phone
    if (!phone || !password || phone.length > 20 || password.length < 6) {
      return res.status(400).json({ ok: false })
    }
    const pool = req.app.locals.db
    const [exists] = await pool.query('SELECT id FROM users WHERE phone=? LIMIT 1', [phone])
    if (exists.length) {
      return res.status(409).json({ ok: false })
    }
    const hash = await bcrypt.hash(password, 10)
    await pool.query('INSERT INTO users (username, phone, password_hash) VALUES (?, ?, ?)', [username, phone, hash])
    res.status(201).json({ ok: true })
  } catch (e) {
    res.status(500).json({ ok: false })
  }
})

router.post('/login', async (req, res) => {
  try {
    const phone = String((req.body && req.body.phone) || '').trim()
    const password = String((req.body && req.body.password) || '')
    if (!phone || !password) {
      return res.status(400).json({ ok: false, code: 'BAD_REQUEST' })
    }
    const pool = req.app.locals.db
    const [rows] = await pool.query('SELECT id, username, phone, password_hash FROM users WHERE phone=? LIMIT 1', [phone])
    if (!rows.length) {
      return res.status(404).json({ ok: false, code: 'ACCOUNT_NOT_FOUND' })
    }
    const user = rows[0]
    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) {
      return res.status(401).json({ ok: false, code: 'PASSWORD_INCORRECT' })
    }
    res.json({ ok: true, user: { id: user.id, username: user.username, phone: user.phone } })
  } catch (e) {
    res.status(500).json({ ok: false, code: 'SERVER_ERROR' })
  }
})

module.exports = router

