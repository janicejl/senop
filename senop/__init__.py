from flask import Flask

app = Flask(__name__)
app.config.from_object('config.BaseConfiguration')
app.config.from_object('config.DevelopmentConfiguration')

import senop.controller

