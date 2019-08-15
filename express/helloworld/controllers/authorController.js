const Author = require('../models/author');
const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');


// 显示完整的作者列表
exports.author_list = (req, res) => {
  res.send('未实现：作者列表');
};

// 为每位作者显示详细信息的页面
exports.author_detail = (req, res) => {
  res.send('未实现：作者详细信息：' + req.params.id);
};

// 由 GET 显示创建作者的表单
exports.author_create_get = (req, res) => {
  res.render('author_form', { title: 'Create New Author' })
  // res.send('未实现：作者创建表单的 GET');
};

// 由 POST 处理作者创建操作
exports.author_create_post = [
  // Validate fields.
  body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
    .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
  body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified.')
    .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
  body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
  body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601(),

  // Sanitize fields.
  sanitizeBody('first_name').trim().escape(),
  sanitizeBody('family_name').trim().escape(),
  sanitizeBody('date_of_birth').toDate(),
  sanitizeBody('date_of_death').toDate(),

  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render('author_form', { title: 'Create Author', author: req.body, errors: errors.array() });
      return;
    }
    else {
      // Data from form is valid.

      // Create an Author object with escaped and trimmed data.
      var author = new Author(
        {
          first_name: req.body.first_name,
          family_name: req.body.family_name,
          date_of_birth: req.body.date_of_birth,
          date_of_death: req.body.date_of_death
        });
      author.save(function (err) {
        if (err) { return next(err); }
        // Successful - redirect to new author record.
        res.redirect(author.url);
      });
    }
  }
]

// 由 GET 显示删除作者的表单
exports.author_delete_get = (req, res) => {
  res.send('未实现：作者删除表单的 GET');
};

// 由 POST 处理作者删除操作
exports.author_delete_post = (req, res) => {
  res.send('未实现：删除作者的 POST');
};

// 由 GET 显示更新作者的表单
exports.author_update_get = (req, res) => {
  res.send('未实现：作者更新表单的 GET');
};

// 由 POST 处理作者更新操作
exports.author_update_post = (req, res) => {
  res.send('未实现：更新作者的 POST');
};