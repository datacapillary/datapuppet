import mysql.connector
from collections import namedtuple
import hashlib

class Database():

    def __init__(self, config):
        self.connector = mysql.connector.connect(
            user=config['user'],
            password=config['password'],
            host=config['host'],
            database=config['db']
        )
        self.cursor = self.connector.cursor()

    def cpt_md5(self, data):
        return hashlib.md5(data).hexdigest()

    def add_namespace(self, domain, start_url):
        self.cursor.execute("""
            INSERT INTO namespace
            (domain, start_url)
            VALUES (%s, %s)
        """, (domain, start_url))

    def add_crawl_rule(self, rule, namespace_id):
        self.cursor.execute("""
            INSERT INTO crawlrules
            (rule, namespace_id)
            VALUES (%s, %s)
        """, (rule, namespace_id))

    def add_exract_rule(self, url_regex, namespace_id):
        self.cursor.execute("""
            INSERT INTO extractrules
            (url_regex, namespace_id)
            VALUES (%s, %s)
        """, (url_regex, namespace_id))

    def add_attribute_rule(self, name, rule, extractrule_id):
        self.cursor.execute("""
            INSERT INTO attributerules
            (name, rtype, rule, extractrule_id)
            VALUES (%s, %s)
        """, (name, rule['type'], rule['rule'], extractrule_id))

    def add_url(self, url, namespace_id):
        uid = self.cpt_md5(url)
        self.cursor.execute("""
            INSERT IGNORE INTO urls
            (uid, url, status, created_at, updated_at, namespace_id, status_code, attributes)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (uid, url, 'pending', None, None, namespace_id, None, None))

    def url_crawling_update(self, url_id):
        self.cursor.execute("""
           UPDATE urls
           SET status=%s
           WHERE uid=%s
        """, ('crawling', url_id))

    def store_url_data(self, url_id, status_code, attributes):
        self.cursor.execute("""
           UPDATE urls
           SET status=%s, status_code=%s, attributes=%s
           WHERE uid=%s
        """, ('done', status_code, attributes, url_id))

    def get_namespaces(self):
        self.cursor.execute("""
            SELECT nid, domain, start_url
            FROM namespace
        """)
        namespaces = {}
        for (nid, domain, start_url) in self.cursor:
            namespaces[str(nid)] = {
                "domain": domain,
                "start_url": start_url
            }
        return namespaces

    def get_more_urls(self, namespace_id, limit = 50):
        self.cursor.execute("""
            SELECT uid, url
            FROM urls
            WHERE namespace_id=%s and status=%s
            LIMIT %s
        """, (namespace_id, 'pending', limit))
        return [{'id': uid, 'url': url} for (uid, url) in self.cursor]

    def get_rules(self, namespace_id):
        return {
            "crawl": self.get_crawlrules(namespace_id),
            "extract": self.get_extractrules(namespace_id)
        }

    def get_crawlrules(self, namespace_id):
        self.cursor.execute("""
            SELECT id, type, rule
            FROM crawlrules
            WHERE namespace_id = %s
        """, (namespace_id))
        rules = {}
        for (cid, rtype, rule) in self.cursor:
            rules[str(cid)] = {'type': rtype, 'rule': rule}
        return rules

    def get_extractrules(self, namespace_id):
        self.cursor.execute("""
            SELECT eid, url_regex, name, type, rule
            FROM extractrules, attributerules
            WHERE extract_rule.eid = attributerules.extractrule_id
                and namespace_id = %s
        """, (namespace_id))
        extractrules = {}
        for (eid, url_regex, name, rtype, rule) in self.cursor:
            if eid not in extractrules:
                extractrules[str(eid)] = {
                    'url_regex': url_regex,
                    'rules': []
                }
            extractrules[str(eid)]['rules'].append({
                'name': name,
                'type': rtype,
                'rule': rule
            })
        return extractrules

    def commit(self):
        self.connector.commit()

    def last_id(self):
        return self.cursor.lastrowid
