# Boilerplate
This project is a boilerplate for rapid development on top of the steem network. This project is a starting point and is not intended to be feature complete or na off-the-self app.

## What does it include
This boilerplate includes.
- Authenticate with SteemConnect/Logout
- Trending + Latest post feeds
- @username profile Page
- @username Transfers Page
- Logged-In user 'my blog' feed
- Create Top Level Post
- Upvote Top Level Post
- Single Page for posts + Comments Thread

## Setup & Install
- install node.js & NPM - [https://nodejs.org/en/](https://nodejs.org/en/)
- clone repo
- Go to [https://v2.steemconnect.com/dashboard](https://v2.steemconnect.com/dashboard) and create a new app, it currently costs 3 STEEM.
- add the Redirect URI - http://localhost:3000/auth/
- open ```config.example.js``` and rename to ```config.js``` enter your ```client_id``` from steemconnect and redirect uri to 'http://localhost:3000/auth/', update the session secret to a new secure random string
- npm install // to download dependencies
- npm start // run the project on default port 3000
- navigate to localhost:3000 in your browser
- click on the blue 'login with steemconnect to authenticate your app'

## Screenshots 💻
<img width="1440" alt="single-post" src="https://user-images.githubusercontent.com/34964560/39480491-4fc51d18-4d60-11e8-88c7-8a4fc6ae8a90.png">
<img width="1440" alt="transfers" src="https://user-images.githubusercontent.com/34964560/39480489-4faf6e32-4d60-11e8-800d-9d1d349146b2.png">
<img width="1440" alt="create-post" src="https://user-images.githubusercontent.com/34964560/39480492-4fdb4aca-4d60-11e8-857f-2567804cbc51.png">
<img width="1440" alt="user" src="https://user-images.githubusercontent.com/34964560/39480493-4ff2f15c-4d60-11e8-87b7-c165a364a5b1.png">
<img width="1440" alt="feed" src="https://user-images.githubusercontent.com/34964560/39480494-5010411c-4d60-11e8-818f-22cb489d68b1.png">
<img width="1440" alt="index" src="https://user-images.githubusercontent.com/34964560/39480495-502ac4ec-4d60-11e8-8c27-04f24b89e3e2.png">


### Dependencies
- [Moment JS](https://momentjs.com/)
- [Showdown JS](http://showdownjs.com/)
- [jQuery](https://jquery.com/)
- [Steem](https://github.com/steemit/steem-js)

I recommend incorporating your package manager of choice and bundling these together for production.

### Frequently asked Questions

#### why no css framework or SCSS

The included css and use of bootstrap is intended to be as minimal as possible and only to help demonstrate the completed features. You should restructure the examples using your framework or styling methodology of choice. Refraining from building completely on-top of a framework keeps this project open to as many users as possible.

#### Can the STEEM API calls be moved to the backend?
Yes. You'll notice many of the API calls are fired from a page specific tag on the ```<main>``` element. This is to demonstrate which views need which information from the STEEM api and not necessarily the design pattern you have to follow.

#### How do I specify a specific tag for my app e.g ‘book-review’, ‘meme’, ‘photography’
When making calls to the STEEM API you will need to additional filter by your specific tag. e.g
```
function getTrending(query, initial){
  steem.api.getDiscussionsByTrending(query, (err, result) => {
    if (err) return console.log(err);
    result = result.filter(post => post.parent_permlink === 'review')
    displayContent(result,initial)
    getaccounts(result.map(post => post.author))
  });
}
```
Note you will need to query the steem API for many more posts depending on the frequency of your tags appearance.

#### How do I make sure only posts from my app show up?
Many apps opt to maintain their own database for a reference to posts created on their platforms specifically. Alternatively you can check the custom JSON data associated with posts. (/routes/post.js) You'll notice we are specifying the custom data ```'boilerplate.app'``` this can be checked when querying STEEM API as with the Tag example above. This second option is not bulletproof and people could submit posts via tools like steem.js with your app name easily.
