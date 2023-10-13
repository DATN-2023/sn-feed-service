module.exports = container => {
  const { schemas } = container.resolve('models')
  const { feed } = schemas
  const addfeed = (cate) => {
    const c = new feed(cate)
    return c.save()
  }
  const getfeedById = (id) => {
    return feed.findById(id)
  }
  const deletefeed = (id) => {
    return feed.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updatefeed = (id, n) => {
    return feed.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return feed.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return feed.countDocuments(pipe)
  }
  const getfeedAgg = (pipe) => {
    return feed.aggregate(pipe)
  }
  const getfeed = (pipe, limit, skip, sort) => {
    return feed.find(pipe).limit(limit).skip(skip).sort(sort)
  }
  const getfeedNoPaging = (pipe) => {
    return feed.find(pipe)
  }
  const removefeed = (pipe) => {
    return feed.deleteMany(pipe)
  }
  return {
    getfeedNoPaging,
    removefeed,
    addfeed,
    getfeedAgg,
    getfeedById,
    deletefeed,
    updatefeed,
    checkIdExist,
    getCount,
    getfeed
  }
}
