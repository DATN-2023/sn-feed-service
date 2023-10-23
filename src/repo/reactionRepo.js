module.exports = container => {
  const { schemas } = container.resolve('models')
  const { Reaction } = schemas
  const addReaction = (cate) => {
    const c = new Reaction(cate)
    return c.save()
  }
  const getReactionById = (id) => {
    return Reaction.findById(id)
  }
  const deleteReaction = (id) => {
    return Reaction.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateReaction = (id, n) => {
    return Reaction.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return Reaction.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return Reaction.countDocuments(pipe)
  }
  const getReactionAgg = (pipe) => {
    return Reaction.aggregate(pipe)
  }
  const getReaction = (pipe, limit, skip, sort) => {
    return Reaction.find(pipe).limit(limit).skip(skip).sort(sort)
  }
  const getReactionNoPaging = (pipe) => {
    return Reaction.find(pipe)
  }
  const removeReaction = (pipe) => {
    return Reaction.deleteMany(pipe)
  }
  return {
    getReactionNoPaging,
    removeReaction,
    addReaction,
    getReactionAgg,
    getReactionById,
    deleteReaction,
    updateReaction,
    checkIdExist,
    getCount,
    getReaction
  }
}
