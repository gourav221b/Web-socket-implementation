const path = require("path")
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: ["http://127.0.0.1:5500", "https://dukhdard.netlify.app"],
        methods: ["GET", "POST"]
    }
});
const NeDB = require('nedb');
const db = new NeDB({ filename: 'data.db', autoload: true });
const cors = require('cors')

const port = process.env.PORT || 8000
app.use(cors());
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'public')))
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', "index.html")))
// GET all data
app.get('/data', (req, res) => {
    db.find({}, (err, data) => {
        res.send(data);

    })
});

// POST data
app.post('/data', (req, res) => {

    let record = req.body;
    record.like = 0;
    record.laughing = 0;
    record.claps = 0
    db.insert(record, (err, newDoc) => {
        res.status(200).json({ msg: 'Data added' });
    });
});

app.put('/data', (req, res) => {
    switch (req.body.type) {
        case "like":
            db.update(
                { _id: req.body._id, user: req.body.user },
                { $set: { like: like + 1 } },
                {},// this argument was missing
                function (err, numReplaced) {
                    console.log("replaced---->" + numReplaced);
                }
            );
            break;
        case "laughing":
            db.update(
                { _id: req.body._id, user: req.body.user },
                { $set: { laughing: laughing + 1 } },
                {},// this argument was missing
                function (err, numReplaced) {
                    console.log("replaced---->" + numReplaced);
                }
            );
            break;
        case "claps":
            db.update(
                { _id: req.body._id, user: req.body.user },
                { $set: { claps: claps + 1 } },
                {},// this argument was missing
                function (err, numReplaced) {
                    console.log("replaced---->" + numReplaced);
                }
            );
            break;
        default:
            break;
    }

})
// DELETE data
app.delete('/data/:id', (req, res) => {
    db.remove({ _id: req.params.id }, {}, (err, numRemoved) => {
        res.json({ msg: 'Data removed' });
    });
});
app.get("/random", (req, res) => {
    let allRecords;
    seekRandom()
    // console.log(randomIndex, allRecords)
})
function seekRandom() {
    db.find({}, (err, data) => {

        let randomIndex = Math.floor(Math.random() * data.length)
        randomIndex && io.emit("newMessage", data[randomIndex]);
    })
}

// Socket IO
io.on('connection', (socket) => {

    socket.on("reaction", (data) => {

        io.emit("reactionResponse", { name: data?.name, type: data?.type })

    })
    socket.on("sendNewMessage", (data) => {
        seekRandom()
        console.log(data)
    })
});



http.listen(port, () => {
    console.log('Server listening on', port);
});