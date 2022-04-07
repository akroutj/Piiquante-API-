
//Récupération du module express
const express = require('express');

// Mise en place de Mongoose
const mongoose = require('mongoose');

// Déclaration de 'app'
const app = express();

//Récuperation des routes pour les sauces
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

// Connection à la base de données
mongoose.connect('mongodb+srv://AKjulian:Piiquante@cluster0.ezvvq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
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

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

//Exportation de 'app'
module.exports = app;