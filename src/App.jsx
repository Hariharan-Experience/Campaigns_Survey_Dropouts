import DropoutIntelligence from './pages/DropoutIntelligence'
import ErrorBoundary from './components/ErrorBoundary'
import { ToastProvider } from './components/Toast'
import { AppProvider } from './context/AppContext'

// Single-screen prototype: the Survey Dropout Intelligence
// feature only. The earlier dashboard, survey editor and app chrome remain
// on disk but are no longer routed or bundled.
export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppProvider>
          <DropoutIntelligence />
        </AppProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}
