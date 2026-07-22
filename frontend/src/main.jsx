import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/UserProvider.jsx'
import { FiltersProvider } from './context/FiltersProvider.jsx'
import { FavsProvider } from './context/FavsProvider.jsx'
import { SnackbarProvider } from './context/snackbarProvider.jsx'

createRoot(document.getElementById('root')).render(
 <BrowserRouter>
 <SnackbarProvider>
 <UserProvider>
    <FiltersProvider>
      <FavsProvider>
        <App />
      </FavsProvider>
    </FiltersProvider>
    </UserProvider>
     </SnackbarProvider>
  </BrowserRouter>
);
