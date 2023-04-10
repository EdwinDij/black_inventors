const express = require('express');
const app = express();
const fs = require('fs');
const port = process.env.PORT || 3000;
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const data = JSON.parse(fs.readFileSync('inventors.json', 'utf-8'));
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Black inventors API',
            description: 'Black inventors API Information',
            version: '1.0.0',
        },
    },
    apis: ['main.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})
/**
 * @swagger
 * /data:
 *   get:
 *     description: Use to request all inventors
 *     responses:
 *       '200':
 *         description: A successful response
 *       '400':
 *         description: Invalid request 
 */


app.get('/data', (req, res) => {
    res.send(data);
})

/**
 * @swagger
 * /data/paginate:
 *   get:
 *     summary: Get paginated inventors
 *     parameters:
 *       - name: page
 *         in: query
 *         type: integer
 *       - name: limit
 *         in: query
 *         type: integer
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Data is not an array
 */
app.get("/data/paginate", paginatedResults(data["inventors"]), (req, res) => {
    res.json(res.paginatedResults);
});

function paginatedResults(data) {
    return (req, res, next) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};
        if (!Array.isArray(data)) {
            res.status(400).send("Data is not an array");
        } else {
            if (endIndex < data.length) {
                results.next = {
                    page: page + 1,
                    limit: limit
                };
            }

            if (startIndex > 0) {
                results.previous = {
                    page: page - 1,
                    limit: limit
                };
            }

            results.results = data.slice(startIndex, endIndex);

            res.paginatedResults = results;
            next();
        }
    };
}

/**
 * @swagger
 * /data/:
 *   post:
 *     description: Use to create a new inventor
 *     parameters:
 *       - in: body
 *         name: body
 *         description: The inventor to create
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             age:
 *               type: integer
 *             work:
 *               type: string
 *             bio:
 *               type: string
 *             invention:
 *               type: string
 *             city:
 *               type: string
 *           required:
 *             - name
 *             - age
 *             - work
 *             - bio
 *             - invention
 *             - city
 *     responses:
 *       '200':
 *         description: A successful response
 *       '400':
 *         description: Invalid request
 */
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
    res.send(newItem);

});

/**
 * @swagger
 * /data/{id}:
 *   delete:
 *     description: Use to delete an inventor
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the inventor to delete
 *     responses:
 *       '200':
 *         description: A successful response
 *       '400':
 *         description: Invalid request
 *       '404':
 *         description: Inventor not found
 * 
 */

app.delete('/data/:id', (req, res) => {
    const id = req.params.id;
    if (id < data["inventors"].length || id > data["inventors"].length) {
        res.status(404).send("Invalid ID");
    }
    else {
        const index = data["inventors"].findIndex((item) => item.id == id);
        data["inventors"].splice(index, 1);
        fs.writeFileSync('inventors.json', JSON.stringify(data));
        res.send(data);
    }
})


/**
 * @swagger
 * /data/{id}:
 *  put:
 *    description: Use to update an inventor
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: ID of the inventor to update
 *      - in: body
 *        name: body
 *        description: The inventor to update
 *        schema:
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *            age:
 *              type: integer
 *            work:
 *              type: string
 *            bio:
 *              type: string
 *            city:
 *              type: string
 *          required:
 *            - name
 *            - age
 *            - work
 *            - bio
 *            - city
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Invalid request
 *      '404':
 *        description: Inventor not found
 */

app.put('/data/:id', (req, res) => {
    const id = req.params.id;
    if (id < data["inventors"].length || id > data["inventors"].length) {
        res.status(404).send("Invalid ID");
    } else {
        const index = data["inventors"].findIndex((item) => item.id == id);
        data["inventors"][index].name = req.body.name;
        data["inventors"][index].age = req.body.age;
        data["inventors"][index].work = req.body.work;
        data["inventors"][index].bio = req.body.bio;
        data["inventors"][index].city = req.body.city;
        fs.writeFileSync('inventors.json', JSON.stringify(data));
        res.send(data);
    }
})