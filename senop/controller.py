# controller.py

from . import app
from .sentiment_helpers import get_tweets, get_sentiment, calculate_polarity, \
    count_word_frequency, get_sentiment_phrase, rescale_polarity

from flask import render_template, request, jsonify
import operator

@app.route('/search', methods=['POST', 'GET'])
def search():
  if request.method == 'GET':
    return render_template('search_form.html')
  else: # POST
    json_data = request.get_json()
    if json_data:
      search_term = json_data.get('searchTerm')
    else: # remove when removing get.
      search_term = request.form['searchterm']
    app.logger.debug('Search Term: ' + search_term)

    twitter_results = get_tweets(search_term)

    app.logger.debug(twitter_results[0])

    sentiment140_queries = []
    for t in twitter_results:
      sentiment140_queries.append({
        'text': t.text,
        'twitid': t.id,
        'fav_count': t.favorite_count
      });

    sentiment140_results = get_sentiment(sentiment140_queries)

    app.logger.debug(sentiment140_results)

    scaled_sentiment = calculate_polarity(sentiment140_results['data'])
    app.logger.debug(scaled_sentiment)

    positive_tweets = \
        [r for r in sentiment140_results['data'] if r['polarity'] == 4]
    neutral_tweets = \
        [r for r in sentiment140_results['data'] if r['polarity'] == 2]
    negative_tweets = \
        [r for r in sentiment140_results['data'] if r['polarity'] == 0]

    positive_word_count = count_word_frequency(positive_tweets, search_term)
    neutral_word_count = count_word_frequency(neutral_tweets, search_term)
    negative_word_count = count_word_frequency(negative_tweets, search_term)

    positive_common_words = sorted(positive_word_count.items(),
        key = operator.itemgetter(1), reverse = True)[:app.config['COMMON_COUNT']]
    neutral_common_words = sorted(neutral_word_count.items(),
        key = operator.itemgetter(1), reverse = True)[:app.config['COMMON_COUNT']]
    negative_common_words = sorted(negative_word_count.items(),
        key = operator.itemgetter(1), reverse = True)[:app.config['COMMON_COUNT']]

    positive_tweet = sorted(positive_tweets, 
        key = lambda k: k['fav_count'], reverse = True)[0]
    positive_tweet['polarity'] = 1
    neutral_tweet = sorted(neutral_tweets,
        key = lambda k: k['fav_count'], reverse = True)[0]
    neutral_tweet['polarity'] = 0
    negative_tweet = sorted(negative_tweets, 
        key = lambda k: k['fav_count'], reverse = True)[0]
    negative_tweet['polarity'] = -1

    result_output = {}
    result_output['search_term'] = search_term
    result_output['score'] = scaled_sentiment
    result_output['mood'] = get_sentiment_phrase(scaled_sentiment)

    positive_output = {}
    positive_output['common_words'] = dict(positive_common_words)
    positive_output['popular'] = positive_tweet

    neutral_output = {}
    neutral_output['common_words'] = dict(neutral_common_words)
    neutral_output['popular'] = neutral_tweet

    negative_output = {}
    negative_output['common_words'] = dict(negative_common_words)
    negative_output['popular'] = negative_tweet

    return jsonify(results=result_output, positive=positive_output,
        neutral=neutral_output, negative=negative_output)

@app.route('/')
def homepage():
  return render_template('index.html')
