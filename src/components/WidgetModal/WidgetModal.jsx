// React Imports
import { useContext, useEffect, useState } from 'react';

// Shopify Imports
import { Box, Button, Grid, LegacyCard, TextField } from '@shopify/polaris';
import { ClipboardIcon } from '@shopify/polaris-icons';
import { useAppBridge } from '@shopify/app-bridge-react';

// Custom Component
import { ShopifyContext } from '../ShopifyProvider/ShopifyProvider';
import { useFetchWithToken } from '../FetchDataAPIs/FetchWithToken';

const WidgetModal = (props) => {

    // Props
    const { copyId } = props;
    const { shopName } = useContext(ShopifyContext);
    const shopify = useAppBridge();
    const fetchWithToken = useFetchWithToken();

    // State
    const [data, setData] = useState();
    const [loading, setloading] = useState(false);
    const [isProductBlockAdded, setIsProductBlockAdded] = useState(false);

    const fetchAppEmbed = async () => {
        try {
            setloading(true);
            const data = await fetchWithToken({
                url: `https://bundle-wave-backend.xavierapps.com/api/embeded_status`,
                method: 'GET',
            });

            if (data?.data?.status) {
                setData(data?.data);
            }

        } catch (error) {
            console.error("Failed to fetch bundle details:", error);
        } finally {
            setloading(false);
        }
    };

    useEffect(() => {
        fetchAppEmbed();
    }, []);

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
        const url = `https://${shopName}/admin/themes/current/editor?context=apps&activateAppId=d0627ca0-a5b7-4ed2-89b1-91187e230657/bundle-wave`;
        window.open(url, '_blank');
    }

    const redirectToProductBlock = () => {
        const url = `https://${shopName}/admin/themes/current/editor?template=product`;
        window.open(url, "_blank");
    };

    return (
        <Grid columns={{ xs: 1, sm: 1, md: 3, lg: 3, xl: 3 }}>
            <Grid.Cell>
                <LegacyCard title="App Embed" sectioned subdued>
                    <p>To enable the widget in your Shopify store, follow these steps:</p>
                    <Box paddingBlockStart={200} paddingBlockEnd={400}>
                        <ul style={{ paddingLeft: "15px" }}>
                            <li>Navigate to your <strong>Shopify Admin</strong></li>
                            <li>Go to <strong>Themes</strong> &rarr; click <strong>Customize</strong></li>
                            <li>Select <strong>App Embed</strong></li>
                            <li>Enable the widget and click <strong>Save</strong></li>
                        </ul>
                    </Box>
                    <Button loading={loading} disabled={data?.is_app_embeded_disabled === false} onClick={() => redirectTheme()}>App Embed: {data?.is_app_embeded_disabled ? "Off" : "On"}</Button>
                </LegacyCard>
            </Grid.Cell>
            <Grid.Cell>
                <LegacyCard title="I am using a page builder." sectioned subdued>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingBottom: "68px" }}>
                        <p>If you're using a page builder app, you can manually add this widget using the embed ID below.</p>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <Box width="100%">
                                <TextField value={copyId} disabled type="text" label="Embed ID" labelHidden autoComplete="off" />
                            </Box>
                            <Button icon={ClipboardIcon} accessibilityLabel="Copy to clipboard" onClick={() => handleCopy(copyId)} />
                        </div>
                    </div>
                </LegacyCard>
            </Grid.Cell>
            <Grid.Cell>
                <LegacyCard title="Product Block Status" sectioned subdued>
                    <p>
                        This checks whether your bundle block is added to the product page.
                    </p>

                    <Box paddingBlockStart={200}>
                        {isProductBlockAdded ? (
                            <>
                                <p style={{ color: "green", fontWeight: 500 }}>
                                    ✅ Bundle block is active on product page.
                                </p>

                                <Button onClick={redirectToStoreProduct}>
                                    View Bundle on Product
                                </Button>
                            </>
                        ) : (
                            <>
                                <p style={{ color: "red", fontWeight: 500 }}>
                                    ❌ Bundle block is NOT added yet.
                                </p>

                                <Button onClick={redirectToProductBlock}>
                                    Add Bundle Block to Product
                                </Button>
                            </>
                        )}
                    </Box>
                </LegacyCard>
            </Grid.Cell>
            {/* <Grid.Cell>
                <LegacyCard title="Does it look good on your shop?" sectioned subdued>
                    <p>Tell us if everything looks good or if something needs fixing.</p>
                </LegacyCard>
            </Grid.Cell> */}
        </Grid>
    );
};

export default WidgetModal;

