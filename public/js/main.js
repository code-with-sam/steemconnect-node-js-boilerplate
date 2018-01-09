
if ($('main').hasClass('feed') ) {
    steem.api.setOptions({ url: 'wss://rpc.buildteam.io' });
    steem.api.getState('/trending/', (err, result) => {
      console.log(err, result);

      for ( post in result.content ){
        console.log(post);
        let template = `
        <div>
        <h3><a href="">${result.content[post].title}</a> - ${result.content[post].author}</h3>
        <p></p>
        <p>${ (result.content[post].body).substring(0, 250) }...</p>
        </div>
        `
        $('main').append(template)

      }
    });
}
