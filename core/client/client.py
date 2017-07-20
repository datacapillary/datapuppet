#!/usr/bin/env python

import requests
import json
import time
import hashlib
from ./rule import RuleHandler

ROOT_URL = "http://datacapillary.com/"

class Page(Object):
    def __init__(self, url, rules):
        self.url_id = url['id']
        self.url = url['url']
        self.crawlrules = rules['crawl']
        self.extractrules = rules['extract']
        self.handler = RuleHandler()

    def get(self):
        res = requests.get(url)
        retry = 3
        while res.status_code != 200 and retry > 0:
            time.sleep(1)
            retry = retry - 1
            res = requests.get(url)

        self.status_code = res.status_code
        self.content = res.content
        return self.status_code

    def extract_data(self):
        if self.status_code != 200:
            return self.content
        data = {}
        for rid in self.extractrules:
            url_regex = self.extractrules[rid]['url_regex']
            rules = self.extractrules[rid]['rules']
            if re.match(url_regex, self.url):
                for attr in rules:
                    data[attr.name] = self.extract_attribute(attr.rule)
                break
        return data

    def extract_attribute(self, attribute_rule):
        return apply_rule(attribute_rule)[0]

    def extract_urls(self):
        urls = set()
        for rule in self.crawlrules.values():
            for url in apply_rule(rule):
                urls.add(url)
        return urls

    def apply_rule(self, rule):
        return self.handler.apply_rule(data, rule)


def crawl(namespace, urls, rules):
    time.sleep(1)
    data = {}
    urls = set()
    for url in urls:
        page = Page(url, rules)
        page.get()
        urls |= page.extract_urls()
        data[url['uid']] = {
            'status_code': page.status_code,
            'attributes': page.extract_data()
        }
    return {
        "namespace": namespace,
        "urls": urls,
        "data": data
    }


while (True):
    time.sleep(60)

    # get urls
    namespace = 3
    URLS_URL = ROOT_URL + namespace + '/urls'
    RULES_URL = ROOT_URL + namespace + '/rules'
    urls = requests.get(URLS_URL).json()['urls']
    rules = requests.get(RULES_URL).json()

    # crawl data
    payload = crawl(namespace, urls, rules)

    # save data
    DATA_URL = ROOT_URL + 'data'
    requests.post(DATA_URL, data=json.dumps(payload))
