const router = require('express').Router();
const cors = require('cors');
const fournisseursRouter = require('./fournisseurs.routes');

const ALLOWED_ORIGINS = process.env.CLIENT_APP_ORIGIN.split(',');

const corsOptions = {
  origin: ALLOWED_ORIGINS,
};

router.use(cors(corsOptions));
router.use('/fournisseurs', fournisseursRouter);



module.exports = router;
