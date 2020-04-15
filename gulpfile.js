const path = require(`path`); // 安全にパスを解決する
const fs = require('fs-extra'); // ファイルを操作するrequire("fs"); // ファイルを操作する
const gulp = require(`gulp`);
const plumber = require(`gulp-plumber`); //gulpをエラーで止めないために必要
const del = require("del"); // ファイル削除
const gulpEjs = require(`gulp-ejs`); //gulpでejsを扱うために必要
const rename = require(`gulp-rename`); //gulpでファイル名を変更するために必要
const prettyHtml = require(`gulp-pretty-html`); //ejsでコンパイルしたhtmlを整形する
const htmlHint = require(`gulp-htmlhint`); //ejsでコンパイルしたhtmlの品質をチェックする
const pageConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, './src/page-config.json')));
const OGPSettings = JSON.parse(fs.readFileSync(path.resolve(__dirname, './src/site-ogp-settings.json')));

/**
 * ビルド前の掃除
 */
const clean = done => {
  del (
    [
      'dist/**',
      '_cash'
    ],
    done()
  );
};


/**
 * エラー表示
 */
const notifyError = () => {
  const notify = require(`gulp-notify`);
  return notify.onError({
    title: "Gulp エラー",
    message: "Error: <%= error.message %>",
    sound: "Basso"
  });
};

const ejs = done => {
  gulp
    .src(`src/index.ejs`)
    .pipe(plumber({ errorHandler: notifyError() }))
    .pipe(gulpEjs({
        page: pageConfig.page,
        site: pageConfig.site,
        ogp: OGPSettings,
      }),
      { root: './src/index.ejs' })
    .pipe(rename({ extname: `.html` }))
    .pipe(prettyHtml({
      indent_size: 2,
      indent_char: ' ',
      preserve_newlines: false,
      unformatted: ['code', 'pre', 'em', 'strong', 'span', 'i', 'b', 'br']
    }))
    .pipe(htmlHint())
    .pipe(htmlHint.reporter())
    .pipe(htmlHint.failOnError())
    .pipe(gulp.dest('dist'));
  done();
};

exports.clean = clean;
exports.ejs = ejs;


exports.watch = () => {
  gulp.watch(`src/**/*.ejs`, ejs);
};
