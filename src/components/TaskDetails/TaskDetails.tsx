import { useState } from 'react';
import type { Task, TaskFormData, TaskPriority, TaskStatus } from '../../types/task';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Input, Textarea } from '../ui/Input/Input';
import { Button } from '../ui/Button/Button';
import { Tag } from '../ui/Tag/Tag';
import { FocusButton } from '../FocusButton/FocusButton';
import { format, parseISO } from 'date-fns';
import { useConfirmation } from '../../contexts/ConfirmationContext';
import styles from './TaskDetails.module.scss';

interface TaskDetailsProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskId: string | null, data: TaskFormData) => void;
  onDelete: (taskId: string) => void;
  onStartFocus?: (taskId: string) => void;
}

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string(),
  dueDate: Yup.string().nullable(),
  priority: Yup.string().oneOf(['Normal', 'Low', 'High']).required(),
  status: Yup.string().oneOf(['Pending', 'In Progress', 'Completed']).required(),
  tags: Yup.array().of(Yup.string()),
});

export const TaskDetails = ({ task, isOpen, onClose, onSave, onDelete, onStartFocus }: TaskDetailsProps) => {
  const [newTag, setNewTag] = useState('');
  const { confirm } = useConfirmation();

  if (!isOpen) return null;

  const initialValues: TaskFormData = task
    ? {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate ? format(parseISO(task.dueDate), "yyyy-MM-dd'T'HH:mm") : null,
      priority: task.priority,
      status: task.status,
      tags: [...task.tags],
    }
    : {
      title: '',
      description: '',
      dueDate: null,
      priority: 'Normal',
      status: 'Pending',
      tags: [],
    };

  const handleSubmit = (values: TaskFormData) => {
    const formattedData: TaskFormData = {
      ...values,
      dueDate: values.dueDate
        ? new Date(values.dueDate).toISOString()
        : null,
    };
    onSave(task?.taskId || null, formattedData);
    onClose();
  };

  const handleDelete = async () => {
    if (!task) return;

    const confirmed = await confirm({
      title: 'Delete Task',
      message: `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });

    if (confirmed) {
      onDelete(task.taskId);
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-details-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="task-details-title" className={styles.title}>
            Task Details
          </h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close modal"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors, touched }) => {
            const addTag = () => {
              const trimmedTag = newTag.trim();
              if (trimmedTag && !values.tags.some((tag) => tag.toLowerCase() === trimmedTag.toLowerCase())) {
                setFieldValue('tags', [...values.tags, trimmedTag]);
                setNewTag('');
              }
            };

            const removeTag = (tagToRemove: string) => {
              setFieldValue(
                'tags',
                values.tags.filter((tag) => tag !== tagToRemove)
              );
            };

            return (
              <Form className={styles.form}>
                {task && (
                  <div className={styles.taskIdentifier}>
                    <FontAwesomeIcon icon={faClipboard} className={styles.taskIcon} />
                    <span className={styles.taskTitlePreview}>{task.title}</span>
                  </div>
                )}

                <Input
                  name="title"
                  label="Title"
                  placeholder="Enter task title"
                  error={touched.title && errors.title ? errors.title : undefined}
                />

                <Textarea
                  name="description"
                  label="Description"
                  placeholder="Enter task description"
                  error={
                    touched.description && errors.description
                      ? errors.description
                      : undefined
                  }
                />

                {task && task.status !== 'Completed' && onStartFocus && (
                  <div className={styles.focusButtonContainer}>
                    <FocusButton taskId={task.taskId} onStartFocus={(taskId) => onStartFocus(taskId)} />
                  </div>
                )}

                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Status</label>
                    <div className={styles.statusButtons}>
                      {(['Pending', 'In Progress', 'Completed'] as TaskStatus[]).map(
                        (status) => (
                          <button
                            key={status}
                            type="button"
                            className={`${styles.statusButton} ${values.status === status ? styles.active : ''} ${styles[status.toLowerCase().replace(' ', '-')]}`}
                            onClick={() => setFieldValue('status', status)}
                          >
                            {status}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Priority</label>
                    <div className={styles.priorityButtons}>
                      {(['High', 'Normal', 'Low'] as TaskPriority[]).map((priority) => (
                        <button
                          key={priority}
                          type="button"
                          className={`${styles.priorityButton} ${values.priority === priority ? styles.active : ''} ${styles[priority.toLowerCase()]}`}
                          onClick={() => setFieldValue('priority', priority)}
                        >
                          {priority}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Due Date</label>
                  <input
                    type="datetime-local"
                    value={values.dueDate || ''}
                    onChange={(e) => setFieldValue('dueDate', e.target.value || null)}
                    className={styles.dateInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Tags</label>
                  <div className={styles.tagsContainer}>
                    {values.tags.map((tag) => (
                      <Tag key={tag} onRemove={() => removeTag(tag)}>
                        {tag}
                      </Tag>
                    ))}
                    <div className={styles.addTagInput}>
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                        placeholder="Add tag"
                        className={styles.tagInput}
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className={styles.addTagButton}
                        aria-label="Add tag"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className={styles.actions}>
                  {task && (
                    <Button
                      type="button"
                      variant="danger"
                      onClick={handleDelete}
                    >
                      Delete Task
                    </Button>
                  )}
                  <Button type="button" variant="secondary" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Save
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

