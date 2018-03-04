let express = require('express');
let util = require('../modules/util');
let router = express.Router();

/* GET users listing. */
router.get('/', util.isAuthenticated, (req, res, next) => {
      let userMetadata = {};
      if (req.session.steemconnect.json_metadata == '' || req.session.steemconnect.json_metadata === undefined) {
        userMetadata.profile = { about: ''}
      } else {
        userMetadata = JSON.parse(req.session.steemconnect.json_metadata)
      }
      res.render('dashboard', {
        name: req.session.steemconnect.name,
        about: userMetadata.profile.about,
        profileImage: userMetadata.profile.profile_image
      });
});

module.exports = router;
