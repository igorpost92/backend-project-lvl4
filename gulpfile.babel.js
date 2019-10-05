// import '@babel/polyfill';

import gulp from 'gulp';
// import gutil from 'gulp-util';
import repl from 'repl';
import container from './container';
import getServer from '.';
import db from './models';

// gulp.task('default', console.log('hello!'));

gulp.task('console', () => {
  // gutil.log = gutil.noop;
  const replServer = repl.start({
    prompt: 'Application console > ',
  });

  Object.keys(container).forEach((key) => {
    replServer.context[key] = container[key];
  });

  replServer.context.db = db;
});

gulp.task('server', (cb) => {
  getServer().listen(process.env.PORT || 4000, cb);
});

gulp.task('sync-db', () => {
  db.sequelize.sync();
});
