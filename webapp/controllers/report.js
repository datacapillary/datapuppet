const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_PASSWORD
  }
});

/**
 * GET /contact
 * Contact form page.
 */
exports.getReport = (req, res) => {
  res.render('report', {
    title: 'report'
  });
};

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 */
exports.postReport = (req, res) => {
  req.assert('title', 'Title cannot be blank').notEmpty();
  req.assert('message', 'Message cannot be blank').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/report');
  }
};
