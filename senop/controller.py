# controller.py

from . import app
from .sentiment_helpers import get_tweets, get_sentiment, calculate_polarity, \
    count_word_frequency

from flask import render_template, request, jsonify

@app.route('/search', methods=['POST', 'GET'])
def search():
  if request.method == 'GET':
    return render_template('search_form.html')
  else: # POST
    search_term = request.form['searchterm']
    app.logger.debug('Search Term: ' + search_term)

    twitter_results = get_tweets(search_term)

    sentiment140_queries = []
    for t in twitter_results:
      sentiment140_queries.append({'text': t.text});

    sentiment140_results = get_sentiment(sentiment140_queries)

    app.logger.debug(sentiment140_results)

    scaled_sentiment = calculate_polarity(sentiment140_results['data'])
    app.logger.debug(scaled_sentiment)

    return jsonify(results=search_term)

@app.route('/')
def homepage():
  return render_template('index.html')
