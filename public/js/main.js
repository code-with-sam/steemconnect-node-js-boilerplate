
// EXAMPLE - FEED PAGE
if ($('main').hasClass('feed') ) {
    steem.api.setOptions({ url: 'wss://rpc.buildteam.io' });
    steem.api.getState('/trending/', (err, result) => {

      let resultsArray = [];

      for ( post in result.content ){

        var converter = new showdown.Converter()
        var html = converter.makeHtml(result.content[post].body)

        resultsArray.push({
            id: result.content[post].id,
            title: result.content[post].title,
            author: result.content[post].author,
            body: html,
            permlink: result.content[post].permlink
        })
      }

      resultsArray = resultsArray.sort((a,b) => {
          return b.id - a.id
      });

      resultsArray.forEach( (post, i, arr) => {

        let template = `
        <div data-post-id="${post.id}">
        <h3><a href="">${post.title}</a> - ${post.author}</h3>
        <p>${ (post.body).substring(0, 250) }...</p>
        <form method="post">
        <input type="hidden" name="postId" value="${post.id}">
        <input type="hidden" name="author" value="${post.author}">
        <input type="hidden" name="permlink" value="${post.permlink}">
        <input type="submit" class="vote" value="Vote">
        </form>
        </div>`
        $('main').append(template)
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
