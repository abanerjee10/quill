module.exports = function(app) {
  // Application ------------------------------------------
  app.get('/', function(req, res) {
    res.sendfile('./client/index.html');
  });

  // Wildcard all other GET requests to the angular app
  // TODO: Remove this once we get rid of the angular app
  app.get('*', function(req, res) {
    res.sendfile('./client/index.html');
  });
};
