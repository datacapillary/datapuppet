import re
from lxml import html
from bs4 import BeautifulSoup as Soup
from soupselect import select

class RuleHandler():
    def apply_rule(self, data, rule):
        if rule['type'] == "regex":
            return self.extract_from_regex(data, rule['rule'])
        elif rule['type'] == "xpath":
            return self.extract_from_xpath(data, rule['rule'])
        elif rule['type'] == "dom":
            return extract_from_dom(data, rule['rule'])
        else:
            print("Not supported rule type")

    def extract_from_regex(self, data, regex):
        res = []
        matches = re.findall(regex, data)
        for match in matches:
            res.append(match.group(0))
        return res

    def extract_from_xpath(self, data, xpath):
        tree = html.fromstring(data)
        return tree.xpath(xpath)

    def extract_from_dom(self, data, selector):
        soup = Soup(data)
        return select(soup, selector)

