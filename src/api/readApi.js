module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { readController } = container.resolve('controller')
  const { basePath } = serverSettings
  app.get(`${basePath}/sdp/feeds`, readController.getFeed)
  app.get(`${basePath}/sdp/feeds/:id`, readController.getFeedById)
}
