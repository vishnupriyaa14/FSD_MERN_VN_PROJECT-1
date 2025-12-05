import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;

      if (req.user.usertype) {
        req.user.usertype = req.user.usertype.toLowerCase();
      }

      next();
      return;
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token invalid" });
    }
  }

  // no token
  return res.status(401).json({ message: "Not authorized, no token provided" });
};
