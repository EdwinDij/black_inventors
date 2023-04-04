const express = require('express');
const app = express();
const fs = require('fs');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const data = JSON.parse(fs.readFileSync('inventors.json', 'utf-8'));

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})

app.get('/data', (req, res) => {
    res.send(data);
})

app.post('/data', (req, res) => {
    const newItem = {
        id: data["inventors"].length + 1,
        name: req.body.name,
        age: req.body.age,
        work: req.body.work,
        bio: req.body.bio,
        invention: req.body.invention,
        city: req.body.city,
    };
    data["inventors"].push(newItem);
    fs.writeFileSync('inventors.json', JSON.stringify(data));
    res.send(data);
    
});

app.delete('/data/:id', (req, res) => {
    const id = req.params.id;
    const index = data["inventors"].findIndex((item) => item.id == id);
    data["inventors"].splice(index, 1);
    fs.writeFileSync('inventors.json', JSON.stringify(data));
    res.send(data);
    
})

app.put('/data/:id', (req, res) => {
    const id = req.params.id;
    const index = data["inventors"].findIndex((item) => item.id == id);
    data["inventors"][index].name = req.body.name;
    data["inventors"][index].age = req.body.age;
    data["inventors"][index].work = req.body.work;
    data["inventors"][index].bio = req.body.bio;
    data["inventors"][index].city = req.body.city;
    fs.writeFileSync('inventors.json', JSON.stringify(data));
    res.send(data);
})