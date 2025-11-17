const jose = require('jose'); 

async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const alg = "RS256";
  const testKey = process.env.USERFRONT_TEST_KEY;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Bearer token missing in Authorization header" });
  }

  const spki = testKey;
  const publicKey = await jose.importSPKI(spki, alg);

  try {
    const { payload } = await jose.jwtVerify(token, publicKey);

    req.auth = payload;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Token verification failed", error: err.message });
  }
}

module.exports = {
  authenticateToken
};