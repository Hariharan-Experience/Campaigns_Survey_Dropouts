import DropoutIntelligence from './pages/DropoutIntelligence'
import { AppProvider } from './context/AppContext'

// Single-screen prototype: the Survey Dropout & Response Intelligence
// feature only. The earlier dashboard, survey editor and app chrome remain
// on disk but are no longer routed or bundled.
export default function App() {
  return (
    <AppProvider>
      <DropoutIntelligence />
    </AppProvider>
  )
}
