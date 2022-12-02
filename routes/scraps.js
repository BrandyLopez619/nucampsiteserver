//                                                 res.statusCode = 200;
//                             res.setHeader('Content-Type', 'application/json');
//                             res.json(favorites);
//                 favorites.campsites.forEach((campsite) => {
//                     if (campsite._id != req.body._id) {
//                         newFavorites.push(req.body._id);
//                     }
//                     (favorites.campsites).push(newFavorites);
//                     favorites.save()
//                         .then(favorites => {
//                             res.statusCode = 200;
//                             res.setHeader('Content-Type', 'application/json');
//                             res.json(favorites);
//                         });
//                 }
//                 )
//             } else {
//                 new Favorite({ campsites: [req.body._id] }),
//                     (err) => {
//                         if (err) {
//                             res.statusCode = 500;
//                             res.setHeader('Content-Type', 'application/json');
//                             res.json({ err: err });
//                         } else {
//                             favorites.save(err => {
//                                 if (err) {
//                                     res.statusCode = 500;
//                                     res.setHeader('Content-Type', 'application/json');
//                                     res.json({ err: err });
//                                     return;
//                                 }
//                                 ;
//                             })
//                         }
//                     }
//             }
//         })
// })

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


[{"_id":"6382e5ca06eca1a459acc70e"},{"_id":"6382e5ca06eca1a459acc70f"}]
