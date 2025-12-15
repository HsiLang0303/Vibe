const express = require('express')
const multer = require('multer')
const createUploader = require('../utils/upload')

const router = express.Router()
// 获取用户信息
router.get('/:phone', async (req, res) => {
  try {
    const phone = String(req.params.phone || '').trim()
    if (!phone) return res.status(400).json({ ok: false,message: 'BAD_REQUEST' })
    const pool = req.app.locals.db
    const [rows] = await pool.query(
      'SELECT phone, username, followers_count, following_count, visit_count, tags, avatar, created_at, updated_at FROM usersInfo WHERE phone=? LIMIT 1',
      [phone]
    )
    if (!rows.length) return res.status(404).json({ ok: false,message: 'USER_NOT_FOUND' })
    const u = rows[0]
    let tags = u.tags
    if (tags && typeof tags === 'string') {
      try { tags = JSON.parse(tags) } catch (_) {}
    }
    res.json({ ok: true, user: { phone: u.phone, username: u.username, followers_count: u.followers_count, following_count: u.following_count, visit_count: u.visit_count, tags, avatar: u.avatar, created_at: u.created_at, updated_at: u.updated_at } })
  } catch (e) {
    res.status(500).json({ ok: false })
  }
})
// 更新用户信息
router.put('/:phone', async (req, res) => {
  try {
    const phone = String(req.params.phone || '').trim()
    if (!phone) return res.status(400).json({ ok: false ,message: 'BAD_REQUEST'})
    const pool = req.app.locals.db
    const [exist] = await pool.query('SELECT phone FROM usersInfo WHERE phone=? LIMIT 1', [phone])
    if (!exist.length) return res.status(404).json({ ok: false,message: 'USER_NOT_FOUND' })
    const fields = []
    const values = []
    const username = req.body && req.body.username
    const avatar = req.body && req.body.avatar
    let tags = req.body && req.body.tags
    if (typeof username === 'string') { fields.push('username=?'); values.push(username) }
    if (typeof avatar === 'string') { fields.push('avatar=?'); values.push(avatar) }
    if (typeof tags !== 'undefined') {
      if (Array.isArray(tags)) tags = JSON.stringify(tags)
      fields.push('tags=?'); values.push(tags)
    }
    if (!fields.length) return res.json({ ok: true })
    const sql = `UPDATE usersInfo SET ${fields.join(', ')} WHERE phone=?`
    values.push(phone)
    await pool.query(sql, values)
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ ok: false })
  }
})

 

const { uploader, urlOf } = createUploader('images', { maxSizeMB: 5 })
// 更新用户头像
router.post('/:phone/avatar', uploader.single('avatar'), async (req, res) => {
  try {
    const phone = String(req.params.phone || '').trim()
    if (!phone) return res.status(400).json({ ok: false, message: 'BAD_REQUEST' })
    const pool = req.app.locals.db
    const [exist] = await pool.query('SELECT phone FROM usersInfo WHERE phone=? LIMIT 1', [phone])
    if (!exist.length) return res.status(404).json({ ok: false, message: 'USER_NOT_FOUND' })
    if (!req.file) return res.status(400).json({ ok: false, message: 'FILE_REQUIRED' })
    const url = urlOf(req.file.filename)
    await pool.query('UPDATE usersInfo SET avatar=? WHERE phone=?', [url, phone])
    res.status(201).json({ ok: true, avatar: url })
  } catch (e) {
    res.status(500).json({ ok: false })
  }
})
 
//更新用户背景图片
router.post('/:phone/background', uploader.single('background'), async (req, res) => {
  try {
    const phone = String(req.params.phone || '').trim()
    if (!phone) return res.status(400).json({ ok: false, message: 'BAD_REQUEST' })
    const pool = req.app.locals.db
    const [exist] = await pool.query('SELECT phone FROM usersInfo WHERE phone=? LIMIT 1', [phone])
    if (!exist.length) return res.status(404).json({ ok: false, message: 'USER_NOT_FOUND' })
    if (!req.file) return res.status(400).json({ ok: false, message: 'FILE_REQUIRED' })
    const url = urlOf(req.file.filename)
    await pool.query('UPDATE usersInfo SET background=? WHERE phone=?', [url, phone])
    res.status(201).json({ ok: true, background: url })
  } catch (e) {
    res.status(500).json({ ok: false })
  }
})
router.post('/updateBackground', async (req, res) => { })

module.exports = router
