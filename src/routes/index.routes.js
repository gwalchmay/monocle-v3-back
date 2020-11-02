const router = require('express').Router();
const cors = require('cors');
const fournisseursRouter = require('./fournisseurs.routes');
const verriersRouter = require('./verriers.routes');
const lentillesRouter = require('./lentilles.routes');
const mutuellesRouter = require('./mutuelles.routes');
const authRouter = require('./auth.routes');
const marquesRouter = require('./marques.routes');

const ALLOWED_ORIGINS = process.env.CLIENT_APP_ORIGIN.split(',');

const corsOptions = {
  origin: ALLOWED_ORIGINS,
};

router.use(cors(corsOptions));
router.use('/fournisseurs', fournisseursRouter);
router.use('/mutuelles', mutuellesRouter);
router.use('/verriers', verriersRouter);
router.use('/lentilles', lentillesRouter);
router.use('/auth', authRouter);
router.use('/marques', marquesRouter);


module.exports = router;
