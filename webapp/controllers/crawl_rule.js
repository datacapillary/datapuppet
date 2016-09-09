const async = require('async');
const Host = require('../models/Host');
const CrawlRule = require('../models/CrawlRule');
const ExtractRule = require('../models/ExtractRule');

exports.getIndex = (req, res) => {
  Host.findOne({'_id': req.params.id}, function(err, host) {
    if (err) {
      req.flash('errors', { msg:  'Host ' + req.params.id + ' not found.'});
    }

    CrawlRule.find({'host_id': req.params.id}, function(err, rules) {
      if (err) {
        req.flash('errors', { msg:  'No crawl Rules of host ' + req.params.id + ' found.'});
      }

      res.render('crawl_rule/index', {
        title: "All Crawl Rules",
        host: host,
        rules: rules
      })
    });
  })
};

exports.getCreate = (req, res) => {
  Host.findOne({'_id': req.params.id}, function(err, host) {
    if (err) {
      req.flash('errors', { msg:  'Host ' + req.params.id + ' not found.'});
    }

    res.render('crawl_rule/create', {
      title: 'New Crawl Rule',
      host: host
    });
  })
};

exports.postCreate = (req, res, next) => {
  const crawlRule = new CrawlRule({
    name: req.body.name,
    host_id: req.params.id,
    page_type: req.body.page_type,
    pattern: req.body.pattern,
    exclude_pattern: req.body.exclude_pattern
  });

  CrawlRule.findOne({ host_id: req.params.id, name: req.body.name }, (err, existingCrawlRule) => {
    if (existingCrawlRule) {
      req.flash('errors', { msg: 'Crawl rule with that name already exists.' });
      return res.redirect('/host/' + req.params.id + '/crawl_rule/create');
    }

    crawlRule.save((err) => {
      if (err) { return next(err); }
      res.redirect('/host/' + req.params.id + '/crawl_rule/index');
    });
  });
};

exports.postDelete = (req, res, next) => {
  CrawlRule.remove({ '_id': req.body.crawl_rule_id }, (err) => {
    if (err) { return next(err); }
    req.flash('info', { msg: 'Crawl rule has been deleted.' });
    res.redirect('/host/' + req.params.id + '/crawl_rule/index');
  });
}

exports.getEdit = (req, res) => {
  Host.findOne({'_id': req.params.id}, function(err, host) {
    if (err) {
      req.flash('errors', { msg:  'Host ' + req.params.id + ' not found.'});
    }

    CrawlRule.findOne({'_id': req.params.rule_id}, function(err, rule) {
      if (err) {
        req.flash('errors', { msg:  'No crawl Rules of host ' + req.params.id + ' found.'});
      }

      res.render('crawl_rule/edit', {
        title: 'Edit Crawl Rule',
        host: host,
        rule: rule
      })
    });
  })
}

exports.postEdit = (req, res) => {
  const updatedData = {
    name: req.body.name,
    page_type: req.body.page_type,
    pattern: req.body.pattern,
    exclude_pattern: req.body.exclude_pattern
  };

  CrawlRule.findOneAndUpdate({'_id': req.body.crawl_rule_id}, updatedData, {new: true}, function(err, rule) {
    if (err) {
      req.flash('errors', { msg: 'Crawl rule ' + req.body.crawl_rule_id + ' not found.'});
    } else {
      req.flash('info', { msg: 'Crawl rule ' + req.body.crawl_rule_id + ' has been updated successfully.'});
    }

    res.redirect('/host/' + req.body.host_id + '/crawl_rule/' + req.body.crawl_rule_id + '/edit');
  });
};

