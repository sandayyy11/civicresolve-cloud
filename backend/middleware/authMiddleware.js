const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    console.log("[authMiddleware] Authorization header:", authHeader);

    if (!authHeader) {
      console.log("[authMiddleware] No auth header provided");
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    let token = authHeader;

    if (typeof authHeader === "string" && authHeader.includes(" ")) {
      const [scheme, credentials] = authHeader.split(" ");
      if (scheme.toLowerCase() === "bearer" && credentials) {
        token = credentials;
      }
    }

    console.log("[authMiddleware] Extracted token:", token);

    if (!token) {
      console.log("[authMiddleware] Token is empty after extraction");
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("[authMiddleware] jwt.verify() succeeded");
      console.log("[authMiddleware] Decoded payload:", decoded);
    } catch (verifyError) {
      console.log("[authMiddleware] jwt.verify() threw:", verifyError.message);
      throw verifyError;
    }

    req.user = decoded;
    console.log("[authMiddleware] req.user set:", req.user);

    next();
  } catch (error) {
    console.log("[authMiddleware] Final auth failure:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = authMiddleware;