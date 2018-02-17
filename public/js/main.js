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
        <div class="item " data-url="${post.url}" data-permlink="${ post.permlink }">
          <img class="item__image " src="https://steemitimages.com/480x768/${image}" onerror="">
          <div class="item__author">
            <h1>${post.title}</h1>
            <span>@${post.author}</span>
          </div>
        </div>
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

// EXAMPLE - FEED PAGE
if ($('main').hasClass('feed') ) {

    let feedType = $('main.feed').data('feed-type')

    if(feedType === 'trending'){
      getTrending({'limit': 20 })
    } else {
      getLatest({'limit': 20 })
    }
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
