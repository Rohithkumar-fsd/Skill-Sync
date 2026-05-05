import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ErrorBoundary } from '@components/ErrorBoundary'
import { ThemeProvider } from '@contexts/ThemeContext'
import { ToastProvider } from '@contexts/ToastContext'
import { QueryProvider } from '@/providers/QueryProvider'
// @ts-ignore - CSS import
import './styles/index.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <QueryProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </QueryProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
