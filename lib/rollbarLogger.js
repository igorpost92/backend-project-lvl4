import Rollbar from 'rollbar';

export default () => {
  const rollbar = new Rollbar({
    accessToken: process.env.ROLLBAR_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
  });

  const logger = async (ctx, next) => {
    try {
      await next();
    } catch (e) {
      rollbar.error(e, ctx.request);
      throw e;
    }
  };

  return logger;
};
