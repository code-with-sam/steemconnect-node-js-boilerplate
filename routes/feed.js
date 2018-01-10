let express = require('express');
let util = require('../modules/util');
let router = express.Router();

/* GET users listing. */
router.get('/', util.isAuthenticated, (req, res, next) => {
    res.render('feed', {});
});

module.exports = router;
