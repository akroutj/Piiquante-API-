
const express = require('express');

// Mise en place du router
const router = express.Router();

// Récupération des controllers sauces
const sauceCtrl = require('../controllers/sauces');

//CRUD

router.post('/', sauceCtrl.createSauce);

router.put('/:id', sauceCtrl.modifySauce);

router.delete('/:id', sauceCtrl.deleteSauce);

router.get('/:id', sauceCtrl.getOneSauce);

router.get('/', sauceCtrl.getAllSauces);

module.exports = router;
