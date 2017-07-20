#!/usr/bin/env python

from bottle import get, post, request, run
import json
from database import Database
import logging

logger = logging.getLogger('myapp')
logger.setLevel(logging.INFO)

config = {
    'user': 'root',
    'password': 'root',
    'host': 'localhost',
    'db': 'datapuppet',
    'port': 3306
}
db = Database(config)


@get('/namespaces')
def get_namespaces():
    return db.get_namespaces().keys()


@get('/<namespace>/urls')
def get_urls(namespace):
    urls = db.get_more_urls(int(namespace))
    for url in urls:
        db.url_crawling_update(url['id'])
    db.commit()
    return dict(urls=urls)


@get('/<namespace>/rules')
def get_rules(namespace):
    return db.get_rules(int(namespace))


@post('/<namespace>/urls')
def upload_urls(namespace):
    data = request.json
    for url in data['urls']:
        db.add_url(url, int(namespace))
    db.commit()


@post('/<namespace>/data')
def save_url_data(namespace):
    data = request.json
    for url in data['urls']:
        db.add_url(url, namespace)
    for url_id, res in data['data'].items():
        status_code = res['status_code']
        attributes = res['attributes']
        db.store_url_data(url_id,
                          status_code,
                          json.dumps(attributes))
    db.commit()


@post('/namespace/new')
def save_namespace():
    data = request.json
    db.add_namespace(data['domain'], data['start_url'])
    db.add_url(data['start_url'], db.last_id())
    db.commit()


@post('/<namespace>/crawl_rule')
def add_crawl_rule(namespace):
    data = request.json
    for rule in data['rules']:
        db.add_crawl_rule(rule, namespace)
    db.commit()


@post('/<namespace>/extract_rule')
def add_exract_rule(namespace):
    data = request.json
    db.add_exract_rule(data['url_regex'], namespace)
    db.commit()


@post('/<extractrule_id>/attribute_rule')
def add_attribute_rule():
    data = request.json
    db.add_attribute_rule(data['name'], data['rule'], extractrule_id)
    db.commit()


run(host='localhost', port=8080)
