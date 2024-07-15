const isAdmin = (req, res, next) => {
  console.log(req.body.user);
  if (req.body.user.role == "admin") {
    next();
    return;
  }
  return res.sendStatus(403);
};

module.exports = isAdmin;
