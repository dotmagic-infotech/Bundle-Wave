// React Imports
import { useContext } from 'react';

// Shopify Imports
import { Box, Button, Grid, LegacyCard, TextField } from '@shopify/polaris';
import { ClipboardIcon } from '@shopify/polaris-icons';
import { ShopifyContext } from '../ShopifyProvider/ShopifyProvider';
import { useAppBridge } from '@shopify/app-bridge-react';

const WidgetModal = (props) => {

    // Props
    const { copyId } = props;
    const { shopName } = useContext(ShopifyContext);
    const shopify = useAppBridge();

    const handleCopy = (value) => {
        navigator.clipboard.writeText(value)
            .then(() => {
                shopify.toast.show(`Copied to clipboard`);
            })
            .catch((err) => {
                shopify.toast.show(`Failed to copy`);
            });
    };

    const redirectTheme = () => {
        const url = `https://${shopName}/admin/themes/current/editor?context=apps&activateAppId=d0627ca0-a5b7-4ed2-89b1-91187e230657/app-embed`;
        window.open(url, '_blank');
    }

    return (
        <Grid columns={{ xs: 1, sm: 1, md: 3, lg: 3, xl: 3 }}>
            <Grid.Cell>
                <LegacyCard title="App Embed" sectioned subdued>
                    <p>To enable the widget in your Shopify store, follow these steps:</p>
                    <Box paddingBlockStart={200} paddingBlockEnd={400}>
                        <li>Navigate to your <strong>Shopify Admin</strong></li>
                        <li>Go to <strong>Themes</strong> &rarr; click <strong>Customize</strong></li>
                        <li>Select <strong>App Embed</strong></li>
                        <li>Enable the widget and click <strong>Save</strong></li>
                    </Box>
                    <Button onClick={() => redirectTheme()}>App Embed: On</Button>
                </LegacyCard>
            </Grid.Cell>
            <Grid.Cell>
                <LegacyCard title="I am using a page builder." sectioned subdued>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingBottom: "68px" }}>
                        <p>If you're using a page builder app, you can manually add this widget using the embed ID below.</p>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <Box width="100%">
                                <TextField
                                    value={copyId}
                                    disabled
                                    type="text"
                                    label="Embed ID"
                                    labelHidden
                                    autoComplete="off"
                                />
                            </Box>
                            <Button icon={ClipboardIcon} accessibilityLabel="Copy to clipboard" onClick={() => handleCopy(copyId)} />
                        </div>
                    </div>
                </LegacyCard>
            </Grid.Cell>
            <Grid.Cell>
                <LegacyCard title="Does it look good on your shop?" sectioned subdued>
                    <p>Tell us if everything looks good or if something needs fixing.</p>
                </LegacyCard>
            </Grid.Cell>
        </Grid>
    );
};

export default WidgetModal;

