# controller.py

from . import app

from flask import render_template

@app.route('/search')
def search_form():
  return render_template('search_form.html')

@app.route('/')
def homepage():
  return render_template('index.html')
