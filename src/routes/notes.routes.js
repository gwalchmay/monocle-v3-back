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

//récupération des représentants d'un fournisseur
router.get('/representant/:type/:fournisseur', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user = req.user.id;
    const fournisseur = req.params.fournisseur;
    const type = req.params.type;
    connection.query(`SELECT * FROM magasin_fournisseur_representant WHERE magasin_id = ${user} AND fournisseur_id = ${fournisseur} AND fournisseur_type = ${type}`, (err, results) => {
        if (err) {
            res.status(500).send(err.message);
            console.log(err.message);
        } else {
            res.json(results);
        }
    });
});
//ajout d'un représentant à un fournisseur
router.put('/representant/:fournisseur', passport.authenticate('jwt', { session: false }), (req, res) => {
    const formData = {
        magasin_id: req.user.id,
        fournisseur_id: req.params.fournisseur,
        fournisseur_type: req.body.fournisseur_type,
        marque_nom: req.body.marque_nom,
        representant_nom: req.body.representant_nom,
        representant_telephone: req.body.representant_telephone,
        representant_email: req.body.representant_email
    }
    connection.query('INSERT INTO magasin_fournisseur_representant SET ?', formData, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else {
            res.json(results);
        }
    })
});

//suppression d'un représentant
router.delete('/representant/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const id = req.params.id;
    connection.query(`DELETE FROM magasin_fournisseur_representant WHERE id = ? `, id, (err) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.sendStatus(200);
        }
    });
});



module.exports = router;