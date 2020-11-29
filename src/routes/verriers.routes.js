const router = require('express').Router();
const { connection } = require('../../connection');

// récupération de tous les verriers
router.get('/', (req, res) => {
    connection.query('SELECT id, nom FROM verrier ORDER BY nom', (err, results) => {
        if (err) {
            res.status(500).send('Erreur lors de la récupération de la liste des verriers');
        } else {
            res.json(results);
        }
    });
});

// récupération d'un seul verrier avec ses agences
router.get('/:verrier', (req, res) => {
    const idVerrier = req.params.verrier;
    connection.query('SELECT f.*, v.nom, v.site_url FROM fournisseur_verres_adresse f JOIN verrier v ON f.fournisseur_verre_id = v.id WHERE v.id = ? ORDER BY f.adresse_ville', idVerrier, (err, results) => {
        if (err) {
            res.status(500).send('Erreur lors de la récupération du verrier');
        } else {
            res.json(results);
        }
    });
});


module.exports = router;