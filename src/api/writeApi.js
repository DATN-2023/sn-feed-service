module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { writeController } = container.resolve('controller')
  const { basePath } = serverSettings
  app.put(`${basePath}/cdc/feeds/:id`, writeController.updateFeed)
  app.delete(`${basePath}/cdc/feeds/:id`, writeController.deleteFeed)
  app.post(`${basePath}/cdc/feeds`, writeController.addFeed)
}
