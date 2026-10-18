import mongoose, { Document, Schema, Types } from 'mongoose';

export const TASK_STATUSES = ['To Do', 'In Progress', 'Done'] as const;
export const TASK_PRIORITIES = ['Low', 'Medium', 'High'] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export interface ITask extends Document {
  projectId: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    status: {
      type: String,
      enum: TASK_STATUSES,
      default: 'To Do',
      index: true,
    },
    priority: {
      type: String,
      enum: TASK_PRIORITIES,
      default: 'Medium',
      index: true,
    },
    dueDate: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

taskSchema.index({ userId: 1, status: 1, priority: 1 });
taskSchema.index({ projectId: 1, status: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });

export const Task = mongoose.model<ITask>('Task', taskSchema);
