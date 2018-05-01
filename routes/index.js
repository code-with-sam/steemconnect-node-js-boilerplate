let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) =>  {
  if(req.session.steemconnect){
    res.redirect(`/@${req.session.steemconnect.name}`)
  } else {
    res.render('index', { title: 'SteemConnect Boilerplate' });
  }
});

/* GET a users blog profile page. */
router.get('/@:username', (req, res, next) => {
      let username = req.params.username
      res.render('profile', {
        username: username
      });
});

/* GET a users blog feed page. */
router.get('/@:username/feed', (req, res, next) => {
      let username = req.params.username
      res.render('feed', {
        feed: 'user-feed',
        username: username
      });
});

/* GET a users transfers profile page. */
router.get('/@:username/transfers', (req, res, next) => {
      let username = req.params.username
      res.render('transfers', {
        username: username,
        user: req.session.steemconnect ? req.session.steemconnect.name : ''
      });
});

/* GET a single post page page. */
router.get('/:category/@:username/:permlink', (req, res, next) => {
      let category = req.params.category
      let username = req.params.username
      let permlink = req.params.permlink
      res.render('single', {
        category: category,
        username: username,
        permlink: permlink
      });
});

module.exports = router;
