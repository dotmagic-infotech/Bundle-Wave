// React Imports
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

// Shopify Imports
import { SaveBar, useAppBridge } from '@shopify/app-bridge-react';
import { LockIcon, PlusIcon, ViewIcon } from '@shopify/polaris-icons';
import { Card, Page, Grid, Button, Text, Box, BlockStack, SkeletonBodyText, InlineStack, SkeletonDisplayText, Modal } from "@shopify/polaris";

// Custom Component
import { useFetchWithToken } from '../../components/FetchDataAPIs/FetchWithToken';
import { ShopifyContext } from '../../components/ShopifyProvider/ShopifyProvider';

const BundleList = () => {

    // Hooks
    const navigate = useNavigate();
    const shopify = useAppBridge();
    const fetchWithToken = useFetchWithToken();
    const { shopName } = useContext(ShopifyContext);

    // State
    const [bundleData, setBundleData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGallery, setSelectedGallery] = useState([]);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewModalIndex, setViewModalIndex] = useState(0);
    const [bundleTitle, setBundleTitle] = useState("");

    const toggleViewModal = () => setViewModalOpen(prev => !prev);

    useEffect(() => {
        shopify.saveBar.hide("save");

        const fetchData = async () => {
            try {
                const data = await fetchWithToken({
                    url: `https://bundle-wave-backend.xavierapps.com/api/bundle-types?shop=${shopName}`,
                    method: 'GET',
                });
                setBundleData(data);
            } catch (error) {
                console.error("Error fetching bundles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        setSelectedGallery(bundleGallary[0])
    }, []);

    const checkUrl = (id) => {
        const bundle = bundleData?.bundle_list.find((bundle) => bundle.id.toString() === id.toString());
        if (!bundle) return "/bundlesList/fixed_bundle";

        return bundle.url.startsWith("/") ? bundle.url : `/bundlesList/${bundle.url}`;
    };

    const handleNavigation = (id, enable) => {
        if (enable === "0") {
            shopify.toast.show(`You're currently on the ${bundleData?.plan_name} Plan.`);

            return;
        }

        const url = checkUrl(id);
        navigate(url);
    };

    const handleNavCustomization = (bundleIds, enable) => {
        if (enable === "0") {
            shopify.toast.show(`You're currently on the ${bundleData?.plan_name} Plan.`);

            return;
        }

        let name = ""

        if (bundleIds == 0) {
            name = "fixedbundle"
        } else if (bundleIds == 1) {
            name = "mixmatch"
        } else if (bundleIds == 2) {
            name = "buyxgety"
        } else if (bundleIds == 3) {
            name = "volumediscount"
        } else if (bundleIds == 4) {
            name = "addons"
        } else if (bundleIds == 5) {
            name = "frequently"
        } else {
            name = "fixedbundle"
        }

        navigate(`/customization/${name}`)
    };

    const handleClickGallery = (value) => {
        setSelectedGallery(value);
    }

    const bundleGallary = [
        { id: 1, buttonName: "Fixed set", img: "https://cdn.shopify.com/s/files/1/0839/1399/8619/files/Fixed_Bundle.png?v=1758868876", redirect: "fixed_bundle" },
        { id: 2, buttonName: "Tiered bundle", img: "https://cdn.shopify.com/s/files/1/0839/1399/8619/files/Mix_and_Match_Tierd.png?v=1758871536", redirect: "mix-match" },
        { id: 3, buttonName: "Product addons", img: "https://cdn.shopify.com/s/files/1/0839/1399/8619/files/Add_Ons_Bundle.png?v=1758871485", redirect: "addons_bundle" },
        { id: 4, buttonName: "Buy X Get Y", img: "https://cdn.shopify.com/s/files/1/0839/1399/8619/files/buy_X_get_Y.png?v=1758870755", redirect: "buy_xy" },
        { id: 5, buttonName: "Volume Bundle", img: "https://cdn.shopify.com/s/files/1/0839/1399/8619/files/volume_bundle_5560b427-115c-4b76-b258-41ba9eeec5df.png?v=1758874756", redirect: "volume_bundle" },
        { id: 6, buttonName: "Multi-step mix and match", img: "https://cdn.shopify.com/s/files/1/0839/1399/8619/files/Mix_and_Match_Single.png?v=1758871536", redirect: "mix-match" },
        { id: 7, buttonName: "Frequently Bought Together", img: "https://cdn.shopify.com/s/files/1/0839/1399/8619/files/Frequently_bundle_3237bca8-ac17-475a-a792-3d6173691df6.png?v=1758875333", redirect: "frequently_bundle" },
    ];

    const modalViews = {
        0: <img src='https://cdn.shopify.com/s/files/1/0839/1399/8619/files/Fixed_Bundle.png?v=1758868876' width="100%" />,
        1: <img src='https://cdn.shopify.com/s/files/1/0839/1399/8619/files/Mix_and_Match_Single.png?v=1758871536' width="100%" />,
        2: <img src='https://cdn.shopify.com/s/files/1/0839/1399/8619/files/buy_X_get_Y.png?v=1758870755' width="100%" />,
        3: <img src='https://cdn.shopify.com/s/files/1/0839/1399/8619/files/volume_bundle_5560b427-115c-4b76-b258-41ba9eeec5df.png?v=1758874756' width="100%" />,
        4: <img src='https://cdn.shopify.com/s/files/1/0839/1399/8619/files/Add_Ons_Bundle.png?v=1758871485' width="100%" />,
        5: <img src='https://cdn.shopify.com/s/files/1/0839/1399/8619/files/Frequently_bundle_3237bca8-ac17-475a-a792-3d6173691df6.png?v=1758875333' width="100%" />,
    };

    return (
        <>
            <Page title="Bundles Page" backAction={{ onAction: () => navigate("/bundles") }}>
                <SaveBar id="save"></SaveBar>
                <Box>
                    {loading ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {["1", "2", "3", "4"].map((v, i) => (
                                <Card key={i}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", height: "" }}>
                                        <SkeletonDisplayText size="small" />
                                        <SkeletonBodyText lines={3} />
                                        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                            <Button disabled></Button>
                                            <Button disabled></Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {bundleData?.bundle_list.map((bundle, index) => (
                                <Card key={index}>
                                    <InlineStack align='space-between' blockAlign='center'>
                                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "10px", height: "100px" }}>
                                                <Text variant='headingLg' fontWeight='medium'>{bundle.title}</Text>
                                                <Text variant='bodyLg'>{bundle.description}</Text>
                                            </div>
                                            <div style={{ display: "flex", gap: "10px" }}>
                                                <Button variant='primary' icon={bundle.enable === "1" ? PlusIcon : LockIcon} onClick={() => handleNavigation(bundle.id, bundle.enable)}>
                                                    {bundle.enable === "1" ? "Create a Bundle" : "Upgrade Plan"}
                                                </Button>
                                                {bundle.enable === "1" &&
                                                    <Button variant='secondary' onClick={() => handleNavCustomization(index, bundle.enable)}>Customize Design</Button>
                                                }
                                                <Button variant='secondary' icon={ViewIcon} onClick={() => {
                                                    toggleViewModal();
                                                    setViewModalIndex(index);
                                                    setBundleTitle(bundle.title);
                                                }}></Button>
                                            </div>
                                        </div>
                                        <Box>
                                            <div>
                                                <img src={bundle.img_src} alt={bundle.title} style={{ width: "260px", height: "100%", objectFit: "contain" }} />
                                            </div>
                                        </Box>
                                    </InlineStack>
                                </Card>
                            ))}
                        </div>
                    )}
                </Box>
            </Page>

            <Page title="Bundles Gallery">
                <Card>
                    <Grid columns={{ xs: 4, md: 12, lg: 12, xl: 12 }}>
                        <Grid.Cell columnSpan={{ xs: 4, md: 3, lg: 3, xl: 3 }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {bundleGallary?.map((v, i) => (
                                    <div key={i} onClick={() => handleClickGallery(v)}
                                        style={{
                                            backgroundColor: v?.id === selectedGallery?.id ? "black" : "rgba(250, 250, 250, 1)", boxShadow: "-1px 0 4px #000e441f inset, 1px 0 4px #000e441f inset, 0 2px 4px #000e4433 inset", fontWeight: 400, fontSize: "14px", color: v?.id === selectedGallery?.id ? "white" : "black",
                                            padding: "10px", borderRadius: "10px", cursor: "pointer", transition: "all 0.2s ease-in-out",
                                        }}
                                    >
                                        {v?.buttonName}
                                    </div>
                                ))}
                            </div>
                        </Grid.Cell>

                        <Grid.Cell columnSpan={{ xs: 4, md: 9, lg: 9, xl: 9 }}>
                            <div style={{ borderRadius: "10px", height: "100%", width: "100%" }}>
                                {selectedGallery?.img ? (
                                    <>
                                        <img src={selectedGallery?.img} alt="Selected bundle" style={{ width: "100%", height: "auto", borderRadius: "10px", marginBottom: "10px", objectFit: "contain" }} />
                                        <Button variant="primary" fullWidth icon={PlusIcon} onClick={() => navigate(`/bundlesList/${selectedGallery?.redirect}`)}>Create this bundle</Button>
                                    </>
                                ) : (
                                    <div style={{ width: "100%", height: "100%", borderRadius: "10px", backgroundColor: "#f4f4f4", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                                        No preview available
                                    </div>
                                )}
                            </div>
                        </Grid.Cell>
                    </Grid>
                </Card>

                <div style={{ marginTop: "12px" }}></div>
            </Page>

            <Modal
                open={viewModalOpen}
                onClose={toggleViewModal}
                title={bundleTitle}
                size='fullScreen'
            >
                <Modal.Section>
                    <Card>
                        <div style={{ width: "100%", height: "auto" }}>
                            {modalViews[viewModalIndex] || <div>No preview available</div>}
                        </div>
                    </Card>
                </Modal.Section>
            </Modal>
        </>
    );
}

export default BundleList