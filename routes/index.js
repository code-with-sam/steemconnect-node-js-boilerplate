let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) =>  {
  if(req.session.steemconnect){
    res.redirect('/user')
  } else {
    res.render('index', { title: 'SteemConnect V2 Boilerplate' });
  }
});

router.get('/@:username?', (req, res, next) => {
      let username = req.params.username
      console.log(username)
      res.render('profile', {
        name: username
      });
});

router.get('/@:username/:permlink', (req, res, next) => {
      let username = req.params.username
      let permlink = req.params.permlink
      console.log(username)
      res.render('single', {
        username: username,
        permlink: permlink
      });
});

module.exports = router;
