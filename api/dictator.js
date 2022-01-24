
module.exports = async (req, res) => { // this function will be launched when the API is called.
  var d = process.env.DICTATOR_NAME
  res.status(200).json({ name: d });
}
