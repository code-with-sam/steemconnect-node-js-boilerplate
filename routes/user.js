let express = require('express');
let router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
    if (!req.session.steemconnect) {
      res.redirect('/auth')
    } else {
      let userMetadata = {};
      if (req.session.steemconnect.json_metadata == '' || req.session.steemconnect.json_metadata === undefined) {
        userMetadata.profile = { about: ''}
        console.log(userMetadata)
      } else {
        userMetadata = JSON.parse(req.session.steemconnect.json_metadata)
        console.log(userMetadata)
      }

      res.render('user', {
        name: req.session.steemconnect.name,
        about: userMetadata.profile.about,
        profileImage: userMetadata.profile.profile_image
      });
    }
});

module.exports = router;
