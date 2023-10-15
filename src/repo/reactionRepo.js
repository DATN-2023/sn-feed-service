module.exports = container => {
  const { schemas } = container.resolve('models')
  const { reaction } = schemas
  const addreaction = (cate) => {
    const c = new reaction(cate)
    return c.save()
  }
  const getreactionById = (id) => {
    return reaction.findById(id)
  }
  const deletereaction = (id) => {
    return reaction.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updatereaction = (id, n) => {
    return reaction.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return reaction.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return reaction.countDocuments(pipe)
  }
  const getreactionAgg = (pipe) => {
    return reaction.aggregate(pipe)
  }
  const getreaction = (pipe, limit, skip, sort) => {
    return reaction.find(pipe).limit(limit).skip(skip).sort(sort)
  }
  const getreactionNoPaging = (pipe) => {
    return reaction.find(pipe)
  }
  const removereaction = (pipe) => {
    return reaction.deleteMany(pipe)
  }
  return {
    getreactionNoPaging,
    removereaction,
    addreaction,
    getreactionAgg,
    getreactionById,
    deletereaction,
    updatereaction,
    checkIdExist,
    getCount,
    getreaction
  }
}
