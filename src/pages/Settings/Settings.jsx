// React Imports
import { useState, useEffect, useContext } from "react";

// Shopify Imports
import { Box, Card, Page, Text, BlockStack, InlineGrid, TextField, Divider, Button, Checkbox, RadioButton, Label } from "@shopify/polaris";

// Custom Component
import { ShopifyContext } from "../../components/ShopifyProvider/ShopifyProvider";
import { useFetchWithToken } from "../../components/FetchDataAPIs/FetchWithToken";
import { SaveBar } from "@shopify/app-bridge-react";

const Settings = () => {

    // Hooks
    const { shopName } = useContext(ShopifyContext);
    const fetchWithToken = useFetchWithToken();

    // State
    const [formState, setFormState] = useState({
        enable_subscription: 1,
        track: 1,
        track_inventory: "dont_display",
        button_action: "cart",
        variant_selector: "dropdown",
        product_pricing: "final_price",
        discount_application: "one",
        discount_combination: "one",
        label: "Bundle",
    });

    const fetchSettingsData = async () => {
        try {
            const data = await fetchWithToken({
                url: `https://bundle-wave-backend.xavierapps.com/api/get_settings?shop=${shopName}`,
                method: 'GET',
            });
            setFormState({
                enable_subscription: data?.subscription,
                track: data?.trackInventory,
                track_inventory: data?.trackInventoryOptions,
                button_action: data?.buttonAction,
                variant_selector: data?.variantSelectorType,
                product_pricing: data?.productPricing,
                discount_application: data?.discount,
                discount_combination: data?.discountCombination,
                label: data?.label,
            });
        } catch (error) {
            // console.error("Failed to fetch bundle details:", error);
        }
    };

    useEffect(() => {
        fetchSettingsData();
    }, []);

    const handleChangeValue = (key, value) => {
        setFormState((prevData) => ({
            ...prevData,
            [key]: value,
        }));
        shopify.saveBar.show('save');
    };

    const handleSubmit = async () => {
        const passData = {
            subscription: formState.enable_subscription,
            trackInventory: formState.track,
            trackInventoryOptions: formState.track_inventory,
            buttonAction: formState.button_action,
            variantSelectorType: formState.variant_selector,
            productPricing: formState.product_pricing,
            discount: formState.discount_application,
            discountCombination: formState.discount_combination,
            label: formState.label
        }

        const result = await fetchWithToken({
            url: `https://bundle-wave-backend.xavierapps.com/api/save_setting?shop=${shopName}`,
            method: 'POST',
            body: passData,
            isFormData: false,
        });

        if (result.status) {
            shopify.toast.show(`Update Successful Setting`);
            shopify.saveBar.hide("save");
        } else {
            shopify.toast.show(`Failed to Update Setting`);
            shopify.saveBar.hide("save");
        }
    }

    return (
        <Page title="Settings">
            <SaveBar id="save">
                <button variant="primary" onClick={handleSubmit}>Save</button>
                <button type='reset' onClick={() => {
                    shopify.saveBar.hide('save');
                    navigate("/bundles")
                }}></button>
            </SaveBar>
            <BlockStack gap={{ xs: "800", sm: "400" }}>
                {/* Track inventory */}
                <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                    <Box as="section" paddingInlineStart={{ xs: "400", sm: "0" }} paddingInlineEnd={{ xs: "400", sm: "0" }}>
                        <BlockStack gap="100">
                            <Text as="h3" variant="headingMd">
                                Track inventory
                            </Text>
                            <Text as="p" variant="bodyMd">
                                Track the inventory to specify how your bundles appear when one of the bundled products is sold out. Don't track the inventory to display the bundle regardless of the availability of the product.
                            </Text>
                        </BlockStack>
                    </Box>
                    <Card roundedAbove="sm">
                        <BlockStack align="space-between">
                            <Checkbox
                                label="Track inventory"
                                checked={formState?.track === 1}
                                onChange={(value) => {
                                    if (!value) {
                                        setFormState((prevData) => ({
                                            ...prevData,
                                            track_inventory: "dont_display",
                                        }));
                                    }
                                    handleChangeValue("track", value ? 1 : 0)
                                }}
                            />
                            {formState?.track === 1 &&
                                <div style={{ marginLeft: "1.6rem", display: "flex", flexDirection: "column" }}>
                                    <RadioButton label="Don't display the unavailable bundles" checked={formState?.track_inventory === "dont_display"} onChange={() => handleChangeValue("track_inventory", "dont_display")} />
                                    <RadioButton label="Show the sold-out badge for the unavailable bundles" checked={formState?.track_inventory === "show"} onChange={() => handleChangeValue("track_inventory", "show")} />
                                </div>
                            }
                        </BlockStack>
                    </Card>
                </InlineGrid>
                <Divider borderWidth="050" borderColor="border-secondary" />
                {/* Button action */}
                <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                    <Box as="section" paddingInlineStart={{ xs: "400", sm: "0" }} paddingInlineEnd={{ xs: "400", sm: "0" }}>
                        <BlockStack gap="100">
                            <Text as="h3" variant="headingMd">
                                Button action
                            </Text>
                            <Text as="p" variant="bodyMd">
                                Manage what page the customer is taken to after clicking the bundle button.
                            </Text>
                        </BlockStack>
                    </Box>
                    <Card roundedAbove="sm">
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <RadioButton label="Cart" checked={formState?.button_action === "cart"} onChange={() => handleChangeValue("button_action", "cart")} />
                            <RadioButton label="Checkout" checked={formState?.button_action === "checkout"} onChange={() => handleChangeValue("button_action", "checkout")} />
                            <RadioButton disabled label="Cart drawer (mini cart)" checked={formState?.button_action === "cart_drawer"} onChange={() => handleChangeValue("button_action", "cart_drawer")} />
                            <Label>Please contact support in order to activate this option.</Label>
                        </div>
                    </Card>
                </InlineGrid>
                {/* Variant selector type */}
                <Divider borderWidth="050" borderColor="border-secondary" />
                <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                    <Box as="section" paddingInlineStart={{ xs: "400", sm: "0" }} paddingInlineEnd={{ xs: "400", sm: "0" }}>
                        <BlockStack gap="100">
                            <Text as="h3" variant="headingMd">
                                Variant selector type
                            </Text>
                            <Text as="p" variant="bodyMd">
                                Specify that the customer should use the dropdown or color swatch to select variants in the bundle
                            </Text>
                        </BlockStack>
                    </Box>
                    <Card roundedAbove="sm">
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <RadioButton label="Dropdown" checked={formState?.variant_selector === "dropdown"} onChange={() => handleChangeValue("variant_selector", "dropdown")} />
                            <RadioButton label="Swatches" checked={formState?.variant_selector === "color"} onChange={() => handleChangeValue("variant_selector", "color")} />
                        </div>
                    </Card>
                </InlineGrid>
                {/* Product pricing */}
                <Divider borderWidth="050" borderColor="border-secondary" />
                <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                    <Box as="section" paddingInlineStart={{ xs: "400", sm: "0" }} paddingInlineEnd={{ xs: "400", sm: "0" }}>
                        <BlockStack gap="100">
                            <Text as="h3" variant="headingMd">
                                Product pricing
                            </Text>
                            <Text as="p" variant="bodyMd">
                                Price of the products in the bundle can be the final price or their compare at price (if there was).
                            </Text>
                        </BlockStack>
                    </Box>
                    <Card roundedAbove="sm">
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <RadioButton label="Final price" checked={formState?.product_pricing === "final_price"} onChange={() => handleChangeValue("product_pricing", "final_price")} />
                            <RadioButton label="Compare at price" checked={formState?.product_pricing === "compare_price"} onChange={() => handleChangeValue("product_pricing", "compare_price")} />
                        </div>
                    </Card>
                </InlineGrid>
                {/* Discount */}
                <Divider borderWidth="050" borderColor="border-secondary" />
                <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                    <Box as="section" paddingInlineStart={{ xs: "400", sm: "0" }} paddingInlineEnd={{ xs: "400", sm: "0" }}>
                        <BlockStack gap="100">
                            <Text as="h3" variant="headingMd">
                                Discount
                            </Text>
                            <Text as="p" variant="bodyMd">
                                Manage discount settings in different sections such as discount application, discount combination, discount display and discount codes.
                            </Text>
                        </BlockStack>
                    </Box>
                    <Card roundedAbove="sm">
                        <BlockStack gap={300}>
                            <Text as="p" variant="bodyMd" fontWeight="bold">Discount application settings</Text>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <RadioButton label="Apply the discount only if the bundle is clicked by the customer" checked={formState?.discount_application === "one"} onChange={() => handleChangeValue("discount_application", "one")} />
                                <RadioButton label="Always apply the discount" helpText="This option is only available for the" checked={formState?.discount_application === "two"} onChange={() => handleChangeValue("discount_application", "two")} />
                            </div>
                        </BlockStack>
                    </Card>
                </InlineGrid>
                <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                    <Box as="section" paddingInlineStart={{ xs: "400", sm: "0" }} paddingInlineEnd={{ xs: "400", sm: "0" }}>
                    </Box>
                    <Card roundedAbove="sm">
                        <BlockStack gap={300}>
                            <Text as="p" variant="bodyMd" fontWeight="bold">Discount combination</Text>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <RadioButton label="Allow bundles' discount codes to be combined with other product discount codes which are combinable" checked={formState?.discount_combination === "one"} onChange={() => handleChangeValue("discount_combination", "one")} />
                                <RadioButton label="Don't allow bundles' discount codes to be combined with other discount codes" checked={formState?.discount_combination === "two"} onChange={() => handleChangeValue("discount_combination", "two")} />
                            </div>
                        </BlockStack>
                    </Card>
                </InlineGrid>
                <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                    <Box as="section" paddingInlineStart={{ xs: "400", sm: "0" }} paddingInlineEnd={{ xs: "400", sm: "0" }}>
                    </Box>
                    <Card roundedAbove="sm">
                        <BlockStack gap={300}>
                            <Text as="p" variant="bodyMd" fontWeight="bold">Discount label</Text>
                            <Text as="p" variant="bodyMd">This label appears on the discounted bundle items in your cart.</Text>
                            <TextField
                                name="label"
                                label="Label"
                                disabled
                                placeholder="Enter discount label"
                                value={formState?.label}
                                onChange={(value) => handleChangeValue("label", value)}
                            />
                        </BlockStack>
                    </Card>
                </InlineGrid>
                {/* Restore pages */}
                <Divider borderWidth="050" borderColor="border-secondary" />
                <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                    <Box as="section" paddingInlineStart={{ xs: "400", sm: "0" }} paddingInlineEnd={{ xs: "400", sm: "0" }}>
                        <BlockStack gap="100">
                            <Text as="h3" variant="headingMd">
                                Restore pages
                            </Text>
                            <Text as="p" variant="bodyMd">
                                Recreate the bundles page and the bundle builder page if they are mistakenly removed.
                            </Text>
                        </BlockStack>
                    </Box>
                    <Card roundedAbove="sm">
                        <Text as="p" variant="bodyMd" fontWeight="bold">Bundles page</Text>
                        <Text as="p" variant="bodyMd">Recreate the bundles page if it has been mistakenly removed.</Text>
                        <div style={{ marginTop: "10px" }}>
                            <Button>Reset to default</Button>
                        </div>
                    </Card>
                </InlineGrid>
                {/* <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                    <Box as="section" paddingInlineStart={{ xs: "400", sm: "0" }} paddingInlineEnd={{ xs: "400", sm: "0" }}>
                    </Box>
                    <Card roundedAbove="sm">
                        <Text as="p" variant="bodyMd" fontWeight="bold">Bundle builder page</Text>
                        <Text as="p" variant="bodyMd">Recreate the bundle builder page if it has been mistakenly removed.</Text>
                        <div style={{ marginTop: "10px" }}>
                            <Button>Reset to default</Button>
                        </div>
                    </Card>
                </InlineGrid> */}
                <div style={{ margin: "10px 0px" }}></div>
            </BlockStack>
        </Page>
    );
}

export default Settings