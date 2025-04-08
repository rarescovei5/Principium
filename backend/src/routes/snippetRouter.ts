import express from 'express';
import * as snippetController from '../controllers/snippetController';

import { verifyJWT } from '../middleware/verifyJWT';

const snippetRouter = express.Router();

snippetRouter
  .get('/page/:page', snippetController.handleGetPage)
  .use(verifyJWT)
  .get('/:id', snippetController.handleGetById)
  .post('/', snippetController.handleCreate)
  .put('/:id', snippetController.handleModify)
  .delete('/:id', snippetController.handleDelete);

export default snippetRouter;
