const validateLocation = (req, res, next) => {
  const { name, address, location } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({
      error: 'Invalid location name format'
    });
  }

  if (!address || typeof address !== 'string') {
    return res.status(400).json({
      error: 'Invalid address format'
    });
  }

  if (!location || !location.lat || !location.lng) {
    return res.status(400).json({
      error: 'Invalid coordinates format'
    });
  }

  next();
};

module.exports = {
  validateLocation
};