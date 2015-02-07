

class BaseConfiguration(object):
  DEBUG = False
  SECRET_KEY = ''

class DevelopmentConfiguration(BaseConfiguration):
  DEBUG = True

class ProductionConfiguration(BaseConfiguration):
  # true for now.
  DEBUG = True

