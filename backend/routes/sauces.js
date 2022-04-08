
const express = require('express');

// Mise en place du router
const router = express.Router();

// Mise en place d'un middleware d'authentification
const auth = require('../middleware/auth');

const multer = require('../middleware/multer-config');

// Récupération des controllers sauces
const sauceCtrl = require('../controllers/sauces');

//CRUD

router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

module.exports = router;
