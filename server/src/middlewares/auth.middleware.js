import { readAccessToken } from "../utils/auth.utils.js";

export function authenticate(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(400).json({
      message: "Access token not found in the request header",
    });
  }

  const [scheme, accessToken, ...extraParts] = authorization
    .trim()
    .split(/\s+/);
  if (
    scheme?.toLowerCase() !== "bearer" ||
    !accessToken ||
    extraParts.length > 0
  ) {
    return res.status(401).json({
      message: "Invalid or expired access token",
    });
  }

  let decoded;
  try {
    decoded = readAccessToken(accessToken);
  } catch {
    return res.status(401).json({
      message: "Invalid or expired access token",
    });
  }

  req.user = decoded;
  return next();
}
