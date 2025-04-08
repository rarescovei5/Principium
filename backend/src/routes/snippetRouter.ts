import express from 'express';
import * as snippetController from '../controllers/snippetController';

import { verifyJWT } from '../middleware/verifyJWT';

const snippetRouter = express.Router();

snippetRouter
  .get('/:id', snippetController.handleGetById)
  .get('/:page', snippetController.handleGetPage)
  .use(verifyJWT)
  .post('/', snippetController.handleCreate)
  .put('/:id', snippetController.handleModify)
  .delete('/:id', snippetController.handleDelete);

export default snippetRouter;
