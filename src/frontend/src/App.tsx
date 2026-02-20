import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { AppLayout } from './components/layout/AppLayout';
import HomePage from './pages/HomePage';
import BranchPage from './pages/BranchPage';
import SubjectPage from './pages/SubjectPage';
import SearchResultsPage from './pages/SearchResultsPage';
import AuthPage from './pages/AuthPage';
import AdminPanelPage from './pages/admin/AdminPanelPage';
import MCQPracticePage from './pages/MCQPracticePage';
import { AdminRouteGuard } from './components/auth/AdminRouteGuard';

const rootRoute = createRootRoute({
  component: AppLayout
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage
});

const branchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/branch/$branchId',
  component: BranchPage
});

const subjectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subject/$subjectId',
  component: SubjectPage
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search',
  component: SearchResultsPage
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: AuthPage
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => <AdminRouteGuard><AdminPanelPage /></AdminRouteGuard>
});

const mcqPracticeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/practice/$subjectId',
  component: MCQPracticePage
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  branchRoute,
  subjectRoute,
  searchRoute,
  authRoute,
  adminRoute,
  mcqPracticeRoute
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
