const express = require('express')
const multer = require('multer')
const path = require('path')

const router = express.Router()
const ALLOWED_TYPES = new Set(['fav', 'liked', 'saved', 'moment'])

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const base = path.join(process.cwd(), 'uploads')
    const sub = /^image\//.test(file.mimetype) ? 'images' : /^video\//.test(file.mimetype) ? 'videos' : 'others'
    cb(null, path.join(base, sub))
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const name = Date.now() + '-' + Math.random().toString(16).slice(2) + ext
    cb(null, name)
  }
})
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\//.test(file.mimetype) || /^video\//.test(file.mimetype)) cb(null, true)
    else cb(new Error('INVALID_FILE_TYPE'))
  }
})

router.get('/', async (req, res) => {
  try {
    const phone = req.query.phone ? String(req.query.phone).trim() : null
    const type = req.query.type ? String(req.query.type).trim() : null
    const limit = req.query.limit ? Math.max(1, Math.min(100, Number(req.query.limit))) : 20
    const offset = req.query.offset ? Math.max(0, Number(req.query.offset)) : 0
    const pool = req.app.locals.db
    if (!phone) return res.status(400).json({ ok: false })
    const where = ['phone=?']
    const params = [phone]
    if (type) { where.push('type=?'); params.push(type) }
    const sql = `SELECT id, phone, type, content, images, videos, likes, saves, created_at, updated_at FROM user_posts ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY created_at DESC LIMIT ? OFFSET ?`
    params.push(limit, offset)
    const [rows] = await pool.query(sql, params)
    const list = rows.map(r => {
      let images = []
      let videos = []
      if (r.images) {
        if (typeof r.images === 'string') { try { const p = JSON.parse(r.images); if (Array.isArray(p)) images = p } catch (_) {} }
      }
      if (r.videos) {
        if (typeof r.videos === 'string') { try { const p = JSON.parse(r.videos); if (Array.isArray(p)) videos = p } catch (_) {} }
      }
      return { id: r.id, phone: r.phone, type: r.type, content: r.content, images, videos, likes: r.likes, saves: r.saves, created_at: r.created_at, updated_at: r.updated_at }
    })
    res.json({ ok: true, list, limit, offset })
  } catch (e) {
    res.status(500).json({ ok: false })
  }
})


router.post('/', upload.fields([{ name: 'images', maxCount: 9 }, { name: 'videos', maxCount: 4 }]), async (req, res) => {
  try {
    const phone = String((req.body && req.body.phone) || '').trim()
    const type = String((req.body && req.body.type) || '').trim()
    const content = String((req.body && req.body.content) || '')
    let images = req.body && req.body.images
    let videos = req.body && req.body.videos
    if (!phone || !type || !content) {
      return res.status(400).json({ ok: false, code: 'BAD_REQUEST' })
    }
    if (!ALLOWED_TYPES.has(type)) {
      return res.status(400).json({ ok: false, code: 'INVALID_POST_TYPE' })
    }
    const imgFiles = (req.files && req.files.images) || []
    const vidFiles = (req.files && req.files.videos) || []
    const imgUrls = imgFiles.map(f => '/uploads/' + 'images' + '/' + f.filename)
    const vidUrls = vidFiles.map(f => '/uploads/' + 'videos' + '/' + f.filename)
    let bodyImages = Array.isArray(images) ? images : (typeof images === 'string' ? (() => { try { const p = JSON.parse(images); return Array.isArray(p) ? p : [] } catch (_) { return [] } })() : [])
    let bodyVideos = Array.isArray(videos) ? videos : (typeof videos === 'string' ? (() => { try { const p = JSON.parse(videos); return Array.isArray(p) ? p : [] } catch (_) { return [] } })() : [])
    const finalImages = bodyImages.concat(imgUrls)
    const finalVideos = bodyVideos.concat(vidUrls)
    const pool = req.app.locals.db
    const [result] = await pool.query(
      'INSERT INTO user_posts (phone, type, content, images, videos) VALUES (?, ?, ?, ?, ?)',
      [phone, type, content, finalImages.length ? JSON.stringify(finalImages) : null, finalVideos.length ? JSON.stringify(finalVideos) : null]
    )
    res.status(201).json({ ok: true, id: result.insertId })
  } catch (e) {
    res.status(500).json({ ok: false })
  }
})

module.exports = router
