import User from '../models/user.model';

const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

export default {
  getMe,
};
