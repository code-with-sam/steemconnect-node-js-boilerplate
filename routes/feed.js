let express = require('express');
let util = require('../modules/util');
let router = express.Router();

/* GET users listing. */
router.get('/:feed?', util.isAuthenticated, (req, res, next) => {
    let feed = req.params.feed
    console.log(feed)
    res.render('feed', {
      feed: feed
    });
});

module.exports = router;
