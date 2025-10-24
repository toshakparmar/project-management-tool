import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { Project, Task } from "../types";
import TaskModal from "../components/TaskModal";
import DeleteModal from "../components/DeleteModal";
import Header from "../components/Header";

function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    task: Task | null;
    loading: boolean;
  }>({
    isOpen: false,
    task: null,
    loading: false,
  });

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data);
    } catch {
      navigate("/dashboard");
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/tasks", {
        params: {
          projectId: id,
          status: filterStatus || undefined,
        },
      });
      setTasks(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  useEffect(() => {
    fetchTasks();
  }, [id, filterStatus]);

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = (task: Task) => {
    setDeleteModal({
      isOpen: true,
      task,
      loading: false,
    });
  };

  const confirmDeleteTask = async () => {
    if (!deleteModal.task) return;

    setDeleteModal((prev) => ({ ...prev, loading: true }));
    try {
      await api.delete(`/tasks/${deleteModal.task._id}`);
      fetchTasks();
      setDeleteModal({ isOpen: false, task: null, loading: false });
    } catch {
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const closeDeleteModal = () => {
    if (!deleteModal.loading) {
      setDeleteModal({ isOpen: false, task: null, loading: false });
    }
  };

  const handleTaskModalClose = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
    fetchTasks();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "badge-info";
      case "in-progress":
        return "badge-warning";
      case "done":
        return "badge-success";
      default:
        return "badge-info";
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-12 w-12 text-primary-600 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>

        {/* Project Header Card */}
        <div className="card p-8 mb-8 animate-slide-up">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  {project.title}
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {project.description}
              </p>
            </div>
            <span
              className={`badge ${
                project.status === "active" ? "badge-success" : "badge-info"
              }`}
            >
              {project.status}
            </span>
          </div>
        </div>

        {/* Tasks Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Tasks
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and track your project tasks
            </p>
          </div>
          <button
            onClick={handleCreateTask}
            className="btn-primary flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Task
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setFilterStatus("")}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filterStatus === ""
                ? "bg-primary-600 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500"
            }`}
          >
            All Tasks
          </button>
          <button
            onClick={() => setFilterStatus("todo")}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filterStatus === "todo"
                ? "bg-primary-600 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500"
            }`}
          >
            To Do
          </button>
          <button
            onClick={() => setFilterStatus("in-progress")}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filterStatus === "in-progress"
                ? "bg-primary-600 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilterStatus("done")}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filterStatus === "done"
                ? "bg-primary-600 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500"
            }`}
          >
            Done
          </button>
        </div>

        {/* Tasks Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg
              className="animate-spin h-12 w-12 text-primary-600 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Loading tasks...
            </p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="card p-12 text-center animate-slide-up">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No tasks found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filterStatus
                ? `No ${filterStatus.replace("-", " ")} tasks available`
                : "Get started by creating your first task"}
            </p>
            <button
              onClick={handleCreateTask}
              className="btn-primary inline-flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Your First Task
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task, index) => (
              <div
                key={task._id}
                className="card p-6 hover:scale-[1.02] transform transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="mt-1">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            task.status === "done"
                              ? "bg-green-500"
                              : task.status === "in-progress"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                          }`}
                        ></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {task.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {task.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className={`badge ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all duration-200"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task)}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isTaskModalOpen && (
        <TaskModal
          task={editingTask}
          projectId={id!}
          onClose={handleTaskModalClose}
        />
      )}

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteTask}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
        itemName={deleteModal.task?.title}
        loading={deleteModal.loading}
      />
    </div>
  );
}

export default ProjectDetails;
