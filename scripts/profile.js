const fs = require('fs');
const tweetsArray = [
  {
    user: {
      created_at: '2020-04-20T15:55:33.000Z',
      default_profile_image: false,
      description:
        "Man, Husband, Father, Uncle. C-in-C of Àgbàfians. We all know what we're doing. Reality-based. The truth hurts & heals. Insults=Block. #agbainfluencer.\n\nNo DMs⛔",
      fast_followers_count: 0,
      favourites_count: 744854,
      followers_count: 231344,
      friends_count: 4239,
      has_custom_timelines: true,
      is_translator: false,
      listed_count: 369,
      location: '',
      media_count: 5461,
      name: 'Àgbà',
      normal_followers_count: 231344,
      possibly_sensitive: false,
      profile_banner_url:
        'https://pbs.twimg.com/profile_banners/1252264586201518083/1689078327',
      profile_image_url_https:
        'https://pbs.twimg.com/profile_images/1677165323114381313/KuK1sL63_normal.jpg',
      screen_name: 'jon_d_doe',
      statuses_count: 90062,
      translator_type: 'none',
      verified: false,
      withheld_in_countries: [],
      id_str: '1252264586201518083',
    },
    id: '1626688710413635586',
    conversation_id: '1626688710413635586',
    full_text:
      "When I got married, we had no chairs, bed frame or more than a car.\n\nNo ACs in the rooms/parlour.\n\nThings that were in abundance in my father's house.\n\nBut it was a 3 bed apartment and it was fully paid by me.\n\nMy wife came with equipment to fill the kitchen.\n\nThe kitchen was the",
    reply_count: 501,
    retweet_count: 3598,
    favorite_count: 12024,
    hashtags: [],
    symbols: [],
    user_mentions: [],
    urls: [],
    media: [],
    url: 'https://twitter.com/jon_d_doe/status/1626688710413635586',
    created_at: '2023-02-17T21:03:05.000Z',
    view_count: 1166857,
    quote_count: 173,
    is_quote_tweet: false,
    is_retweet: false,
    is_pinned: false,
    is_truncated: false,
    startUrl: 'https://twitter.com/jon_d_doe/with_replies',
  },
  {
    user: {
      created_at: '2022-04-24T15:37:11.000Z',
      default_profile_image: false,
      description: 'Buharist, APC member, @manutd fan',
      fast_followers_count: 0,
      favourites_count: 434,
      followers_count: 55917,
      friends_count: 1415,
      has_custom_timelines: true,
      is_translator: false,
      listed_count: 36,
      location: '',
      media_count: 4568,
      name: 'Imran Muhammad',
      normal_followers_count: 55917,
      possibly_sensitive: false,
      profile_banner_url:
        'https://pbs.twimg.com/profile_banners/1518252654346051587/1650815014',
      profile_image_url_https:
        'https://pbs.twimg.com/profile_images/1633635748099371008/EIE_fh7U_normal.jpg',
      screen_name: 'Imranmuhdz',
      statuses_count: 7748,
      translator_type: 'none',
      verified: false,
      withheld_in_countries: [],
      id_str: '1518252654346051587',
    },
    id: '1576477142828752899',
    conversation_id: '1576477142828752899',
    full_text:
      'Alhamdulillah! Allah has blessed me with baby boy. Both the mother and boy are in good condition.',
    reply_count: 778,
    retweet_count: 337,
    favorite_count: 6806,
    hashtags: [],
    symbols: [],
    user_mentions: [],
    urls: [],
    media: [],
    url: 'https://twitter.com/Imranmuhdz/status/1576477142828752899',
    created_at: '2022-10-02T07:40:15.000Z',
    quote_count: 55,
    is_quote_tweet: false,
    is_retweet: false,
    is_pinned: false,
    is_truncated: false,
    startUrl: 'https://twitter.com/Imranmuhdz/with_replies',
  },
];

const usersObject = tweetsArray.reduce((acc, tweet) => {
  const screenName = tweet.user.screen_name;
  acc[screenName] = tweet.user;
  return acc;
}, {});

const jsonContent = JSON.stringify(usersObject, null, 2); // The second and third parameters pretty-print the JSON

fs.writeFile('data/authors.json', jsonContent, 'utf8', (err) => {
  if (err) {
    console.log(
      'An error occurred while writing the JSON object to the file:',
      err,
    );
  } else {
    console.log('JSON file has been saved successfully!');
  }
});
