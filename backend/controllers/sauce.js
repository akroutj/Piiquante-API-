
// Récuperation du schema pour les sauces
const Sauce = require('../models/Sauce');

const jwt = require('jsonwebtoken');

// Récuperation du package FileSystem
const fs = require('fs');

// Logique metier - Récupération de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// Logique metier - Récupération d'une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// Logique metier - Création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
};

// Logique metier - Modification d'une sauce
exports.modifySauce = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;

        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID invalide !';
        } else {
            const sauceObject = req.file ?
                {
                    ...JSON.parse(req.body.sauce),
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                } : { ...req.body };

            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
                .catch(error => res.status(400).json({ error }));
        }
    } catch (error) {
        res.status(403).json({ error: error | 'Requête non autorisée !' })
    }
};

// Logique metier - Suppression d'une sauce
exports.deleteSauce = (req, res) => {

    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;

        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID invalide !';
        } else {
            Sauce.findOne({ _id: req.params.id })
                .then(sauce => {
                    const filename = sauce.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        Sauce.deleteOne({ _id: req.params.id })
                            .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                            .catch(error => res.status(400).json({ error }));
                    });
                })
                .catch(error => res.status(500).json({ error }));
        }
    } catch (error) {
        res.status(403).json({ error: error | 'Requête non autorisée !' })
    }
};

// Logique metier - Likes & Dislikes
exports.likeSauce = (req, res, next) => {

    let like = req.body.like;
    let userId = req.body.userId;
    let sauceId = req.params.id;

    // Like
    if (like == 1) {
        Sauce.findOne({ _id: sauceId })
            .then((sauce) => {
                if (!sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne(
                        //On récupère la sauce
                        { _id: sauceId },
                        {
                            // on incrémente le compteur des likes de 1 & on push l'userId dans le tableau 
                            $inc: { likes: 1 },
                            $push: { usersLiked: userId }
                        }
                    )
                        .then(() => res.status(200).json({ message: 'Vous avez aimé cette sauce!' }))
                        .catch((error) => res.status(400).json({ error }));
                }
            })
            .catch((error) => res.status(400).json({ error }));
    }

    // Dislike
    if (like === -1) {
        Sauce.findOne({ _id: sauceId })
            .then((sauce) => {
                if (!sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne(
                        { _id: sauceId },
                        {
                            $inc: { dislikes: 1 },
                            $push: { usersDisliked: userId }
                        }
                    )
                        .then(() => res.status(200).json({ message: 'Vous n\'avez pas aimé cette sauce!' }))
                        .catch((error) => res.status(400).json({ error }));
                }
            })
            .catch((error) => res.status(400).json({ error }));
    }

    // Annulation Like ou Dislike
    if (like === 0) {
        Sauce.findOne({ _id: sauceId })
            .then((sauce) => {
                // Si le user a déjà liké la sauce
                if (sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne(
                        { _id: sauceId },
                        {
                            //On incrémente les likes de -1 
                            $inc: { likes: -1 },
                            // On retire le user du tableau des users ayant liké
                            $pull: { usersLiked: userId }
                        }
                    )
                        .then(() => res.status(200).json({ message: 'Votre avez retiré votre Like' }))
                        .catch((error) => res.status(400).json({ error }));
                }

                // Si le user a déjà disliké la sauce
                if (sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne(
                        { _id: sauceId },
                        {
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: userId }
                        }
                    )
                        .then(() => res.status(200).json({ message: 'Votre avez retiré votre Dislike' }))
                        .catch((error) => res.status(400).json({ error }));
                }
            })
            .catch((error) => res.status(400).json({ error }));
    }
};