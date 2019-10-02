// import '@babel/polyfill';

import path from 'path';
import Koa from 'koa';
import Pug from 'koa-pug';
import Router from 'koa-router';
import koaLogger from 'koa-logger';
import mount from 'koa-mount';
import serve from 'koa-static';
import koaWebpack from 'koa-webpack';
import bodyParser from 'koa-bodyparser';
import session from 'koa-generic-session';
import flash from 'koa-flash-simple';
import _ from 'lodash';
import methodOverride from 'koa-methodoverride';
import Rollbar from 'rollbar';

import webpackConfig from './webpack.config';
import addRoutes from './routes';
import container from './container';

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

console.log('tok', process.env.ROLLBAR_TOKEN);

const errorHandler = () => async (ctx, next) => {
  const rollbar = new Rollbar({
    accessToken: process.env.ROLLBAR_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
  });

  try {
    await next();
  } catch (e) {
    rollbar.error(e, ctx.request);
  }
};

export default () => {
  const app = new Koa();

  app.keys = ['some secret hurr'];
  app.use(session(app));
  app.use(flash());
  app.use(async (ctx, next) => {
    ctx.state = {
      flash: ctx.flash,
      isSignedIn: () => ctx.session.userId !== undefined,
    };
    await next();
  });
  app.use(bodyParser());
  app.use(methodOverride((req) => {
    // return req?.body?._method;
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      return req.body._method; // eslint-disable-line
    }
    return null;
  }));

  if (!isProduction) {
    koaWebpack({
      config: webpackConfig,
    }).then(m => app.use(m));
  } else {
    const urlPrefix = '/assets';
    const assetsPath = path.join(__dirname, 'dist/assets');
    app.use(mount(urlPrefix, serve(assetsPath)));
  }

  app.use(koaLogger());
  app.use(errorHandler());

  const router = new Router();
  addRoutes(router, container);
  app.use(router.allowedMethods());
  app.use(router.routes());

  const pug = new Pug({
    viewPath: path.join(__dirname, 'views'),
    noCache: isDevelopment,
    debug: true,
    pretty: true,
    compileDebug: true,
    locals: {
      Title: 'Task manager 2019',
    },
    basedir: path.join(__dirname, 'views'),
    helperPath: [
      { _ },
      { urlFor: (...args) => router.url(...args) },
    ],
  });
  pug.use(app);
  return app;
};
