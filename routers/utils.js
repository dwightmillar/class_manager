async function queryCallback(res, next, error, data)
{
  if (error) return next(error)
  
  data = Array.isArray(data) ? data.map((datapoint) => {
    let { class_id, user, ...rest } = datapoint
    return rest
  }) : data
  return res.send({ data })
}

module.exports = {queryCallback}