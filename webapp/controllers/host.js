const async = require('async');
const Host = require('../models/Host');

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
    if (err) { req.flash('errors', 'Host ' + req.params.id + ' not found.'); }
    res.render('host/edit', {
      title: host.id,
      host: host
    })
  });
};

exports.postEdit = (req, res) => {
  const errors = validate(req);
  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/login');
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
      req.flash('errors', 'Host ' + req.params.id + ' not found.');
    } else {
      req.flash('infos', 'Host ' + req.params.id + ' has been updated successfully.');
    }

    console.log(host);
    res.render('host/edit', {
      title: req.params.id,
      host: host
    })
  });
}

exports.getCreate = (req, res) => {
  res.render('host/create', {
    title: 'New Host',
    currentUser: "Shu Dong"
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
    setting: {
      priority: req.body.priority,
      owner: req.body.owner,
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
  Host.remove({ _id: req.host.id }, (err) => {
    if (err) { return next(err); }
    req.flash('info', { msg: 'Host has been deleted.' });
    res.redirect('/');
  });
}
