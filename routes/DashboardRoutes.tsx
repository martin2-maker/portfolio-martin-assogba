import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardHomePage from '../pages/dashboard/DashboardHomePage';
import NotesListPage from '../pages/dashboard/notes/NotesListPage';
import NoteEditorPage from '../pages/dashboard/notes/NoteEditorPage';
import NoteViewPage from '../pages/dashboard/notes/NoteViewPage';
import ProfilePage from '../pages/dashboard/ProfilePage';
import NotificationsPage from '../pages/dashboard/notifications/NotificationsPage';
import TasksListPage from '../pages/dashboard/tasks/TasksListPage';
import TaskEditorPage from '../pages/dashboard/tasks/TaskEditorPage';
import TaskViewPage from '../pages/dashboard/tasks/TaskViewPage';
import EmailExtractorPage from '../pages/dashboard/tools/EmailExtractorPage';
import ProfitabilityAnalysisPage from '../pages/dashboard/tools/ProfitabilityAnalysisPage';
import WordCounterPage from '../pages/dashboard/tools/WordCounterPage';
import CalculatorPage from '../pages/dashboard/tools/CalculatorPage';
import TagsManagementPage from '../pages/dashboard/tags/TagsManagementPage';
import ProjectsListPage from '../pages/dashboard/projects/ProjectsListPage';
import ProjectEditorPage from '../pages/dashboard/projects/ProjectEditorPage';
import ProjectViewPage from '../pages/dashboard/projects/ProjectViewPage';

const DashboardRoutes = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<DashboardHomePage />} />
          <Route path="/notes" element={<NotesListPage />} />
          <Route path="/notes/new" element={<NoteEditorPage />} />
          <Route path="/notes/edit/:noteId" element={<NoteEditorPage />} />
          <Route path="/notes/view/:noteId" element={<NoteViewPage />} />
          <Route path="/tasks" element={<TasksListPage />} />
          <Route path="/tasks/new" element={<TaskEditorPage />} />
          <Route path="/tasks/edit/:taskId" element={<TaskEditorPage />} />
          <Route path="/tasks/view/:taskId" element={<TaskViewPage />} />
          <Route path="/projects" element={<ProjectsListPage />} />
          <Route path="/projects/new" element={<ProjectEditorPage />} />
          <Route path="/projects/view/:projectId" element={<ProjectViewPage />} />
          <Route path="/tags" element={<TagsManagementPage />} />
          <Route path="/email-extractor" element={<EmailExtractorPage />} />
          <Route path="/profitability-analysis" element={<ProfitabilityAnalysisPage />} />
          <Route path="/word-counter" element={<WordCounterPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default DashboardRoutes;