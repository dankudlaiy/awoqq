const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Octo-Store API',
            version: '1.0.0',
        },
    },
    apis: ['server.js'],
};

const specs = swaggerJsdoc(options);

app.use('/api', swaggerUi.serve, swaggerUi.setup(specs));

/**
 * @swagger
 * /hello:
 *   get:
 *     summary: Returns a hello message
 *     responses:
 *       200:
 *         description: A successful response
 */
app.get('/hello', (req, res) => {
    res.json({ message: 'Hello, world!' })
});

/**
 * @swagger
 * /octo:
 *  get:
 *     summary: Returns a octo test object
 *     responses:
 *       200:
 *         description: A successful response
 */
app.get('/octo', (req, res) => {
    res.send([
        {
            id: 1,
            mood: 'sad',
            color: 'blue'
        }
    ])
})

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});