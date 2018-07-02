const os = require('os');

const setupPrivacy = app => {
  // Disallow search index indexing
  app.use((req, res, next) => {
    // Setting headers stops pages being indexed even if indexed pages link to them.
    res.setHeader('X-Robots-Tag', 'noindex');
    res.setHeader('X-Served-By', os.hostname());
    res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
    next();
  });

  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send('User-agent: *\nDisallow: /');
  });
};

module.exports = setupPrivacy;
