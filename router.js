'use strict';

const routes = require('i40')();
const view = require('./view');
const fs = require('fs');
const db = require('monk')('localhost/movies');
const movies = db.get('movies');
const url = require('url');
const mime = require('mime');
const qs = require('qs');


routes.addRoute('/', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html');
  if (req.method === 'GET') {
    movies.find({}, (err, data) => {
      if (err) throw err;
      let template = view.render('movies', {
        movies: data
      });
      res.end(template);
    });
  }
});

routes.addRoute('/movies', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html');
  if (req.method === "GET") {
    movies.find({}, (err, data) => {
      if (err) throw err;
      let template = view.render('movies', {
        movies: data
      });
      res.end(template);
    });
  }
});

routes.addRoute('/movies/:id/show', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html');
  movies.findOne({
    _id: url.params.id
  }, (err, data) => {
    if (err) throw err;
    let template = view.render('show', {
      movies: data
    });
    res.end(template);
  });
});

routes.addRoute('/movies/add', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html');
  if (req.method === 'GET') {
    let template = view.render('add');
    res.end(template);
  }
  if (req.method === 'POST') {
    let body = '';
    req.on('data', (data) => {
      body += data;
    });
    req.on('end', () => {
      body = qs.parse(body);
      movies.insert({
        title: body.title,
        director: body.director,
        year: body.year,
        rating: body.rating,
        poster: body.poster
      }, (err, doc) => {
        if (err) throw err;
        res.writeHead(302, {
          'Location': '/movies'
        });
        res.end();
      })
    })
  }
});

routes.addRoute('/movies/:id/edit', (req, res, url) => {
  if (req.method === 'GET') {
    movies.findOne({
      _id: url.params.id
    }, (err, doc) => {
      let template = view.render('edit', {
        movies: doc
      });
      res.end(template);
    })
  }

  if (req.method === 'POST') {
    var body = '';
    req.on('data', (data) => {
      body += data;
    });

    req.on('end', () => {
      body = qs.parse(body);
      movies.update({
        _id: url.params.id
      }, {
        title: body.title,
        director: body.director,
        year: body.year,
        rating: body.rating,
        poster: body.poster
      }, (err, doc) => {
        if (err) throw err;
        res.writeHead(302, {
          'Location': '/movies'
        });
        res.end();
      })
    })
  }
});

routes.addRoute('/movies/:id/delete', (req, res, url) => {
  movies.remove({
    _id: url.params.id
  }, (err, data) => {
    if (err) throw err;
    res.writeHead(302, {
      'Location': '/movies'
    });
    res.end();
  });
});

routes.addRoute('/public/*', (req, res, url) => {
  res.setHeader('Content-Type', mime.lookup(req.url));
  fs.readFile('.' + req.url, (err, data) => {
    if (err) throw err;
    res.end(data);
  })
});

module.exports = routes;