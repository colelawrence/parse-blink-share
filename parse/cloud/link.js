// Provides endpoints for user signup and login

module.exports = function(){
  var Link = Parse.Object.extend("Link")
  var express = require('express')
  var app = express();
  function createLink (dest, dies, res) {
    var link = new Link()
    link.set("destination", dest)
    link.set("redirects", 0)
    link.set("dies", !!dies)
    link.save().then(function (link) {
      res.json({ id : link.id })
    })
  }
  app.all('/', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    if (req.method === "GET") {
      if (typeof req.query.destination === "string" && req.query.destination.length)
        createLink(unescape(req.query.destination), req.query.dies != null, res)
      else res.render('link')
    } else if (req.method === "POST") {
      createLink(req.body.destination, req.body.willDie, res)
    }
  })
  app.get('/:slug', function(req, res) {
    var query = new Parse.Query(Link)
    query.get(req.params.slug, {
      success: function (link) {
        var redirects = link.get("redirects")
        var dead = false
        if (redirects > 0 && link.get("dies")) {
          dead = true
        }
        if (dead) {
          res.redirect(301, "/")
        } else {
          res.redirect(307, link.get("destination"))
        }
        link.set("redirects", redirects + 1)
        link.save()
      },
      error: function () {
        res.redirect(307, "/?error")
      }
    })
  });

  return app;
}();


