var express = require('express');
const {
    check,
    validationResult
} = require('express-validator');
var router = express.Router();
const mysql = require('mysql');

// sqlに接続
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'express_db'
});

/* GET home page. */

// ---------------index ---------------------

router.get('/', function (req, res, next) {

    const sql = "select * from mydata";
    connection.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.render('hello/index', {
            title: 'Hello!',
            content: result,
        });
    });
});


// ---------------index ---------------------
// ---------------add ---------------------

// addページのgetリクエスト時の処理
router.get('/add', function (req, res, next) {
    const data = {
        title: 'Hello/add',
        content: '新しいレコードを入力',
        form: {
            name: "",
            mail: "",
            age: 0,
        }
    }
    res.render('hello/add', data);
});

// addページのpostリクエスト時の処理
router.post('/add', [
    check("name", 'NAMEは必須です').notEmpty().escape(),
    check("mail", 'MAILはメールアドレスを入力してください').isEmail().escape(),
    check('age', 'AGEは年齢（整数）を入力してください').isInt({
        min: 0
    })
], function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        let result = '<ul class = "text-danger">';
        const result_arr = errors.array();
        for (const iterator of result_arr) {
            result += '<li>' + iterator.msg + '</li>';
        }
        result += '</ul>';
        res.render('hello/add', {
            title: "Hello/add",
            content: result,
            form: req.body
        });
    } else {
        const sql = "insert into mydata (name,mail,age) values (?,?,?)";
        connection.query(sql, [req.body.name, req.body.mail, req.body.age], (err, result, fields) => {
            if (err) throw err;
            console.log('データを登録しましたよ');
            console.log(result);
        });
        res.redirect('/hello');
    }
});



// ---------------add ---------------------
// ---------------show ---------------------

// showページのgetリクエスト時の処理
router.get('/show', function (req, res) {

    const id = 4;
    const sql = "select * from mydata where id = " + id;
    connection.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.render('hello/show', {
            title: 'Hello/show',
            content: 'データ一覧はこちらです',
            mydata: {
                id: result[0].id,
                name: result[0].name,
                mail: result[0].mail,
                age: result[0].age,
            }
        });
    });
});



// ---------------show ---------------------
// ---------------edit ---------------------


// editページのgetリクエスト時の処理
router.get('/edit', function (req, res) {

    res.render('hello/edit', {
        title: 'Hello/edit',
        content: '編集内容を入力してください。',
    });
});


// editページのpostリクエスト時の処理
router.post('/edit', function (req, res) {

    const sql = "update mydata set name=?,mail=?,age=? where id = ?";
    const id = req.body.id;
    const name = req.body.name;
    const mail = req.body.mail;
    const age = req.body.age;
    connection.query(sql, [name, mail, age, id], (err, result, fields) => {
        if (err) throw err;
    });
    res.redirect('/hello');
});



// ---------------edit ---------------------
// ---------------delete ---------------------


// deleteページのgetリクエスト時の処理
router.get('/delete', function (req, res) {

    res.render('hello/delete', {
        title: 'Hello/delete',
        content: '削除ページ',
    });
});


// deleteページのpostリクエスト時の処理
router.post('/delete', function (req, res) {

    const sql = "delete from mydata where id = ?";
    const id = req.body.id;
    connection.query(sql, id, (err, result, fields) => {
        if (err) throw err;
        console.log(id + '番の投稿が削除されました');
    });
    res.redirect('/hello');
});


// ---------------delete ---------------------
// ---------------find ---------------------

// findページのgetリクエスト時の処理
router.get('/find', function (req, res) {

    res.render('hello/find', {
        title: 'Hello/find',
        content: '',
        find: '',
    });
});


// findページのpostリクエスト時の処理
router.post('/find', function (req, res) {

    const sql = "select * from mydata where ";
    const search = req.body.search;
    connection.query(sql + search, (err, result, fields) => {
        if (err) throw err;
        res.render('hello/find', {
            title: 'Hello/find',
            find: '',
            content: result,
        });
    });
});



// エキスポート
module.exports = router;