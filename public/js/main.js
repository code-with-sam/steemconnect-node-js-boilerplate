let allUsers = []
let allContent = []
let converter = new showdown.Converter({ tables: true })

function getTrending(query, initial){
  steem.api.getDiscussionsByTrending(query, (err, result) => {
    if (err === null) {
      displayContent(result,initial)
      getaccounts(result.map(post => post.author))
    } else {
      console.log(err);
    }
  });
}

function getLatest(query, initial){

  steem.api.getDiscussionsByCreated(query, (err, result) => {
    if (err === null) {
      displayContent(result, initial)
      getaccounts(result.map(post => post.author))
    } else {
      console.log(err);
    }
  });
}

function getMoreContent(filter, tag){
  let lastItem = allContent[allContent.length - 1]
  let query = {
      'tag':
      tag,
      'limit': 24,
      start_author: lastItem.author,
      start_permlink: lastItem.permlink }

      if(filter === 'trending'){
        getTrending(query, false)
      } else {
        getLatest(query, false)
      }
}

function displayContent(result, initial){
  if (!initial) result.shift()
  for (let i = 0; i < result.length ; i++) {
      let post = result[i];
      allContent.push(post)

      var urlRegex = /(https?:\/\/[^\s]+)/g;
      post.body = post.body.replace(urlRegex, (url) => {
        let last = url.slice(-3)
        if ( last === 'jpg' || last === 'png' || last === 'jpe' || last === 'gif' )  {
          return '<img src="' + url + '">';
        } else { return url }
      })

      if( typeof JSON.parse(post.json_metadata).image === 'undefined' ){
        image = genImageInHTML(post.body)
      } else {
        image = JSON.parse(post.json_metadata).image[0]
      }

      let itemTemplate = `
      <a href="${post.url}">
        <div class="item " data-url="${post.url}" data-permlink="${ post.permlink }">
          <img class="item__image " src="https://steemitimages.com/480x768/${image}" onerror="">
          <div class="item__author">
            <h1>${post.title}</h1>
            <span>@${post.author}</span>
          </div>
        </div>
        </a>
        `
        $('.feed-insert').append(itemTemplate)
  }
}

function getaccounts(usernames){
  steem.api.getAccounts(usernames, (err, result) => {
    allUsers = allUsers.concat(result)
  })
}

function genImageInHTML(markdown){
    let placeholder = document.createElement('div');
    placeholder.innerHTML = converter.makeHtml(markdown)
    let image = placeholder.querySelector('img') ;
    if (image) {
      return image.src
    } else {
      return false
    }
}

function getPostAndComments(url) {
  steem.api.getState(url, (err, result) => {
    let users = result.accounts;
    let resultsArray = [];
    for ( post in result.content ){

      var html = result.content[post].body

      resultsArray.push({
        id: result.content[post].id,
        title: result.content[post].root_title,
        author: result.content[post].author,
        body: html,
        json: result.content[post].json_metadata,
        permlink: result.content[post].permlink,
        depth: result.content[post].depth,
        root_comment: result.content[post].root_comment,
        parent_permlink: result.content[post].parent_permlink,
        created: result.content[post].created,
        votes: result.content[post].net_votes,
        voters: result.content[post].active_votes.map(vote => vote.voter),
        value: Math.round( parseFloat(result.content[post].pending_payout_value.substring(0,5)) * 100) / 100
      })
    }

    // Sort By Date/ID
    resultsArray = resultsArray.sort((a,b) => {
      return b.id - a.id
    });

    // Find Deepest Comment
    let maxDepthComment = resultsArray.reduce((prev, current) => {
      return (prev.depth > current.depth) ? prev : current
    })

    // Multi demention array by
    let resultsByDepth = [];
    for (var i = 0; i < maxDepthComment.depth + 1; i++) {
      resultsByDepth.push(resultsArray.filter(elem => {
        return elem.depth === i
      }))
    }
    appendSinglePost(resultsByDepth[0][0], users)

  })
}

function generateProfileImage(author){
  let profileImage = 'img/default-user.jpg';

  try {
    if (author.json_metadata === '' || typeof author.json_metadata === 'undefined' ) {
      author.json_metadata = { profile_image : false }
    } else {
      author.json_metadata = JSON.parse(author.json_metadata).profile
    }

    profileImage = author.json_metadata.profile_image ? 'https://steemitimages.com/128x128/' + author.json_metadata.profile_image : '';

  } catch(err){
    console.log(err)
  }
  return profileImage
}

function appendSinglePost(post, users){
  let author = users[post.author]
  console.log(author)
  let html = converter.makeHtml(post.body)
  let profileImage = generateProfileImage(author)

  let tags = JSON.parse(post.json).tags.reduce( (all,tag) => all + `<span>${tag}</span>`, '')
  let header = `
    <img src="${profileImage}" class="author-img" width="35" height="35" src="">
    <span class="overlay__author-username">@${post.author}</span>
    ${tags}
    <h1 class="title">${post.title}</h1>
  `
  $('main').append(header + html)
}

// ----------------------------------------------------

if ($('main').hasClass('feed') ) {

    let feedType = $('main.feed').data('feed-type')

    if(feedType === 'trending'){
      getTrending({'limit': 20 })
    } else {
      getLatest({'limit': 20 })
    }
}

if ($('main').hasClass('single')) {
  let data = $('main').data()
  getPostAndComments(`/${data.category}/@${data.username}/${data.permlink}`)
}


if ($('main').hasClass('profile') ) {
  let username = $('.profile').data('username')


  let totalVestingShares, totalVestingFundSteem;

  steem.api.getDynamicGlobalProperties((err, result) => {
    totalVestingShares = result.total_vesting_shares;
    totalVestingFundSteem = result.total_vesting_fund_steem;
  })

  steem.api.getAccounts([username], (err, result) => {

    let user = result[0]

    // store meta Data
    let jsonData = user.json_metadata ? JSON.parse(user.json_metadata).profile : {}
    // steem power calc
    let vestingShares = user.vesting_shares;
    let delegatedVestingShares = user.delegated_vesting_shares;
    let receivedVestingShares = user.received_vesting_shares;
    let steemPower = steem.formatter.vestToSteem(vestingShares, totalVestingShares, totalVestingFundSteem);
    let delegatedSteemPower = steem.formatter.vestToSteem((receivedVestingShares.split(' ')[0])+' VESTS', totalVestingShares, totalVestingFundSteem);
    let outgoingSteemPower = steem.formatter.vestToSteem((receivedVestingShares.split(' ')[0]-delegatedVestingShares.split(' ')[0])+' VESTS', totalVestingShares, totalVestingFundSteem) - delegatedSteemPower;

    // vote power calc
    let lastVoteTime = (new Date - new Date(user.last_vote_time + "Z")) / 1000;
    let votePower = user.voting_power += (10000 * lastVoteTime / 432000);
    votePower = Math.min(votePower / 100, 100).toFixed(2);

    let data = {
      name: user.name,
      image: jsonData.profile_image ? 'https://steemitimages.com/2048x512/' + jsonData.profile_image : '',
      rep: steem.formatter.reputation(user.reputation),
      effectiveSp: parseInt(steemPower  + delegatedSteemPower - -outgoingSteemPower),
      sp: parseInt(steemPower).toLocaleString(),
      delegatedSpIn: parseInt(delegatedSteemPower).toLocaleString(),
      delegatedSpOut: parseInt(-outgoingSteemPower).toLocaleString(),
      vp: votePower,
      steem: user.balance.substring(0, user.balance.length - 5),
      sbd: user.sbd_balance.substring(0, user.sbd_balance.length - 3),
      numOfPosts: user.post_count,
      followerCount: '',
      followingCount: '',
      usdValue: '',
      createdDate: new Date (user.created)
    }


  steem.api.getFollowCount(user.name, function(err, result){
    data.followerCount = result.follower_count
    data.followingCount = result.following_count
  })


  data.usdValue = steem.formatter.estimateAccountValue(user)


  console.log(data)

  let template =
  `
  <section class="profile">
    <h2>${data.name} - ${data.rep}</h2>
    <img src="${data.image}">
  </section>
  `

  $('main').append(template)




  })
}
