const express = require('express')
const app = express()
const port = process.env.PORT || 8000

app.use(express.json())
app.use(cors())
app.get('/', (req, res) => res.send('Hello World!'))
app.post("/data", (req, res) => res.send(req.body))
app.delete("/data", (req, res) => res.send(req.body))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))