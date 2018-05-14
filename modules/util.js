module.exports.urlString = () => {
    let string = ''
    let allowedChars = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 32; i++){
      string += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
    }
    return string;
}

module.exports.isAuthenticated = (req, res, next) => {
  if (req.session.access_token)
      return next();

  res.redirect('/');
}

module.exports.isAuthenticatedJSON = (req, res, next) => {
  if (req.session.access_token)
      return next();

  res.json({ error: { error_description: 'Please Sign In' }})
}

module.exports.setUser = (req, res, next) => {
  if(req.session.steemconnect){
    let metadata = {};
    if (req.session.steemconnect.json_metadata === '{}') {
      metadata.profile = { about: '', profile_image: ''}
    } else {
      metadata = JSON.parse(req.session.steemconnect.json_metadata)
    }
    res.locals.user =  {
      name: req.session.steemconnect.name,
      profile: metadata.profile
    }
  }
  next();
}
