exports.ping = (req, res) => {
    res.json({
      message: "pong",
      time: new Date().toISOString()
    });
  };
  