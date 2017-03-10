const express = require('express');
const app = express();
const config = require('./config.js');
const Twit = require('twit');
const T = new Twit(config);
const moment = require('moment');
const bodyParser = require('body-parser');


// serve the static files
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/images'));

// set up jade as templating engine
app.set('view engine', 'jade');
app.set('views', __dirname + '/templates');

// root end-point
app.get('/', function(req, res, next){
  // store all the twitter info for templating
  const twitterData = {
      title: 'Twitter Interface', //keep??
      tweets: [],
      account: [],
      following: [],
      messages: []
  }

  // API call for 5 most recent tweets
  T.get('statuses/user_timeline', { count: 5 }, function(err, data, response) {
    if (err) return next(err)
    data.forEach( function (user_tweets) {
      
      if (user_tweets.retweeted == true) {
        var tweet_like = user_tweets.retweeted_status.favorite_count
      } else {
        var tweet_like = user_tweets.favorite_count
      }
      const tweets = {
        tweets: user_tweets.text,
        retweet: user_tweets.retweet_count,
        likes: tweet_like,
        since: moment(user_tweets.created_at).format('MMM Do')
      }

      twitterData.tweets.push(tweets);


      
    }); // forEach
      // API call for user account info
      T.get('account/verify_credentials', function(err, data, response) {
        if (err) return next(err)

        const account = {
        name: data.name,
        screen_name: data.screen_name,
        following: data.friends_count,
        photo: data.profile_image_url,
        background: data.profile_banner_url
        }
      
        //console.log(account);
        T.get('friends/list', { count: 5 }, function(err, data, response) {

          const friends = data.users

          friends.forEach ( function(following_list) {
            const following = {
              name: following_list.name,
              screen_name: following_list.screen_name,
              photo: following_list.profile_image_url
              }

            
            twitterData.following.push(following);

          }); // forEach
          
          // API call for direct messages received
          T.get('direct_messages', { count: 5 }, function(err, data, response) {

            if (err) return next(err)
            data.forEach ( function(message) {
              const direct_messages = {
                name: message.sender.name,
                text: message.text,
                photo: message.sender.profile_image_url,
                time: moment(message.sender.created_at).format('MMM Do h:mm a')
              }

              twitterData.messages.push(direct_messages);
            }); // forEach
            
            res.render('index', twitterData);
          });

            

          }); // get friends

        twitterData.account.push(account);
        }); // get account

  }); // get
    
});



app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// posts to twitter account
app.post('/', function(req, res){
  T.post('statuses/update', { status: req.body.tweet }, function(err, data, response) {
  console.log(req.body, req.params)
  res.redirect('/');
  })
  
})

// error handler
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).render('error');
});

// express server
app.listen(3000, function() {
    console.log('Express server running at port 3000');
});

