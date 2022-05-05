
//Récupération du module express
const express = require('express');

// Mise en place de Mongoose
const mongoose = require('mongoose');

// Traitement des requètes vers la route 'images'/ Accès au path de notre serveur
const path = require('path');

// Déclaration de 'app'
const app = express();

require('dotenv').config();

//Récuperation des routes pour les sauces
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');



// Connection à la base de données
mongoose.connect(process.env.SECRET_DB,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//Fonction similaire à bodyParser (extraction du body JSON pour la methode POST)
app.use(express.json());

//Mise en place des headers pour acceder à notre API depuis n'importe quelle origine (CORS)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Gestion de la source 'image' de manière statique
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


//Exportation de 'app'
module.exports = app;

