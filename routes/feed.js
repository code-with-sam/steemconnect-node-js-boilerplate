let express = require('express');
let router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
    if (!req.session.steemconnect) {
      res.redirect('/auth')
    } else {
        res.render('feed', {});
    }
});

module.exports = router;
