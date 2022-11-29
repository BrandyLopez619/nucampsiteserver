const express = require('express');
const cors = require('./cors');
const authenticate = require('../authenticate');
const Favorite = require('../models/favorite');
const { populate } = require('mongoose/lib/model');


const favoriteRouter = express.Router();

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, (req, res, next) => {
        Favorite.find({ user: req.user._id })
            .populate('favorites.user', 'favorites.campsite')
            .then(favorites => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            })
            .catch(err => next(err));
    }
    )
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorites => {
                if (favorites) {
                    req.body.user = req.user._id
                    req.body.campsites = req.body._id
                    favorites.campsites.forEach((campsite) => {
                        const newFavorites = []
                        if (campsite._id != req.body._id) {
                            newFavorites.push(req.body._id);
                        }
                        (favorites.campsites).push(newFavorites);
                        favorites.save()
                            .then(favorites => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorites);
                            });
                    }
                    )
                } else {
                    new Favorite({ campsites: [req.body._id] }),
                        (err) => {
                            if (err) {
                                res.statusCode = 500;
                                res.setHeader('Content-Type', 'application/json');
                                res.json({ err: err });
                            } else {
                                favorites.save(err => {
                                    if (err) {
                                        res.statusCode = 500;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json({ err: err });
                                        return;
                                    }
                                    ;
                                })
                            }
                        }
                }
            })
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndDelete({ user: req.user._id })
            .then(favorites => {
                if (favorites) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                } else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('You do not have any favorites to delete.');
                }
            })
    });

favoriteRouter.route('/:campsiteId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end(`GET operation not supported on /favorites/${req.params.campsiteId}`);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        Favorite.findOne(req.params.campsiteId)
            .then(favorites => {
                if (favorites) {
                    if (favorites.campsites.includes(req.params.campsiteId) != true) {
                        favorites.campsites.push(req.params.campsiteId);
                        favorites.save()
                            .then(favorites => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorites);
                            })

                    } else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'text/plain');
                        res.end("That campsite is already in the list of favorites!");
                    };
                } else {
                    new Favorite({ campsites: [req.params.campsiteId] }),
                        (err) => {
                            if (err) {
                                res.statusCode = 500;
                                res.setHeader('Content-Type', 'application/json');
                                res.json({ err: err });
                            } else {
                                favorites.save(err => {
                                    if (err) {
                                        res.statusCode = 500;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json({ err: err });
                                        return;
                                    }
                                }
                                )
                            }
                        }
                }
            })
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /favorites/${req.params.campsiteId}`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorites => {
                if (favorites) {
                    const filtered = favorites.campsites;
                    filtered.filter(campsite => campsite._id === req.params.campsiteId);
                    favorites.save()
                        .then(favorites => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorites);
                        })

                } else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end("there are no favorites to delete!");
                };
            }
            )
    })
    ;

module.exports = favoriteRouter;
