const async = require('async');
const Host = require('../models/Host');
const CrawlRule = require('../models/CrawlRule');
const ExtractRule = require('../models/ExtractRule');

function validate(req) {
  req.assert('priority', 'Priority must be number').notEmpty().isInt();
  req.assert('encode', 'Encoding cannot be empty').notEmpty();
  req.assert('owner', 'Owner cannot be empty').notEmpty();
  req.assert('daily_limit', 'Daily Limit must be number').notEmpty().isInt();
  req.assert('crawl_interval', 'Crawl Interval must be number').notEmpty().isInt();
  return req.validationErrors();
}

exports.getEdit = (req, res) => {
  Host.findOne({'_id': req.params.id}, function(err, host) {
    if (err) {
      req.flash('errors', { msg:  'Host ' + req.params.id + ' not found.'});
    }

    res.render('host/edit', {
      title: "Edit Host",
      host: host
    })
  })
}

exports.postEdit = (req, res) => {
  const errors = validate(req);
  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/');
  }

  const updatedData = {
    setting: {
      priority: req.body.priority,
      owner: req.body.owner,
      encode: req.body.encode,
      daily_limit: req.body.daily_limit,
      crawl_interval: req.body.crawl_interval
    }
  };

  Host.findOneAndUpdate({'_id': req.params.id}, updatedData, {new: true}, function(err, host) {
    if (err) {
      req.flash('errors', { msg: 'Host ' + req.params.id + ' not found.'});
    } else {
      req.flash('info', { msg: 'Host ' + req.params.id + ' has been updated successfully.'});
    }

    res.render('host/index', {
      title: req.params.id,
      host: host
    })
  });
}



exports.getExtract = (req, res) => {
  Host.findOne({'_id': req.params.id}, function(err, host) {
    if (err) {
      req.flash('errors', { msg:  'Host ' + req.params.id + ' not found.'});
    }

    ExtractRule.find({'crawl_rule_id': req.body.crawl_rule_id}, function(err, rules) {
      if (err) {
        req.flash('errors', { msg:  'No crawl Rules of host ' + req.params.id + ' found.'});
      }

      res.render('host/extract', {
        title: "Edit Host",
        host: host,
        rules: rules
      })
    });
  })
}

exports.getCreate = (req, res) => {
  const defaultHost = new Host({
    owner: req.user.username,
    setting: {
      priority: 3,
      encode: 'UTF8',
      daily_limit: 5000,
      crawl_interval: 10000
    }
  });

  res.render('host/create', {
    title: 'New Host',
    host: defaultHost
  });
}

exports.postCreate = (req, res, next) => {
  req.assert('domain', 'Domain can not be empty').notEmpty();
  const errors = validate(req);
  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/login');
  }

  const host = new Host({
    domain: req.body.domain,
    owner: req.body.owner,
    setting: {
      priority: req.body.priority,
      encode: req.body.encode,
      daily_limit: req.body.daily_limit,
      crawl_interval: req.body.crawl_interval
    }
  });

  Host.findOne({ domain: req.body.domain }, (err, existingHost) => {
    if (existingHost) {
      req.flash('errors', { msg: 'Host with that domain already exists.' });
      return res.redirect('/host/create');
    }
    host.save((err) => {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });
}

exports.postDelete = (req, res, next) => {
  Host.remove({ '_id': req.body.host_id }, (err) => {
    if (err) { return next(err); }
    req.flash('info', { msg: 'Host has been deleted.' });
    res.redirect('/');
  });
}
