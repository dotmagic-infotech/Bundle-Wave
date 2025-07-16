// React Imports
import React from 'react';

// Shopify Imports
import { Card, EmptyState, Layout, Page } from '@shopify/polaris';

// Third Party Imports
import { useLocation, useNavigate } from 'react-router-dom';

const Error404 = () => {
  // Hooks
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Extract and format the first segment for heading
  const pageName = pathname.split('/')[1];
  const formattedPageName = pageName
    ? pageName.charAt(0).toUpperCase() + pageName.slice(1)
    : 'Requested';

  return (
    <Page>
      <Layout>
        <Layout.Section variant="fullWidth">
          <Card>
            <EmptyState
              heading={`${formattedPageName} Page not found`}
              image="https://cdn.shopify.com/s/files/1/0839/1399/8619/files/404-Error.svg?v=1749798069"
              action={{
                content: 'Go to Home',
                onAction: () => navigate('/home'),
              }}
            >
              <p>The page you're looking for doesn't exist or has been moved.</p>
            </EmptyState>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Error404;
