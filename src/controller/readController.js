module.exports = (container) => {
  const logger = container.resolve('logger')
  const ObjectId = container.resolve('ObjectId')
  const {
    schemas: {
      Feed,
      Comment,
      Reaction
    }
  } = container.resolve('models')
  const { httpCode, serverHelper } = container.resolve('config')
  const { feedRepo, reactionRepo, commentRepo } = container.resolve('repo')

  const checkReactedFeed = async (ids, createdBy) => {
    let targetIds
    if (ids.constructor === Array) {
      targetIds = ids
    } else if (ids.constructor === String) {
      targetIds = ids.split(',')
    }
    targetIds = targetIds.map(id => new ObjectId(id))
    const reactions = await reactionRepo.getReactionNoPaging({ createdBy, targetId: { $in: targetIds } })
    const reactionMap = {}
    reactions.forEach((e) => {
      reactionMap[e.targetId.toString()] = 1
    })
    return reactionMap
  }
  const mapReactionWithFeed = (mapper, feeds) => {
    if (feeds.constructor === Object) {
      feeds.liked = mapper[feeds._id.toString()] || 0
    } else {
      for (const feed of feeds) {
        console.log(feed._id.toString())
        feed.liked = mapper[feed._id.toString()] || 0
      }
    }
  }
  const getFeedById = async (req, res) => {
    try {
      const { id } = req.params
      if (id) {
        const feedId = id.split('-')[0]
        const userId = id.split('-')[1]
        const feed = await feedRepo.getFeedById(feedId)
        const reactionMap = await checkReactedFeed(feedId, new ObjectId(userId))
        mapReactionWithFeed(reactionMap, feed)
        res.status(httpCode.SUCCESS).send(feed)
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const getFeed = async (req, res) => {
    try {
      let {
        page,
        perPage,
        sort,
        ids,
        createdBy
      } = req.query
      page = +page || 1
      perPage = +perPage || 10
      sort = +sort === 0 ? { _id: 1 } : +sort || { _id: -1 }
      const skip = (page - 1) * perPage
      const search = { ...req.query }
      if (ids) {
        if (ids.constructor === Array) {
          search.id = { $in: ids }
        } else if (ids.constructor === String) {
          search.id = { $in: ids.split(',') }
        }
      }
      delete search.ids
      delete search.page
      delete search.perPage
      delete search.sort
      delete search.createdBy
      const pipe = {}
      Object.keys(search).forEach(i => {
        const vl = search[i]
        const pathType = (Feed.schema.path(i) || {}).instance || ''
        if (pathType.toLowerCase() === 'objectid') {
          pipe[i] = new ObjectId(vl)
        } else if (pathType === 'Number') {
          pipe[i] = +vl
        } else if (pathType === 'String' && vl.constructor === String) {
          pipe[i] = new RegExp(vl, 'gi')
        } else {
          pipe[i] = vl
        }
      })
      const data = await feedRepo.getFeed(pipe, perPage, skip, sort)
      const total = await feedRepo.getCount(pipe)
      const feedIds = data.map(feed => feed._id.toString())
      const reactionMap = await checkReactedFeed(feedIds, createdBy)
      mapReactionWithFeed(reactionMap, data)
      res.status(httpCode.SUCCESS).send({
        perPage,
        skip,
        sort,
        data,
        total,
        page
      })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const getComment = async (req, res) => {
    try {
      let {
        page,
        perPage,
        sort,
        ids
      } = req.query
      page = +page || 1
      perPage = +perPage || 10
      sort = +sort === 0 ? { _id: 1 } : +sort || { _id: -1 }
      const skip = (page - 1) * perPage
      const search = { ...req.query }
      if (ids) {
        if (ids.constructor === Array) {
          search.id = { $in: ids }
        } else if (ids.constructor === String) {
          search.id = { $in: ids.split(',') }
        }
      }
      delete search.ids
      delete search.page
      delete search.perPage
      delete search.sort
      const pipe = {}
      Object.keys(search).forEach(i => {
        const vl = search[i]
        const pathType = (Comment.schema.path(i) || {}).instance || ''
        if (pathType.toLowerCase() === 'objectid') {
          pipe[i] = new ObjectId(vl)
        } else if (pathType === 'Number') {
          pipe[i] = +vl
        } else if (pathType === 'String' && vl.constructor === String) {
          pipe[i] = new RegExp(vl, 'gi')
        } else {
          pipe[i] = vl
        }
      })
      const data = await commentRepo.getComment(pipe, perPage, skip, sort)
      const total = await commentRepo.getCount(pipe)
      res.status(httpCode.SUCCESS).send({
        perPage,
        skip,
        sort,
        data,
        total,
        page
      })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const getCommentById = async (req, res) => {
    try {
      const { id } = req.params
      if (id) {
        const comment = await commentRepo.getCommentById(id)
        res.status(httpCode.SUCCESS).send(comment)
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const getReaction = async (req, res) => {
    try {
      let {
        page,
        perPage,
        sort,
        ids
      } = req.query
      page = +page || 1
      perPage = +perPage || 10
      sort = +sort === 0 ? { _id: 1 } : +sort || { _id: -1 }
      const skip = (page - 1) * perPage
      const search = { ...req.query }
      if (ids) {
        if (ids.constructor === Array) {
          search.id = { $in: ids }
        } else if (ids.constructor === String) {
          search.id = { $in: ids.split(',') }
        }
      }
      delete search.ids
      delete search.page
      delete search.perPage
      delete search.sort
      const pipe = {}
      Object.keys(search).forEach(i => {
        const vl = search[i]
        const pathType = (Reaction.schema.path(i) || {}).instance || ''
        if (pathType.toLowerCase() === 'objectid') {
          pipe[i] = ObjectId(vl)
        } else if (pathType === 'Number') {
          pipe[i] = +vl
        } else if (pathType === 'String' && vl.constructor === String) {
          pipe[i] = new RegExp(vl, 'gi')
        } else {
          pipe[i] = vl
        }
      })
      const data = await reactionRepo.getReaction(pipe, perPage, skip, sort)
      const total = await reactionRepo.getCount(pipe)
      res.status(httpCode.SUCCESS).send({
        perPage,
        skip,
        sort,
        data,
        total,
        page
      })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const getReactionById = async (req, res) => {
    try {
      const { id } = req.params
      if (id) {
        const reaction = await reactionRepo.getReactionById(id)
        res.status(httpCode.SUCCESS).send(reaction)
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  return {
    getFeed,
    getFeedById,
    getCommentById,
    getComment,
    getReactionById,
    getReaction
  }
}
