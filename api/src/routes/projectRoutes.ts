import { Router } from 'express';
import * as projectController from '../controllers/projectController';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createProjectSchema,
  objectIdParamSchema,
  updateProjectSchema,
} from '../validators/projectSchemas';

const router = Router();

router.use(requireAuth);

router.get('/', projectController.list);
router.post('/', validate(createProjectSchema), projectController.create);
router.get(
  '/:id',
  validate(objectIdParamSchema, 'params'),
  projectController.get
);
router.patch(
  '/:id',
  validate(objectIdParamSchema, 'params'),
  validate(updateProjectSchema),
  projectController.update
);
router.delete(
  '/:id',
  validate(objectIdParamSchema, 'params'),
  projectController.remove
);

export default router;
