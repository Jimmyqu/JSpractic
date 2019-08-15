const Genre = require('../models/genre');
const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

// 显示完整的藏书种类列表
exports.genre_list = (req, res) => {
  res.send('未实现：藏书种类列表');
};

// 为每一类藏书显示详细信息的页面
exports.genre_detail = (req, res) => {
  res.send('未实现：藏书种类详细信息：' + req.params.id);
};

// 由 GET 显示创建藏书种类的表单
exports.genre_create_get = (req, res) => {
  res.render('genre_form', { title: 'Create Genre' });
  // res.send('未实现：藏书种类创建表单的 GET');
};

// 由 POST 处理藏书种类创建操作
//做验证的控制器是指定一组中间件函数。数组传递给路由器函数，并按顺序调用每个方法
exports.genre_create_post = [

  // Validate that the name field is not empty.
  body('name', 'Genre name required').isLength({ min: 1 }).trim(),

  // Sanitize (trim and escape) the name field.
  sanitizeBody('name').trim().escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
   
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    var genre = new Genre(
      { name: req.body.name }
    );


    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array() });
      return;
    }
    else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      Genre.findOne({ 'name': req.body.name })
        .exec(function (err, found_genre) {
          if (err) { return next(err); }

          if (found_genre) {
            // Genre exists, redirect to its detail page.
            res.redirect(found_genre.url);
          }
          else {

            genre.save(function (err) {
              if (err) { return next(err); }
              // Genre saved. Redirect to genre detail page.
              res.redirect(genre.url);
            });

          }

        });
    }
  }
];

// 由 GET 显示删除藏书种类的表单
exports.genre_delete_get = (req, res) => {
  res.send('未实现：藏书种类删除表单的 GET');
};

// 由 POST 处理藏书种类删除操作
exports.genre_delete_post = (req, res) => {
  res.send('未实现：删除藏书种类的 POST');
};

// 由 GET 显示更新藏书种类的表单
exports.genre_update_get = (req, res) => {
  res.send('未实现：藏书种类更新表单的 GET');
};

// 由 POST 处理藏书种类更新操作
exports.genre_update_post = (req, res) => {
  res.send('未实现：更新藏书种类的 POST');
};