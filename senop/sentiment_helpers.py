# sentiment_helpers.py

from . import app, twapi
import tweepy
import datetime
import urllib2,json
from flask import jsonify

class TwitterSen:
  def __init__(self,sentiment=None, sentimentNum=None):
    self.sentiment = sentiment
    self.sentimentNum = sentimentNum
    description = "This holds if the sentiment of a tweet is positive, negative or netural, along with a number showing intensity"

  @property
  def sentiment(self):
    return self.__sentiment

  @property
  def sentimentNum(self):
    return self.__sentimentNum

  @sentiment.setter
  def sentiment(self, sentimentNum):
    if sentimentNum < -0.2:
      self.__sentiment = "negative"
    elif sentimentNum > 0.2:
      self.__sentiment = "positive"
    else:
      self.__sentiment = "neutral"

def get_tweets(search_term):
  # since 1 week ago
  week_ago = (datetime.datetime.now() - datetime.timedelta(days=7)).date()
  qualifier = ' since:%d-%d-%d' % (week_ago.year, 
      week_ago.month, week_ago.day)
  search_term += qualifier
  print search_term
  twitter_results = []

  for t in tweepy.Cursor(twapi.search, 
    q=search_term).items(app.config['MAX_TWEETS']):
    twitter_results.append(t)

  return twitter_results

def get_sentiment(tweets):
  json_query = json.dumps({ 'data' : tweets })

  url = 'http://www.sentiment140.com/api/bulkClassifyJson?appid=chuxtina@gmail.com'
  req = urllib2.Request(url)
  req.add_header('Content-Type', 'application/json')

  response = urllib2.urlopen(req, json_query)
  response_data = json.load(response)

  return response_data

def calculate_polarity(sentiment_result):
  polarity = 0

  for r in sentiment_result:
    r['polarity']

  return polarity

def count_word_frequency(tweet_list):
  word_count = {}
  return word_count

