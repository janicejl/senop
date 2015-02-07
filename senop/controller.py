# controller.py

from . import app

from flask import render_template, request, jsonify

@app.route('/search', methods=['POST', 'GET'])
def search():
  if request.method == 'GET':
    return render_template('search_form.html')
  else: # POST
    # asf
    return jsonify('hi')

@app.route('/')
def homepage():
  return render_template('index.html')
