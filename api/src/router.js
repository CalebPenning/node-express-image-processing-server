const { Router } = require('express')
const path = require('path')
const multer = require('multer')
const imageProcessor = require('./imageProcessor')


const storage = multer.diskStorage({
    destination: "api/uploads/",
    filename
})

const upload = multer({
    fileFilter,
    storage
})

const photoPath = path.resolve(__dirname, "../../client/photo-viewer.html")

const router = Router()

router.get("/photo-viewer", (req, res) => {
    res.sendFile(photoPath)
})

router.post("/upload", upload.single("photo"), async (req, res) => {
    if (req.fileValidationError) {
        return res.status(400).json({ error: req.fileValidationError })
    }
    
    else {
        try {
            await imageProcessor(req.file.filename)
            return res.status(201).json({ success: true })
        } catch(err) {}
    }
})

function filename(req, file, cb) {
    cb(null, file.originalname)
}

function fileFilter(req, file, cb)  {
    if (file.mimetype !== "image/png") {
        req.fileValidationError = "Wrong file type"
        cb(null, false, new Error("Wrong file type"))
    }
    else {
        cb(null, true)
    }
}

module.exports = router