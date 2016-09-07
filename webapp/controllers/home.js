const Host = require('../models/Host');

exports.index = (req, res) => {
  Host.find({}, function(err, hosts) {
    if (err) { req.flash('errors', errors); }
    res.render('home', {
      title: "All Hosts",
      hosts: hosts
    })
  });
};
