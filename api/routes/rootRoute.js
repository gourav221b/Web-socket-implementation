const router = require('express').Router()
const path = require('path')


router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
    // res.json({ success: true })
})

module.exports = router