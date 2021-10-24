import React, { lazy, Suspense } from 'react'
import { render } from 'react-dom'
import { Router } from 'react-router-dom'
import history from './history.js'
import ErrorBoundary from './error-boundary.js'
const App = lazy(() => import("./App.jsx"))

render(
  <ErrorBoundary>
    <Router history={history}>
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </Router>
  </ErrorBoundary>
  ,
document.getElementById('root'))
