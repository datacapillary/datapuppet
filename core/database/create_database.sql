DROP DATABASE IF EXISTS datapuppet;
CREATE DATABASE IF NOT EXISTS datapuppet;
USE datapuppet;

CREATE TABLE IF NOT EXISTS namespace (
  nid int AUTO_INCREMENT,
  domain varchar(100) NOT NULL,
  start_url varchar(200) NOT NULL,
  PRIMARY KEY(nid),
  UNIQUE KEY(domain)
);

CREATE TABLE IF NOT EXISTS crawlrules (
  cid int AUTO_INCREMENT,
  rule VARCHAR(200) NOT NULL,
  namespace_id int NOT NULL,
  PRIMARY KEY (cid),
  FOREIGN KEY (namespace_id) REFERENCES namespace(nid)
);

CREATE TABLE IF NOT EXISTS extractrules (
  eid int AUTO_INCREMENT,
  url_regex varchar(200) NOT NULL,
  namespace_id int NOT NULL,
  PRIMARY KEY (eid),
  FOREIGN KEY (namespace_id) REFERENCES namespace(nid)
);

CREATE TABLE IF NOT EXISTS attributerules (
  aid int NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  rtype ENUM("regex", "xpath", "dom") NOT NULL,
  rule VARCHAR(200) NOT NULL,
  extractrule_id int NOT NULL,
  PRIMARY KEY (aid),
  FOREIGN KEY (extractrule_id) REFERENCES extractrules(eid)
);

CREATE TABLE IF NOT EXISTS urls (
  uid char(32) NOT NULL,
  url varchar(200) NOT NULL,
  status ENUM('pending', 'crawling', 'done') NOT NULL,
  created_at TIMESTAMP NOT NULL default now(),
  updated_at TIMESTAMP NOT NULL default now() on update now(),
  namespace_id int NOT NULL,
  status_code int,
  attributes JSON,
  PRIMARY KEY (uid),
  FOREIGN KEY (namespace_id) REFERENCES namespace(nid)
);

CREATE USER IF NOT EXISTS master@localhost IDENTIFIED BY 'dongshu123!';
GRANT ALL PRIVILEGES ON datapuppet.* TO master@localhost IDENTIFIED BY 'dongshu123!' WITH GRANT OPTION;
FLUSH PRIVILEGES;
