const express = require('express');
const app = express();
const config = require('./config.js');
const Twit = require('twit');
const T = new Twit(config);


const twitterData = {
    title: 'Twitter Interface' //keep??
}

app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/images'));

app.set('view engine', 'jade');
app.set('views', __dirname + '/templates');

app.get('/', function(req, res){
    res.render('index', twitterData);
});

// tweets = T.get('search/tweets', { q: 'banana since:2011-07-11', count: 10 }, function(err, data, response) {
//   console.log(data);
// });

tweets = T.get('statuses/home_timeline', { count: 5 }, function(err, data, response) {
  console.log(data);
});

app.get('/tweets', function(req, res){
    res.send(tweets_2);
});

app.listen(3000, function() {
    console.log('Express server running at port 3000');
});

tweets_2 = T.get('account/verify_credentials', { skip_status: true })
  .catch(function (err) {
    console.log('caught error', err.stack)
  })
  .then(function (result) {
    // `result` is an Object with keys "data" and "resp".
    // `data` and `resp` are the same objects as the ones passed
    // to the callback.
    // See https://github.com/ttezel/twit#tgetpath-params-callback
    // for details.

    console.log('data', result.data);
  })