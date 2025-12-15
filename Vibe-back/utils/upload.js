const multer = require('multer')
const path = require('path')

function createUploader(subdir, opts = {}) {
  const dir = path.join(process.cwd(), 'uploads', subdir || '')
  const maxSizeMB = Number(opts.maxSizeMB || 5)
  const allowed = opts.allowed || /^image\//

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname)
      const name = Date.now() + '-' + Math.random().toString(16).slice(2) + ext
      cb(null, name)
    }
  })

  const uploader = multer({
    storage,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (allowed.test(file.mimetype)) cb(null, true)
      else cb(new Error('INVALID_FILE_TYPE'))
    }
  })

  const urlOf = (filename) => '/uploads/' + (subdir ? subdir + '/' : '') + filename

  return { uploader, urlOf }
}

module.exports = createUploader

