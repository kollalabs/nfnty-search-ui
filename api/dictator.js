module.exports = async (req, res) => { // this function will be launched when the API is called.
  try {
    data = {
      "name": process.env.DICTATORS_NAME
    }
    res.send(data) // send the dictators name
  } catch (err) {
    res.send(err) // send the thrown error
  }
}
