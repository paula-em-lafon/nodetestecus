import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import auth from './auth'
import pics from './pictures'

export default ({ config, db }) => {
	let api = Router();

	// this came with the boilerplate mounts facet resource
	// api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	// add pictures routes
	api.use('/pictures', pics)

	// add auth routes
	api.use('/auth', auth)
	return api;
}
