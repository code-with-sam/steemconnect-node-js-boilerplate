# boilerplate
This project is a boilerplate for rapid development ontop of the steem network.

## What does it include
This boilerplate includes.
- Authenticate with SteemConnect/Logout
- Trending + latest post feeds
- Logged In user profile + 'my blog' feed
- @username page with profile info + blog feed
- Create Top Level Post
- Upvote Top Level Post from feed
- Single Page for posts + comments thread
- Upvote + comment on single page

## setup & install
- install node.js & NPM - [https://nodejs.org/en/](https://nodejs.org/en/)
- clone repo
- Go to [https://v2.steemconnect.com/dashboard](https://v2.steemconnect.com/dashboard) and create a new app, it currently costs 3 STEEM.
- add the Redirect URI - http://localhost:3000/auth/
- open ```config.example.js``` and rename to ```config.js``` enter your ```client_id``` from steemconnect and redirect uri to 'http://localhost:3000/auth/', update the session secret to a new secure random string
- npm install // to download dependencies
- npm start // run the project on default port 3000
- navigate to localhost:3000 in your browser
- click on the blue 'login with steemconnect to authenticate your app'

![LOGIN](https://i.imgsafe.org/66/6654933f96.png)
![USER PROFILE](https://i.imgsafe.org/66/6654936f6a.png)
![FEED](https://i.imgsafe.org/66/665480732c.png)
![CREATE POST](https://i.imgsafe.org/66/66547d678e.png)
