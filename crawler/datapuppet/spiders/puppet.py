# -*- coding: utf-8 -*-
import os, sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import scrapy
import lib.config as config
from sets import Set
import re

class PuppetSpider(scrapy.Spider):
    name = "puppet"
    allowed_domains = config.allowed_domains
    start_urls = config.start_urls
    visited = Set([])

    def parse(self, response):
        next_pages = []
        for href in response.xpath('//a/@href'):
            url = response.urljoin(href.extract())
            if url in self.visited:
              continue

            self.visited.add(url)
            rule = self.match_rule(url)
            if rule is not None:
                if rule['page_type'] == 'leaf':
                    request = scrapy.Request(url, callback=parse_leaf)
                    request.meta['rule'] = rule
                    yield request
                elif rule['page_type'] == 'dir':
                    next_pages.append(url)

        for url in next_pages:
            yield scrapy.Request(url, callback=self.parse)

    def match_rule(self, url):
        for rule in config.rules:
            if rule['pattern'].search(url):
                return rule

    def parse_leaf(self, response):
        rule = response.meta['rule']
        select_method = getattr(response, selector['type'])
        pattern = selector['pattern']
