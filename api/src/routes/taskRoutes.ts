import { Router } from 'express';
import * as taskController from '../controllers/taskController';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createTaskSchema,
  projectIdParamSchema,
  taskIdParamSchema,
  taskQuerySchema,
  updateTaskSchema,
} from '../validators/taskSchemas';

const router = Router({ mergeParams: true });

router.use(requireAuth);

router.get(
  '/',
  validate(projectIdParamSchema, 'params'),
  validate(taskQuerySchema, 'query'),
  taskController.list
);
router.post(
  '/',
  validate(projectIdParamSchema, 'params'),
  validate(createTaskSchema),
  taskController.create
);
router.get('/:taskId', validate(taskIdParamSchema, 'params'), taskController.get);
router.patch(
  '/:taskId',
  validate(taskIdParamSchema, 'params'),
  validate(updateTaskSchema),
  taskController.update
);
router.delete(
  '/:taskId',
  validate(taskIdParamSchema, 'params'),
  taskController.remove
);

export default router;
