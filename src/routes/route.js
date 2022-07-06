const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

router.post('/register', userController.createUser)


// global route>>>>>>>>>>
router.all("/**", function (req, res) {
    res.status(404).send({
        status: false,
        msg: "The api you request is not available"
    })
})



module.exports = router;