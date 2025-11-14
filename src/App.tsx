import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { UndoProvider } from './contexts/UndoContext';
import { useUndo } from './hooks/useUndo';
import { FocusTimerProvider } from './contexts/FocusTimer';
import { useFocusTimer } from './hooks/useFocusTimer';
import { ConfirmationProvider, useConfirmation } from './contexts/ConfirmationContext';
import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import { TaskList } from './components/TaskList/TaskList';
import { Calendar } from './components/Calendar/Calendar';
import { TaskDetails } from './components/TaskDetails/TaskDetails';
import { Footer } from './components/Footer/Footer';
import { Profile } from './components/Profile/Profile';
import { About } from './components/About/About';
import { FocusTimer } from './components/FocusTimer/FocusTimer';
import { TimerCompletionModal } from './components/FocusTimer/TimerCompletionModal';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from './hooks/useTasks';
import { filterTasks, filterByTag, getUniqueTags } from './utils/taskFilters';
import { parseQuery, applyQuery } from './utils/queryParser';
import type { ViewFilter, ViewMode, Task, TaskFormData } from './types/task';
import styles from './App.module.scss';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  const [currentFilter, setCurrentFilter] = useState<ViewFilter>('all');
  const [currentViewMode, setCurrentViewMode] = useState<ViewMode>('list');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const { data: tasks = [], isLoading } = useTasks();
  const { currentTaskId } = useFocusTimer();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const { showUndo } = useUndo();
  const { confirm } = useConfirmation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const availableTags = getUniqueTags(tasks);
  let filteredTasks = filterTasks(tasks, currentFilter);
  filteredTasks = filterByTag(filteredTasks, selectedTag);

  const parsedQuery = parseQuery(searchQuery);
  if (parsedQuery.hasAdvancedSyntax || searchQuery.trim()) {
    filteredTasks = applyQuery(filteredTasks, parsedQuery);
  }

  const handleNewTask = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  const handleSaveTask = async (taskId: string | null, taskData: TaskFormData) => {
    try {
      if (taskId) {
        await updateTask.mutateAsync({ taskId, taskData });
      } else {
        await createTask.mutateAsync(taskData);
      }
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const taskToDelete = tasks.find((t) => t.taskId === taskId);
    if (!taskToDelete) return;

    const confirmed = await confirm({
      title: 'Delete Task',
      message: `Are you sure you want to delete "${taskToDelete.title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });

    if (!confirmed) return;

    try {
      await deleteTask.mutateAsync(taskId);
      showUndo({
        id: taskId,
        label: 'Task deleted',
        undo: async () => {
          await createTask.mutateAsync({
            title: taskToDelete.title,
            description: taskToDelete.description,
            dueDate: taskToDelete.dueDate,
            priority: taskToDelete.priority,
            status: taskToDelete.status,
            tags: taskToDelete.tags,
          });
        },
      });
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleCompleteTask = async (task: Task) => {
    if (task.status === 'Completed') return;

    const previousStatus = task.status;
    setCompletingTaskId(task.taskId);

    setTimeout(async () => {
      try {
        await updateTask.mutateAsync({
          taskId: task.taskId,
          taskData: { status: 'Completed' },
        });

        showUndo({
          id: task.taskId,
          label: 'Task completed',
          undo: async () => {
            await updateTask.mutateAsync({
              taskId: task.taskId,
              taskData: { status: previousStatus },
            });
          },
        });
      } catch (error) {
        console.error('Failed to complete task:', error);
      } finally {
        setCompletingTaskId(null);
      }
    }, 300);
  };

  const handleStartFocus = async (taskId: string) => {
    const task = tasks.find((t) => t.taskId === taskId);
    if (!task || task.status === 'Completed') return;

    // Automatically set status to "In Progress" when timer starts
    if (task.status !== 'In Progress') {
      try {
        await updateTask.mutateAsync({
          taskId: task.taskId,
          taskData: { status: 'In Progress' },
        });
      } catch (error) {
        console.error('Failed to update task status:', error);
      }
    }
  };

  const handleTimerComplete = async () => {
    if (!currentTaskId) return;
    const task = tasks.find((t) => t.taskId === currentTaskId);
    if (!task) return;

    try {
      await updateTask.mutateAsync({
        taskId: task.taskId,
        taskData: { status: 'Completed' },
      });
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  const handleTimerBreak = () => {
    // Break timer is already started in TimerCompletionModal
    setShowCompletionModal(false);
  };

  const handleTimerContinue = () => {
    setShowCompletionModal(false);
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <Header
        onNewTask={handleNewTask}
        onSearch={setSearchQuery}
        onMenuToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onProfileClick={() => setIsProfileOpen(true)}
        onAboutClick={() => setIsAboutOpen(true)}
        isMobile={isMobile}
        tasks={tasks}
      />
      <div className={styles.mainContent}>
        <Sidebar
          currentFilter={currentFilter}
          currentViewMode={currentViewMode}
          selectedTag={selectedTag}
          availableTags={availableTags}
          isCollapsed={isSidebarCollapsed}
          onFilterChange={setCurrentFilter}
          onViewModeChange={setCurrentViewMode}
          onTagSelect={setSelectedTag}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobile={isMobile}
        />
        <main className={styles.contentArea}>
          {currentViewMode === 'list' ? (
            <TaskList
              tasks={filteredTasks}
              onEdit={handleEditTask}
              onComplete={handleCompleteTask}
              onDelete={(task) => handleDeleteTask(task.taskId)}
              onStartFocus={handleStartFocus}
              completingTaskId={completingTaskId}
              searchQuery={searchQuery}
            />
          ) : (
            <Calendar
              tasks={filteredTasks}
              onTaskClick={handleEditTask}
              searchQuery={searchQuery}
              currentFilter={currentFilter}
            />
          )}
        </main>
      </div>
      <Footer />
      <TaskDetails
        task={selectedTask}
        isOpen={isTaskModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        onStartFocus={handleStartFocus}
      />
      {isProfileOpen && <Profile onClose={() => setIsProfileOpen(false)} tasks={tasks} />}
      <About isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <FocusTimer
        onComplete={() => setShowCompletionModal(true)}
        onBreakComplete={() => setShowCompletionModal(true)}
      />
      {showCompletionModal && currentTaskId && (
        <TimerCompletionModal
          taskId={currentTaskId}
          onComplete={handleTimerComplete}
          onBreak={handleTimerBreak}
          onContinue={handleTimerContinue}
          onClose={() => setShowCompletionModal(false)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ConfirmationProvider>
          <UndoProvider>
            <FocusTimerProvider>
              <AppContent />
            </FocusTimerProvider>
          </UndoProvider>
        </ConfirmationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
