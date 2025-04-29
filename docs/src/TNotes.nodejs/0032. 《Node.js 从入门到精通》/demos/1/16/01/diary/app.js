var express = require('express')
    , gzippo = require('gzippo')
    , routes = require('./routes')
    , crypto = require('crypto')
    , moment = require('moment')
    , cluster = require('cluster')
    , path = require('path')
    , os = require('os');

var mongojs = require('mongojs');
var db = mongojs('blog', ['post', 'user']);
var conf = {
    salt: 'rdasSDAg'
};

// 创建服务器
var app = module.exports = express.createServer();

// 配置参数
app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({secret: 'wasdsafeAD'}));
    app.use(express.static(path.join(__dirname, 'public')));
    //app.use(gzippo.staticGzip(__dirname + '/public'));
    app.use(app.router);
});

app.configure('development', function () {
    app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.configure('production', function () {
    //app.use(express.errorHandler());
});

app.helpers({
    moment: moment
});

app.dynamicHelpers({
    user: function (req, res) {
        return req.session.user;
    },
    flash: function (req, res) {
        return req.flash();
    }
});

// 登录
app.get('/login', function (req, res) {
    res.render('login.jade', {
        title: 'Login user'
    });
});

app.get('/logout', isUser, function (req, res) {
    req.session.destroy();
    res.redirect('/');
});

app.post('/login', function (req, res) {
    var select = {
        user: req.body.username
        , pass: req.body.password
    };

    db.user.findOne(select, function (err, user) {
        if (!err && user) {
            // Found user register session
            req.session.user = user;
            res.redirect('/');
        } else {
            // User not found lets go through login again
            res.redirect('/login');
        }

    });
});

// 页面路由配置
function isUser(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        next(new Error('请必须使用用户登录！'));
    }
}

app.error(function (err, req, res, next) {
    if (err instanceof NotFound) {
        res.render('error/404.jade', {title: 'Not found 404'});
    } else {
        res.render('error/500.jade', {title: 'Error', error: err});
    }
});

app.get('/', function (req, res) {
    var fields = {subject: 1, body: 1, tags: 1, created: 1, author: 1};
    db.post.find({state: 'published'}, fields).sort({created: -1}, function (err, posts) {
        if (!err && posts) {
            res.render('index.jade', {title: '心情日记', postList: posts});
        }
    });
});

app.get('/post/add', isUser, function (req, res) {
    res.render('add.jade', {title: '添加新的日记 '});
});

app.post('/post/add', isUser, function (req, res) {
    var values = {
        subject: req.body.subject
        , body: req.body.body
        , tags: req.body.tags.split(',')
        , state: 'published'
        , created: new Date()
        , modified: new Date()
        , comments: []
        , author: {
            username: req.session.user.user
        }
    };

    db.post.insert(values, function (err, post) {
        console.log(err, post);
        res.redirect('/');
    });
});
// 显示日记列表
app.param('postid', function (req, res, next, id) {
    if (id.length != 24) throw new NotFound('日记id长度错误！');

    db.post.findOne({_id: db.ObjectId(id)}, function (err, post) {
        if (err) return next(new Error('日记id错误！'));
        if (!post) return next(new Error('日记加载失败！'));
        req.post = post;
        next();
    });
});

app.get('/post/edit/:postid', isUser, function (req, res) {
    res.render('edit.jade', {title: '修改日记', blogPost: req.post});
});

app.post('/post/edit/:postid', isUser, function (req, res) {
    db.post.update({_id: db.ObjectId(req.body.id)}, {
            $set: {
                subject: req.body.subject
                , body: req.body.body
                , tags: req.body.tags.split(',')
                , modified: new Date()
            }
        },
        function (err, post) {
            if (!err) {
                req.flash('info', '日记修改成功！');
            }
            res.redirect('/');
        });
});

app.get('/post/delete/:postid', isUser, function (req, res) {
    db.post.remove({_id: db.ObjectId(req.params.postid)}, function (err, field) {
        if (!err) {
            req.flash('error', '日记删除成功');
        }
        res.redirect('/');
    });
});

app.get('/post/:postid', function (req, res) {
    res.render('show.jade', {
        title: 'Showing post - ' + req.post.subject,
        post: req.post
    });
});

// 添加日记
app.post('/post/comment', function (req, res) {
    var data = {
        name: req.body.name
        , body: req.body.comment
        , created: new Date()
    };
    db.post.update({_id: db.ObjectId(req.body.id)}, {
        $push: {comments: data}
    }, {safe: true}, function (err, field) {
        if (!err) {
            req.flash('success', '添加评论成功');
        }
        res.redirect('/');
    });
});

//The 404
app.get('/*', function (req, res) {
    throw new NotFound;
});

function NotFound(msg) {
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}

if (cluster.isMaster) {
    // Be careful with forking workers
    for (var i = 0; i < os.cpus().length * 1; i++) {
        var worker = cluster.fork();
    }
} else {
    app.listen(3000);
}


