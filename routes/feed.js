let express = require('express');
let util = require('../modules/util');
let router = express.Router();

/* GET a feed page. */
router.get('/:feed/:tag?', (req, res, next) => {
    let feed = req.params.feed
    let tag = req.params.tag
    res.render('feed', {
      feed: feed,
      tag: tag || ''
    });
});

module.exports = router;
