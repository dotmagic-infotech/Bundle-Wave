// Shopify Imports
import { Card, EmptyState, Layout, Page } from '@shopify/polaris';

// Third Party Imports
import { useNavigate } from 'react-router-dom';

const NotAccess = () => {
    const navigate = useNavigate();

    return (
        <Page>
            <Layout>
                <Layout.Section variant="fullWidth">
                    <Card>
                        <EmptyState
                            heading="Access Denied"
                            image="https://cdn.shopify.com/s/files/1/0839/1399/8619/files/Access-Denied.svg?v=1749798084"
                            action={{
                                content: 'Update Plan',
                                onAction: () => navigate('/plans'),
                            }}
                            secondaryAction={{
                                content: 'Go to Home',
                                onAction: () => navigate('/home'),
                            }}
                        >
                            <p>Your current plan does not allow access to this page. Please update your plan to continue.</p>
                        </EmptyState>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
};

export default NotAccess;
