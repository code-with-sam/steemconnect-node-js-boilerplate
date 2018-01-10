let express = require('express');
let util = require('../modules/util');
let steem = require('../modules/steemconnect')
let router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
    if (!req.session.steemconnect) {
      res.redirect('/auth')
    } else {
      console.log(req.session.steemconnect)
        res.render('post', {
          name: req.session.steemconnect.name
        });
    }
});

router.post('/create-post', (req, res) => {
  if (!req.session.steemconnect) {
    res.redirect('/auth')
  } else {
    console.log(req.body)
    console.log(req.session.steemconnect.name)

    let author = req.session.steemconnect.name
    let permlink = util.urlString()
    var tags = req.body.tags.split(',').map(item => item.trim());
    let primaryTag = tags[0] || 'photography'
    let otherTags = tags.slice(1)
    let title = req.body.title
    let body = req.body.post

    steem.comment('', primaryTag, author, permlink, title, body, '', (err, steemResponse) => {
        console.log(err, steemResponse)
        let msg;
        if (err) {
            let msg = `Post Failed ${err}`
        } else {
            let msg = 'Posted To the Steem Network'
        }

        res.render('post', {
          name: req.session.steemconnect.name,
          msg: msg
        })
    });

  }
});

module.exports = router;
