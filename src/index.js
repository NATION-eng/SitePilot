import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { ProjectProvider } from './context/ProjectContext';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ProjectProvider>
        <App />
      </ProjectProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// Register service worker for full offline PWA support
serviceWorkerRegistration.register();
