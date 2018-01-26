
// EXAMPLE - FEED PAGE
if ($('main').hasClass('feed') ) {
    let postInsert = '.feed-insert'
    let feedType = $('main.feed').data('feed-type')
    console.log(feedType)
    steem.api.setOptions({ url: 'wss://rpc.buildteam.io' });
    steem.api.getState(`/${feedType}/`, (err, result) => {

      let resultsArray = [];

      for ( post in result.content ){

        var converter = new showdown.Converter()
        var html = converter.makeHtml(result.content[post].body)
        var placeholder = document.createElement('div');
        placeholder.innerHTML = html;
        var image = placeholder.querySelector('img');
        var plainText = placeholder.textContent || placeholder.innerText || "";

        resultsArray.push({
            id: result.content[post].id,
            title: result.content[post].title,
            author: result.content[post].author,
            body: plainText,
            permlink: result.content[post].permlink,
            image: image ? image.getAttribute('src') : ''
        })
      }

      resultsArray = resultsArray.sort((a,b) => {
          return b.id - a.id
      });

      resultsArray.forEach( (post, i, arr) => {
        let template = `
            <div class="col-md-4" data-post-id="${post.id}">
              <div class="card mb-4 box-shadow">
                <img class="card-img-top" data-src="${post.image}" alt="Thumbnail [100%x225]" style="height: 225px; width: 100%; display: block;" src="${post.image}" data-holder-rendered="true">
                <div class="card-body">
                  <h5 class="card-title">${post.title}</h5>
                  <p class="card-text">${ (post.body).substring(0, 150) }..</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                      <form method="post">
                      <input type="hidden" name="postId" value="${post.id}">
                      <input type="hidden" name="author" value="${post.author}">
                      <input type="hidden" name="permlink" value="${post.permlink}">
                      <button type="button" class="btn btn-sm btn-outline-secondary vote">Vote</button>
                      </form>
                      <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        `
        $(postInsert).append(template)
      })
    });

    $('main').on('click', '.vote',(e) => {
      e.preventDefault()
      $.post({
        url: '/post/vote',
        dataType: 'json',
        data:  $(e.currentTarget).parent().serialize()
      }, (response) => {
        if (response.error) {
          $(`*[data-post-id="${response.id}"]`).children().last().after()
          .append(`<span>${response.error.error_description}</span>`)
        } else {
          $(`*[data-post-id="${response.id}"]`).children().last().after()
          .append('<span>  Voted!</span>')
        }
      })

    })
}

if ($('main').hasClass('profile') ) {
  let username = $('.profile').data('username')

  steem.api.setOptions({ url: 'wss://rpc.buildteam.io' });

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
