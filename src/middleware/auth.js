import { verifyJWTToken } from '../lib/auth'
/** verifies token and adds user to request so one can heck if user owns things
* @param req = json request
* @param res = response
* @param next = object being used
* @usage 
*  before actual api routes
*  routername.get("/verifytoken", verifyJWT_MW);
*  routername.all(*,verfiJWT_MW)
*/
export function verifyJWT_MW(req, res, next)
{
  let token = req.headers.authorization;
  
  verifyJWTToken(token)
    .then((decodedToken) =>
    {
      req.user = decodedToken.data
      next()
    })
    .catch((err) =>
    {
      res.status(400)
        .json({message: "Invalid auth token provided."})
    })
}