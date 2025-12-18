// src/main.jsx
import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import './index.css';
import './firebase/firebaseConfig';
import { AppLoader } from './components/ui/AppLoader';

// Lazy load the main App component
const App = lazy(() => import('./App'));

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<AppLoader />} persistor={persistor}>
        <Suspense fallback={null}>
          <App />
        </Suspense>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);