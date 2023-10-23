module.exports = (container) => {
  const logger = container.resolve('logger')
  const ObjectId = container.resolve('ObjectId')
  const {
    schemaValidator
  } = container.resolve('models')
  const { httpCode, serverHelper } = container.resolve('config')
  const { feedRepo } = container.resolve('repo')
  const addFeed = async (req, res) => {
    try {
      const thoauoc = req.body
      const {
        error,
        value
      } = await schemaValidator(thoauoc, 'Feed')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
      }
      const sp = await feedRepo.addFeed(value)
      res.status(httpCode.CREATED).json(sp)
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).end()
    }
  }
  const deleteFeed = async (req, res) => {
    try {
      const { id } = req.params
      if (id) {
        await feedRepo.deleteFeed(id)
        res.status(httpCode.SUCCESS).json({ ok: true })
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ ok: false })
    }
  }
  const updateFeed = async (req, res) => {
    try {
      const { id } = req.params
      const feed = req.body
      const {
        error,
        value
      } = await schemaValidator(feed, 'Feed')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
      }
      if (id && feed) {
        const sp = await feedRepo.updateFeed(id, value)
        res.status(httpCode.SUCCESS).json(sp)
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ ok: false })
    }
  }
  return {
    addFeed,
    updateFeed,
    deleteFeed
  }
}
