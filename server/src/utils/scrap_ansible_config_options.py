import requests
from bs4 import BeautifulSoup
import re

url = "https://docs.ansible.com/ansible/latest/reference_appendices/config.html"
html_content = requests.get(url).text

soup = BeautifulSoup(html_content, 'html.parser')

common_options_section = soup.find("section", {"id": "common-options"})

required_keys = ['Description', 'Type', 'Default', 'Section']

options = []
for section in common_options_section.find_all('section'):
	obj = {}

	name = section.find('h3').text.strip()
	name = re.sub('[^A-Za-z0-9_]+', '', name)
	obj['Name'] = name

	details = section.find('dl', {"class": "field-list simple"})
	keys = details.find_all('dt')
	values = details.find_all('dd')
	
	for i in range(len(keys)):
		key = keys[i].text.strip()
		value = values[i].text.strip()
		if(key in required_keys):
			if(key == 'Section'):
				obj[key] = value[1:-1]
			else:
				obj[key] = value

	options.append(obj)

print(options)
