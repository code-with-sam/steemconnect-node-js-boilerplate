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

module.exports = router;
