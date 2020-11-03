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



module.exports = router;