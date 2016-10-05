import time
import logging
from string import ascii_uppercase, ascii_letters
import re

def make_hist(iterable):
	hist = {}
	for i in iterable:
		hist[i] = hist.get(i, 0) + 1
	return hist

def mostly_capital_letters(n, threshold=.25):
	caps_count = len(filter(lambda s: s in ascii_uppercase, n))
	letters_count = len(filter(lambda s: s in ascii_letters, n))
	return (letters_count - caps_count) <= threshold * letters_count

def strip_html(s):
	s = re.sub(r'</[a-z]+>', '', s)
	s = re.sub(r'<[-a-z0-9 "=]+>', '', s)
	return s


