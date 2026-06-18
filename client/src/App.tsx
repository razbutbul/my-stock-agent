import { HomePage } from './pages/HomePage';
import { AppProviders } from './providers/AppProviders';

function App() {
  return (
    <AppProviders>
      <HomePage />
    </AppProviders>
  );
}

export default App;
