module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { commentController } = container.resolve('controller')
  const { basePath } = serverSettings
  app.get(`${basePath}/comments`, commentController.getComment)
  app.get(`${basePath}/comments/:id`, commentController.getCommentById)
  app.put(`${basePath}/comments/:id`, commentController.updateComment)
  app.delete(`${basePath}/comments/:id`, commentController.deleteComment)
  app.post(`${basePath}/comments`, commentController.addComment)
}
