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
    api.vote(voter, author, permlink, weight, function (err, res) {
      console.log(err, res)
    });
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

router.post('/vote', (req, res) => {
  if (!req.session.steemconnect) {
    res.redirect('/auth')
  } else {
      let postId = req.body.postId
      let voter = req.session.steemconnect.name
      let author = req.body.author
      let permlink = req.body.permlink
      let weight = 10000

      steem.vote(voter, author, permlink, weight, function (err, steemResponse) {
        if (err) {
              res.json({
                error: error.error_description
              })
        } else {
          res.json({
            name: req.session.steemconnect.name,
            msg: 'voted!',
            id: postId
          })
        }

      });

  }
})

module.exports = router;
