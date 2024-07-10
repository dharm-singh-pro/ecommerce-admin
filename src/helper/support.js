exports.isEmpty = (value) => (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
)


exports.generateAccessToken = (user) => {
	const jwt = require('jsonwebtoken');

	const payload = {
		id: user.id,
		email: user.email
	};

	const secret = process.env.SECRET_KEY;
	const options = { expiresIn: process.env.TOKEN_EXPIRE };

	return jwt.sign(payload, secret, options);

}

exports.verifyAccessToken = verifyAccessToken = (token) => {
	const jwt = require('jsonwebtoken');

	const secret = process.env.SECRET_KEY;

	try {
		const decoded = jwt.verify(token, secret);
		return {statusCode:201,msg:'',data:{user:decoded}};
	} catch (error) {
		return {statusCode:403,msg:error.message,data:{}}
	}
}

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  const result = verifyAccessToken(token);

  if (result.statusCode != 201) {
    return res.status(result.statusCode || 403).send(result);
  }

  req.user = result.data.user;
  next();
}