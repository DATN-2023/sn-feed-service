module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { writeController } = container.resolve('controller')
  const { basePath } = serverSettings
  app.put(`${basePath}/cdc/feeds/:id`, writeController.updateFeed)
  app.delete(`${basePath}/cdc/feeds/:id`, writeController.deleteFeed)
  app.post(`${basePath}/cdc/feeds`, writeController.addFeed)
  app.put(`${basePath}/cdc/comments/:id`, writeController.updateComment)
  app.delete(`${basePath}/cdc/comments/:id`, writeController.deleteComment)
  app.post(`${basePath}/cdc/comments`, writeController.addComment)
  app.put(`${basePath}/cdc/reactions/:id`, writeController.updateReaction)
  app.delete(`${basePath}/cdc/reactions/:id`, writeController.deleteReaction)
  app.post(`${basePath}/cdc/reactions`, writeController.addReaction)
}
