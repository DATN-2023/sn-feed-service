module.exports = container => {
  const { schemas } = container.resolve('models')
  const { Feed } = schemas
  const addFeed = (cate) => {
    const c = new Feed(cate)
    return c.save()
  }
  const getFeedById = (id) => {
    return Feed.findById(id)
  }
  const deleteFeed = (id) => {
    return Feed.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateFeed = (id, n) => {
    return Feed.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return Feed.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return Feed.countDocuments(pipe)
  }
  const getFeedAgg = (pipe) => {
    return Feed.aggregate(pipe)
  }
  const getFeed = (pipe, limit, skip, sort) => {
    return Feed.find(pipe).limit(limit).skip(skip).sort(sort)
  }
  const getFeedNoPaging = (pipe) => {
    return Feed.find(pipe)
  }
  const removeFeed = (pipe) => {
    return Feed.deleteMany(pipe)
  }
  return {
    getFeedNoPaging,
    removeFeed,
    addFeed,
    getFeedAgg,
    getFeedById,
    deleteFeed,
    updateFeed,
    checkIdExist,
    getCount,
    getFeed
  }
}
