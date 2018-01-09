let express = require('express');
let steem = require('../modules/steemconnect')
let router = express.Router();

/* GET auth listing. */
router.get('/', (req, res, next) => {
    if (!req.query.access_token) {
        let uri = steem.getLoginURL();
        console.log(uri);
        res.redirect(uri);
    } else {
        steem.setAccessToken(req.query.access_token);
        steem.me(function(err, response) {
          console.log(response)
          res.redirect("/")
        });
    }
});

module.exports = router;
