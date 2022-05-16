
const express = require('express');

// Mise en place du router
const router = express.Router();

//Récupération des logiques metier user
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;







