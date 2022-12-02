const express = require('express');
const cors = require('./cors');
const authenticate = require('../authenticate');
const Favorite = require('../models/favorite');
const { populate } = require('mongoose/lib/model');


const favoriteRouter = express.Router();

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({ user: req.user._id })
            .populate('user').populate('campsites')
            .then(favorites => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            })
            .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    req.body.forEach(
                        ((item) => {
                            if (!favorite.campsites.includes(item._id)) {
                                favorite.campsites.push(item._id)
                            }
                        })
                    )
                    favorite.save().then(
                        favorite => {
                            res.statusCode = 200;
                            res.setHeader('Content-type', 'application/json');
                            res.json(favorite);
                        })
                } else {
                    const favorite = new Favorite({
                        campsites: req.body.map(({ _id }) => _id),
                        user: req.user.id
                    })
                    favorite.save(function (err, user) {
                        if (err) return err;
                        res.send(user);
                    });
                }
            }
            )
    }
    )
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndDelete({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
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
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    if (!favorite.campsites.includes(req.params.campsiteId)) {
                        favorite.campsites.push(req.params.campsiteId)
                        favorite.save().then(
                            favorite => {
                                res.statusCode = 200;
                                res.setHeader('Content-type', 'application/json');
                                res.json(favorite);
                            })
                    } else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'text/plain');
                        res.end("That campsite is already in the list of favorites!");
                    }
                } else {
                    const favorite = new Favorite({
                        campsites: req.params.campsiteId,
                        user: req.user.id
                    })
                    favorite.save(function (err, user) {
                        if (err) return err;
                        res.send(user);
                    })
                }
            })
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /favorites/${req.params.campsiteId}`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    if (favorite.campsites.includes(req.params.campsiteId)) {
                        favorite.campsites = favorite.campsites.filter(campsite => campsite._id != req.params.campsiteId)
                    };
                    favorite.save()
                        .then(favorite => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
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
