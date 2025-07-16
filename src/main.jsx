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

// Custom Component
import { DiscountProvider } from './components/MetaDataContext/MetaDataProvider.jsx';
import { ShopifyProvider } from './components/ShopifyProvider/ShopifyProvider.jsx';
import { SessionTokenProvider } from './components/Session/SessionTokenProvider.jsx';

createRoot(document.getElementById('root')).render(
  <AppProvider i18n={translations}>
    <SessionTokenProvider>
      <ShopifyProvider>
        <DiscountProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </DiscountProvider>
      </ShopifyProvider>
    </SessionTokenProvider>
  </AppProvider>
)
