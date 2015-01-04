import re

f = open('../data/pieces.csv','r')
pieces=[]

punctuation = re.compile('[-]')
spaces = re.compile('/\s{2,}/g')

for i in xrange(50):
	pieces.append(spaces.sub(" ",punctuation.sub("",f.readline(1000))).split('|')[0])

pieces = pieces[1:]

words = []
edges = []

for i in xrange(len(pieces)):
	piecewords = [p.capitalize() for p in pieces[i].split(" ")]
	for j in xrange(len(piecewords)):
		words.append(piecewords[j])
		if j>0:
			edges.append([piecewords[j-1],piecewords[j]])

# print(words)
# print(edges)

wordcount = []
wordcountlist = []

for i in xrange(len(words)):
	if words[i] in [w['word'] for w in wordcount]:
		for j in xrange(len(wordcount)):
			if words[i] == wordcount[j]['word']:
				wordcount[j]['count'] += 1
	else:
		wordcount.append({'word': words[i], 'count': 1})
		wordcountlist.append(words[i])

# print(wordcount)

# for i in xrange(len(wordcount)):
# 	print(wordcount[i]['word'] + "," + str(wordcount[i]['count']))

for i in xrange(len(edges)):
	print(edges[i][0] + "," + edges[i][1])