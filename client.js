const express = require('express');

const app = express();
const port = 8080;


app.use(express.static(__dirname + '/public'));

// app.use('/dist', express.static(__dirname + '/dist/'));
// app.use('/shared', express.static(__dirname + '/shared/'));
app.use('/scripts', express.static(__dirname + '/node_modules/'));
// app.use('/shared', express.static(__dirname + '/shared/'));
app.use('/assets', express.static(__dirname + '/assets/'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
    console.log('Client listening on http://localhost:' + port);
});

