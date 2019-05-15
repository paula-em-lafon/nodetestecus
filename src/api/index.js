import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import { createTokenView, verifyTokenView}  from './views/auth'
import { verifyJWT_MW } from '../middleware/auth'

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	api.post('/login', (req,res) => 
		createTokenView(req, res));

	api.get("/login", verifyJWT_MW);
	api.get('/login', (req,res) => verifyTokenView(req,res));

	return api;
}
