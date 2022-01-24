
const users = ["Bob Smith", "Guillaume Bibeau"];

module.exports = async (req, res) => { // this function will be launched when the API is called.
  const { id } = req.query;
  res.status(200).json({ user: users[0] });
}
