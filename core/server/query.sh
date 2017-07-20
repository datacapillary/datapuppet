#/bin/bash

#namespace='{"domain": "soufang.com", "start_url": "http://bj.soufang.com"}'
#curl -X POST -H "Content-Type: application/json" -d "$namespace" "http://localhost:8080/namespace/new"

#urls='{"urls": ["http://sh.sofang.com/", "http://tj.sofang.com/", "http://bj.soufang.com"]}'
#curl -X POST -H "Content-Type: application/json" -d "$urls" "http://localhost:8080/1/urls"
#curl -X GET "http://localhost:8080/1/urls"

#data='{"namespace": "3", "urls": ["http://nj.sofang.com/"], "data":{"b67beab3d77608f49de7d7982d5c3b78": {"status_code": 200, "attributes": {"name": "whatever"}}}}'
#curl -X POST -H "Content-Type: application/json" -d "$data" "http://localhost:8080/1/data"

crawl_rules='{"rules":["", ""]}'
curl -X POST -H "Content-Type: application/json" -d "$crawl_rules" "http://localhost:8080/1/crawl_rule"
extract_rules='{"url_regex":""}'
curl -X POST -H "Content-Type: application/json" -d "$extract_rules" "http://localhost:8080/1/extract_rule"
#curl -X POST -H "Content-Type: application/json" -d 'urls' "http://localhost:8080/1/attribute_rule"
#curl -X GET "http://localhost:8080/0/rules"
