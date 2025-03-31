export {router as default, router};

const routes = {
  '/clickup': app.clickup.handle,
  '/telegram': app.telegram.handle,
};

const router = {
  /**
   * @author @almaceleste https://almaceleste.github.io
   * @param {string} route
   * @return {thenable}
   */
  resolve: (route) => routes[route],
};
/**
 * @author @almaceleste https://almaceleste.github.io
 * @callback thenable
 * @return {Promise}
 */
