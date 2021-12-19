var express = require('express');
var router = express.Router();
const db = require('../models/index');
const {
  Op,
  where
} = require('sequelize');
const {
  check,
  validationResult
} = require('express-validator');

/* GET users listing. */
router.get('/', function (req, res, next) {
  db.User.findAll({
    where: {
      age: {
        [Op.or]: {
          [Op.gte]: 10,
          [Op.lte]: 40
        }
      }
    }
  }).then(users => {
    let data = {
      title: 'User/Index',
      content: users,
    }
    res.render('users/index', data);
  })
});


// ----------------------add--------------------------------

router.get('/add', function (req, res, next) {

  let data = {
    title: 'User/add',
    content: 'データを登録',
    form: {
      name: "",
      mail: "",
      age: 0,
    }
  }
  res.render('users/add', data);
});

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
    res.render('users/add', {
      title: "User/add",
      content: result,
      form: req.body
    });
  } else {
    db.sequelize.sync()
      .then(() => db.User.create({
        name: req.body.name,
        pass: req.body.pass,
        mail: req.body.mail,
        age: req.body.age
      }))
      .then(user => {
        res.redirect('/users');
      })
  }
});

// ----------------------add--------------------------------
// ----------------------edit ------------------------------


// editページのgetリクエスト時の処理
router.get('/edit', function (req, res) {

  res.render('users/edit', {
    title: 'Users/edit',
    content: '編集内容を入力してください。',
  });
});


// editページのpostリクエスト時の処理
router.post('/edit', function (req, res) {
  db.sequelize.sync()
    .then(() => db.User.update({
      name: req.body.name,
      pass: req.body.pass,
      mail: req.body.mail,
      age: req.body.age
    }, {
      where: {
        id: 1
      }
    }))
    .then(user => {
      res.redirect('/users');
    })
});



// ----------------------edit ------------------------------
// ----------------------delete ------------------------------


// deleteページのgetリクエスト時の処理
router.get('/delete', function (req, res) {

  res.render('users/delete', {
    title: 'Users/delete',
    content: '削除ページ',
  });
});


// deleteページのpostリクエスト時の処理
router.post('/delete', function (req, res) {

  db.sequelize.sync()
    .then(() => db.User.destroy({
      where: {
        id: req.body.id
      }
    })).then(user => {
      res.redirect('/users');
    })
});


// ---------------delete ---------------------
// ---------------find ---------------------

// findページのgetリクエスト時の処理
router.get('/find', function (req, res) {

  res.render('users/find', {
    title: 'Users/find',
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
    res.render('users/find', {
      title: 'Users/find',
      find: '',
      content: result,
    });
  });
});


module.exports = router;