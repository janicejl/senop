# sentiment_helpers.py

from . import app, twapi
from .english_prepositions import prepositions
import tweepy
import datetime
import urllib2,json
from flask import jsonify

def rescale_polarity(num):
  return float((num) * 0.25)

def get_sentiment_phrase(sentimentNum):
  if sentimentNum < 0.4:
    return "negative"
  elif sentimentNum > 0.6:
    return "positive"
  else:
    return "neutral"

def get_tweets(search_term):
  # since 1 week ago
  week_ago = (datetime.datetime.now() - datetime.timedelta(days=7)).date()
  qualifier = ' since:%d-%d-%d' % (week_ago.year,
      week_ago.month, week_ago.day)
  search_term += qualifier
  print search_term
  twitter_results = []

  for t in tweepy.Cursor(twapi.search,
    q=search_term, lang='en').items(app.config['MAX_TWEETS']):
    if t.lang == 'en':
      twitter_results.append(t)

  return twitter_results

def get_sentiment(tweets):
  json_query = json.dumps({ 'language': 'en',
    'data' : tweets })

  url = 'http://www.sentiment140.com/api/bulkClassifyJson?appid=chuxtina@gmail.com'
  req = urllib2.Request(url)
  req.add_header('Content-Type', 'application/json')

  response = urllib2.urlopen(req, json_query)
  response_data = json.load(response, "latin-1")

  return response_data

def calculate_polarity(sentiment_result):
  polarity = 0.0
  numTweets = len(sentiment_result)
  for r in sentiment_result:
    polarity+=r['polarity']
  polarity = float(polarity/numTweets)
  return float(polarity*0.25)

def count_word_frequency(tweet_list, search_term=None):
  word_count = {}
  for t in tweet_list:
    words = t['text'].split()
    for w in words:
      word = w.strip(' .,-!?#&')
      if len(word) == 0:
        continue
      if word == 'RT':
        continue
      if word.startswith('@') or word.startswith('http'):
        continue
      word_lower = word.lower()
      if search_term and word_lower == search_term.lower():
        continue
      if word_lower in prepositions:
        continue
      word_count[word_lower] = word_count.get(word_lower, 0) + 1
  return word_count

