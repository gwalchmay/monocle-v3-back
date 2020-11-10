const router = require('express').Router();
const { connection } = require('../../connection');
const passport = require('../../helpers/passport');

//récupération d'une note mutuelle
router.get('/mutuelle/:mutuelle', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user = req.user.id;
    const mutuelle = req.params.mutuelle;
    connection.query(`SELECT * FROM magasin_mutuelle_infos WHERE magasin_id = ${user} AND mutuelle_id = ${mutuelle}`, (err, results) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(results[0]);
        }
    });
});

//récupération d'une note fournisseur
router.get('/:type/:fournisseur', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user = req.user.id;
    const fournisseur = req.params.fournisseur;
    const type = req.params.type;
    connection.query(`SELECT * FROM magasin_fournisseur_infos WHERE magasin_id = ${user} AND fournisseur_id = ${fournisseur} AND fournisseur_type = ${type}`, (err, results) => {
        if (err) {
            res.status(500).send(err.message);
            console.log(err.message);
        } else {
            res.json(results[0]);
        }
    });
});

//enregistrement d'une note mutuelle
router.put('/mutuelle/:mutuelle', passport.authenticate('jwt', { session: false }), (req, res) => {
    const formData = {
        magasin_id: req.user.id,
        mutuelle_id: req.params.mutuelle,
        notes: req.body.newNote
    }
    connection.query('REPLACE INTO magasin_mutuelle_infos SET ?', formData, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else {
            res.json(results);
        }
    })
});

//enregistrement d'une note fournisseur
router.put('/fournisseur/:fournisseur', passport.authenticate('jwt', { session: false }), (req, res) => {
    const formData = {
        magasin_id: req.user.id,
        fournisseur_id: req.params.fournisseur,
        fournisseur_type: req.body.type,
        code_client: req.body.codeClient,
        notes: req.body.newNote,
        agence_favorite: req.body.agenceFavorite
    }
    connection.query('REPLACE INTO magasin_fournisseur_infos SET ?', formData, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else {
            res.json(results);
        }
    })
});



module.exports = router;