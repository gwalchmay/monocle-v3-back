const router = require('express').Router();
const { connection } = require('../../connection');
const passport = require('../../helpers/passport');

// récupération de toutes les marques
router.get('/', (req, res) => {
    connection.query('SELECT * FROM marque ORDER BY nom', (err, results) => {
        if (err) {
            res.status(500).send('Erreur lors de la récupération de la liste des marques');
        } else {
            res.json(results);
        }
    });
});

//récupération des marques travaillées
router.get('/marques-travaillees', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user = req.user.id;
    connection.query(`SELECT * FROM marque JOIN magasin_marque ON marque.id = magasin_marque.marque_id WHERE magasin_marque.magasin_id = ${user} ORDER BY nom`, (err, results) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(results);
        }
    });
});

// récupération d'une marque'
router.get('/:marqueId', passport.authenticate('jwt-admin', { session: false }), (req, res) => {
    const id = req.params.marqueId;
    connection.query('SELECT * FROM marque WHERE id = ?', id, (err, results) => {
        if (err) {
            res.status(500).send('Erreur lors de la récupération d\'une marque');
        } else {
            res.json(results[0]);
        }
    });
});

// enregistrement des marques travaillées
router.put('/marquesselect', passport.authenticate('jwt', { session: false }), (req, res) => {
    const formData = req.body;
    const user = req.user.id;
    const values = formData.map((marque_id) => [marque_id, user]);
    const sql1 = `DELETE FROM magasin_marque WHERE magasin_id=${user}`
    const sql2 = 'INSERT INTO magasin_marque (marque_id, magasin_id) VALUES ?'
    connection.query(sql1, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else {
            connection.query(sql2, [values], (err, resp) => {
                if (err) {
                    res.status(500).send(err.message);
                } else {
                    res.json(resp);
                }
            })
        }
    });
});

//modification d'une marque
router.put('/:marqueId', passport.authenticate('jwt-admin', { session: false }), (req, res) => {
    const formData = {
        id: req.params.marqueId,
        nom: req.body.newMarque,
        fournisseur_id: req.body.entite_Id
    };
    connection.query('REPLACE INTO marque SET ?', formData, (error, results) => {
        if (error) {
            res.status(500).send(error.message);
        } else {
            res.json(results);
        }
    })
});

//suppression d'une marque
router.delete('/:marqueId', passport.authenticate('jwt-admin', { session: false }), (req, res) => {
    const id = req.params.marqueId;
    connection.query('DELETE FROM marque WHERE id = ?', id, (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send(error.message);
        } else {
            connection.query('DELETE FROM magasin_marque WHERE marque_id = ?', id, (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).send(error.message);
                } else {
                    res.json(results);
                }
                res.json(results);
            })
        }
    })
});



module.exports = router;