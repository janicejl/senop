from flask import Flask

import tweepy

from flask_jsglue import JSGlue

app = Flask(__name__, instance_relative_config = True)
app.config.from_object('config.BaseConfiguration')
app.config.from_pyfile('config.py', silent=True)

import os
# Heroku logging settings and config.
if os.environ.get('HEROKU') is not None:
  # Logging
  import logging
  stream_handler = logging.StreamHandler()
  app.logger.addHandler(stream_handler)
  app.logger.setLevel(logging.INFO)
  app.logger.info('Senop started.')

  # Configuration
  if os.environ.get('DEBUG') is not None:
    app.config['DEBUG'] = os.environ.get('DEBUG')
  if os.environ.get('SECRET_KEY') is not None:
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
  else:
    app.log.error('Missing SECRET_KEY')
  if os.environ.get('TWITTER_KEY') is not None:
    app.config['TWITTER_KEY'] = os.environ.get('TWITTER_KEY')
  else:
    app.log.error('Missing TWITTER_KEY')
  if os.environ.get('TWITTER_SECRET') is not None:
    app.config['TWITTER_SECRET'] = os.environ.get('TWITTER_SECRET')
  else:
    app.log.error('Missing TWITTER_SECRET')

twauth = tweepy.OAuthHandler(app.config['TWITTER_KEY'], app.config['TWITTER_SECRET'])
twapi = tweepy.API(twauth)

jsglue = JSGlue(app)

import senop.controller

