const express = require('express');
const app =  express();
const fs = require('fs');
const port = process.env.PORT || 3000;

app.use(express.json());

let data = JSON.parse(fs.readFileSync('inventors.json', 'utf-8'));

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})

app.get('/data', (req, res) => {
    res.send(data);
})

