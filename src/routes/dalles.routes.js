const router = require('express').Router();
const { connection } = require('../../connection');
const passport = require('../../helpers/passport');

//récupération des dalles d'un utilisateur
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user = req.user.id;
    connection.query(`SELECT * FROM accueil_dalle WHERE magasin_id = ${user} ORDER BY position`, (err, results) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(results);
        }
    });
});

//enregistrement d'une nouvelle dalle
router.put('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const formData = req.body;
    const request = { magasin_id: req.user.id, ...formData };
    connection.query('INSERT INTO accueil_dalle SET ?', request, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else {
            res.json(results);
        }
    })
});

//suppression d'une dalle
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const idDalle = req.params.id;
    connection.query('DELETE FROM accueil_dalle WHERE id = ?', idDalle, (err) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.sendStatus(200);
        }
    });
});

module.exports = router;