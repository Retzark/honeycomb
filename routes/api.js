let config = require('./../config')
const { store, NodeOps, VERSION } = require("./../index");
const fetch = require('node-fetch');
let { getPathNum } = require("./../getPathNum");
let { getPathObj } = require("./../getPathObj");
const decodeURIcomponent = require('decode-uri-component');
//const { reject } = require('async');

exports.root = (req, res, next) => {
    var stats = {};
    res.setHeader('Content-Type', 'application/json');
    store.get(['stats'], function(err, obj) {
        stats = obj,
            res.send(JSON.stringify({
                stats,
                node: config.username,
                VERSION,
                realtime: stats.realtime
            }, null, 3));
    });
}

exports.dex = (req, res, next) => {
    var dex = getPathObj(['dex'])
    var queue = getPathObj(['queue'])
    res.setHeader('Content-Type', 'application/json');
    Promise.all([dex, queue])
        .then(function(v) {
            res.send(JSON.stringify({
                markets: v[0],
                queue: v[1],
                node: config.username,
                VERSION
            }, null, 3))
        })
        .catch(function(err) {
            console.log(err)
        })
}

exports.markets = (req, res, next) => {
    let markets = getPathObj(['markets']),
        stats = getPathObj(['stats'])
    res.setHeader('Content-Type', 'application/json');
    Promise.all([markets, stats])
        .then(function(v) {
            res.send(JSON.stringify({
                markets: v[0],
                stats: v[1],
                node: config.username,
                VERSION
            }, null, 3))
        })
        .catch(function(err) {
            console.log(err)
        })
}

exports.runners = (req, res, next) => {
    res.setHeader('Content-Type', 'application/json')
    store.get(['runners'], function(err, obj) {
        var runners = obj
        res.send(JSON.stringify({
            runners,
            node: config.username,
            VERSION
        }, null, 3))
    });
}

exports.feed = (req, res, next) => {
    res.setHeader('Content-Type', 'application/json')
    store.get(['feed'], function(err, obj) {
        var feed = obj
        res.send(JSON.stringify({
            feed,
            node: config.username,
            VERSION
        }, null, 3))
    });
}

exports.posts = (req, res, next) => {
    res.setHeader('Content-Type', 'application/json')
    store.get(['posts'], function(err, obj) {
        var feed = obj
        res.send(JSON.stringify({
            feed,
            node: config.username,
            VERSION
        }, null, 3))
    });
}

exports.PostAuthorPermlink = (req, res, next) => {
    try {
        let author = req.params.author,
            permlink = req.params.permlink
        res.setHeader('Content-Type', 'application/json')
        archp = getPathObj(['posts', `s/${author}/${permlink}`]) //one of these will be empty
        nowp = getPathObj(['posts', `${author}/${permlink}`]) //now are still eligible for votes
        Promise.all([archp, nowp])
            .then(a => {
                var arch = a[0],
                    now = a[1]
                res.send(JSON.stringify({
                    now,
                    arch,
                    node: config.username,
                    VERSION
                }, null, 3))
            })
            .catch(e => { console.log(e) })
    } catch (e) { res.send('Something went wrong') }
}

exports.report = (req, res, next) => {
    let un = req.params.un
    res.setHeader('Content-Type', 'application/json')
    store.get(['markets', 'node', un, 'report'], function(err, obj) {
        var report = obj
        res.send(JSON.stringify({
            [un]: report,
            node: config.username,
            VERSION
        }, null, 3))
    });
}

exports.user = (req, res, next) => {
    let un = req.params.un,
        bal = getPathNum(['balances', un]),
        pb = getPathNum(['pow', un]),
        lp = getPathNum(['pow', 'n', un]),
        contracts = getPathObj(['contracts', un]),
        incol = getPathNum(['col', un]) //collateral
    res.setHeader('Content-Type', 'application/json');
    Promise.all([bal, pb, lp, contracts, incol])
        .then(function(v) {
            console.log(bal, pb, lp, contracts)
            res.send(JSON.stringify({
                balance: v[0],
                poweredUp: v[1],
                powerBeared: v[2],
                heldCollateral: v[4],
                contracts: v[3],
                node: config.username,
                VERSION
            }, null, 3))
        })
        .catch(function(err) {
            console.log(err)
        })
}

exports.state = (req, res, next) => {
    var state = {}
    res.setHeader('Content-Type', 'application/json')
    store.get([], function(err, obj) {
        state = obj,
            res.send(JSON.stringify({
                state,
                node: config.username,
                VERSION
            }, null, 3))
    });
}

exports.pending = (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(NodeOps(), null, 3))
}

//heroku force https

exports.https_redirect = (req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        if (req.headers['x-forwarded-proto'] != 'https') {
            return res.redirect('https://' + req.headers.host + req.url);
        } else {
            return next();
        }
    } else {
        return next();
    }
};

//hive API helper functions

exports.hive_api = (req, res, next) => {
    let method = `${req.params.api_type}.${req.params.api_call}` || 'condenser_api.get_discussions_by_blog';
    let params = {};
    let array = false;
    for (param in req.query) {
        if (param == "0") {
            array = true;
            break;
        }
        params[param] = req.query[param];
    }
    if (array) {
        params = [];
        for (param in req.query) {
            params.push(req.query[param]);
        }
        params = [params];
    }
    switch (req.params.api_call) {
        case 'get_content':
            params = [params.author, params.permlink];
            break;
        case 'get_content_replies':
            params = [params.author, params.permlink];
            break;
        default:
    }
    res.setHeader('Content-Type', 'application/json');
    let body = {
        jsonrpc: "2.0",
        method,
        params,
        id: 1
    };
    fetch(config.clientURL, {
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST"
        })
        .then(j => j.json())
        .then(r => {
            res.send(JSON.stringify(r, null, 3));
        });
}

exports.getwrap = (req, res, next) => {
    let method = req.query.method || 'condenser_api.get_discussions_by_blog';
    method.replace('%27', '');
    let iparams = JSON.parse(decodeURIcomponent((req.query.params.replace("%27", '')).replace('%2522', '%22')));
    switch (method) {
        case 'tags_api.get_discussions_by_blog':
        default:
            iparams = {
                tag: iparams[0]
            };
    }
    let params = iparams || { "tag": "robotolux" };
    res.setHeader('Content-Type', 'application/json');
    let body = {
        jsonrpc: "2.0",
        method,
        params,
        id: 1
    };
    fetch(config.clientURL, {
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST"
        })
        .then(j => j.json())
        .then(r => {
            res.send(JSON.stringify(r, null, 3));
        });
}

exports.getpic = (req, res, next) => {
    let un = req.params.un || '';
    let body = {
        jsonrpc: "2.0",
        method: 'condenser_api.get_accounts',
        params: [
            [un]
        ],
        id: 1
    };
    fetch(config.clientURL, {
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST"
        })
        .then(j => j.json())
        .then(r => {
            let image, i = 0;
            try {
                image = JSON.parse(r.result[0].json_metadata).profile.profile_image;
            } catch (e) {
                try {
                    i = 1;
                    image = JSON.parse(r.result[0].posting_json_metadata).profile.profile_image;
                } catch (e) {
                    i = 2;
                    image = 'https://a.ipfs.dlux.io/images/user-icon.svg';
                }
            }
            if (image) {
                fetch(image)
                    .then(response => {
                        response.body.pipe(res);
                    })
                    .catch(e => {
                        if (i == 0) {
                            try {
                                i = 1;
                                image = JSON.parse(r.result[0].posting_json_metadata).profile.profile_image;
                            } catch (e) {
                                i = 2;
                                image = 'https://a.ipfs.dlux.io/images/user-icon.svg';
                            }
                        } else {
                            i = 2;
                            image = 'https://a.ipfs.dlux.io/images/user-icon.svg';
                        }
                        fetch(image)
                            .then(response => {
                                response.body.pipe(res);
                            })
                            .catch(e => {
                                if (i == 1) {
                                    image = 'https://a.ipfs.dlux.io/images/user-icon.svg';
                                    fetch(image)
                                        .then(response => {
                                            response.body.pipe(res);
                                        })
                                        .catch(e => {
                                            res.status(404);
                                            res.send(e);

                                        });
                                } else {
                                    res.status(404);
                                    res.send(e);
                                }
                            });
                    });
            } else {
                res.status(404);
                res.send('Image not found');
            }
        });
}

exports.getblog = (req, res, next) => {
    let un = req.params.un;
    let start = req.query.s || 0;
    res.setHeader('Content-Type', 'application/json');
    fetch(config.clientURL, {
            body: `{\"jsonrpc\":\"2.0\", \"method\":\"follow_api.get_blog_entries\", \"params\":{\"account\":\"${un}\",\"start_entry_id\":${start},\"limit\":10}, \"id\":1}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST"
        })
        .then(j => j.json())
        .then(r => {
            var out = { items: [] };
            for (i in r.result) {
                r.result[i].media = { m: "https://a.ipfs.dlux.io/images/400X200.gif" };
            }
            out.id = r.id;
            out.jsonrpc = r.jsonrpc;
            out.items = r.result;
            res.send(JSON.stringify(out, null, 3));
        });
}