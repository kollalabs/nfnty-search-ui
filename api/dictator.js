module.exports = async (req, res) => { // this function will be launched when the API is called.
  try {
    res.send(process.env.DICTATORS_NAME) // send the dictators name
  } catch (err) {
    res.send(err) // send the thrown error
  }
}
