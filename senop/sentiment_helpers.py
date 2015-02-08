# sentiment_helper.py
class TwitterSen:
	    def __init__(self,sentiment=None, sentimentNum=None):
        self.sentiment = sentiment
        self.sentimentNum = sentimentNum
    description = "This holds if the sentiment of a tweet is positive, negative or netural, along with a number showing intensity"
    def getSentiment(self):
    	return self.sentiment
    def getSentimentNum(self):
    	return self.sentimentNum
    def describe(self,text):
        self.description = text
    def scaleSentiment(self,scale):
        self.sentimentNum = self.sentimentNum * scale

    @property
    def sentiment(self):
        return self.__sentiment

    @property
    def sentimentNum(self):
        return self.__sentimentNum

    @sentiment.setter
    def sentiment(self, sentiment):
        if x < 0:
            self.__sentiment = "negative"
        elif x > 0:
            self.__sentiment = "positive"
        else:
            self.__sentiment = "neutral"


