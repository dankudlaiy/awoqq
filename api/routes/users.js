const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET request to /users'
    });
});

router.post('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling POST request to /users'
    });
});

router.get('/:userId', (req, res, next) => {
    const id= req.params.userId;
    if(id === 'special') {
        res.status(200).json({
            message: 'You just discovered the special id!',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'You passed an id!',
            id: id
        });
    }
});

router.patch('/:userId', (req, res, next) => {
    const id = req.params.userId;
    res.status(200).json({
        message: 'You just updated user!',
        id: id
    });
});

router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;
    res.status(200).json({
        message: 'You just deleted user!',
        id: id
    });
});

module.exports = router;