// Custom Component
import App from './App.jsx'

// Third Party Imports
import { BrowserRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client'

// Shopify Polaris
import { AppProvider } from '@shopify/polaris';
import translations from '@shopify/polaris/locales/en.json';

// Css Imports
import './index.css'

// Third Party Imorts
import { QueryClientProvider } from '@tanstack/react-query';

// Custom Component
import { DiscountProvider } from './components/MetaDataContext/MetaDataProvider.jsx';
import { ShopifyProvider } from './components/ShopifyProvider/ShopifyProvider.jsx';
import { SessionTokenProvider } from './components/Session/SessionTokenProvider.jsx';
import { queryClient } from './assets/queryClient.jsx'

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <AppProvider i18n={translations}>
      <SessionTokenProvider>
        <DiscountProvider>
          <ShopifyProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ShopifyProvider>
        </DiscountProvider>
      </SessionTokenProvider>
    </AppProvider>
  </QueryClientProvider>
)
