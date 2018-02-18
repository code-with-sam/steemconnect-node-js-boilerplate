let express = require('express');
let util = require('../modules/util');
let steem = require('../modules/steemconnect')
let router = express.Router();


router.get('/', util.isAuthenticated, (req, res, next) => {
    res.render('post', {
      name: req.session.steemconnect.name
    });
});

router.post('/create-post', util.isAuthenticated, (req, res) => {
    let author = req.session.steemconnect.name
    let permlink = util.urlString()
    var tags = req.body.tags.split(',').map(item => item.trim());
    let primaryTag = tags[0] || 'photography'
    let otherTags = tags.slice(1)
    let title = req.body.title
    let body = req.body.post

    steem.comment('', primaryTag, author, permlink, title, body, '', (err, steemResponse) => {
        if (err) {
          res.render('post', {
            name: req.session.steemconnect.name,
            msg: 'Error'
          })
        } else {
          res.render('post', {
            name: req.session.steemconnect.name,
            msg: 'Posted To Steem Network'
          })
        }
    });
});

router.post('/vote', util.isAuthenticated, (req, res) => {
    let postId = req.body.postId
    let voter = req.session.steemconnect.name
    let author = req.body.author
    let permlink = req.body.permlink
    let weight = 10000

    steem.vote(voter, author, permlink, weight, function (err, steemResponse) {
      if (err) {
          res.json({ error: err.error_description })
      } else {
          res.json({ id: postId })
      }
    });
})


router.post('/comment',  util.isAuthenticated, (req, res) => {

    let author = req.session.steemconnect.name
    let permlink = req.body.parentPermlink + '-' + util.urlString()
    let title = 'RE: ' + req.body.parentTitle
    let body = req.body.message
    let parentAuthor = req.body.parentAuthor
    let parentPermlink = req.body.parentPermlink
    steem.comment(parentAuthor, parentPermlink, author, permlink, title, body, '', (err, steemResponse) => {
      if (err) {
        res.json({ error: err.error_description })
      } else {
        res.json({
          msg: 'Posted To Steem Network',
          res: steemResponse
        })
      }
    });
});

module.exports = router;
