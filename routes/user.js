let express = require('express');
let router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
    if (!req.session.steemconnect) {
      res.redirect('/auth')
    } else {
      let userMetadata = JSON.parse(req.session.steemconnect.json_metadata)
      res.render('user', {
        name: req.session.steemconnect.name,
        about: userMetadata.profile.about,
        profileImage: userMetadata.profile.profile_image
      });
    }
});

module.exports = router;
