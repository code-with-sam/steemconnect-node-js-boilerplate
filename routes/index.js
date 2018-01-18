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

module.exports = router;
