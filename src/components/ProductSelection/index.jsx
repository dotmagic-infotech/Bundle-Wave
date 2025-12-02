// React Imports
import { useContext, useEffect, useState } from "react";

// Shopify Imports
import { ActionList, Badge, BlockStack, Box, Button, Icon, Popover, Text, TextField } from "@shopify/polaris";
import { SearchIcon, XIcon } from "@shopify/polaris-icons";

// Custom Component
import { MetaContext } from "../MetaDataContext/MetaDataProvider";

const ProductSelection = ({
    title,
    subtitle,
    selectedProducts,
    setSelectedProducts,
    selectedCollections = [],
    setSelectedCollections = () => { },
    multiple,
    productCount = true,
    disabled = false,
    multipleProduct = true,
}) => {

    // Hooks
    const { metaData } = useContext(MetaContext);

    // State
    const [popoverTired, setPopoverTired] = useState(false);

    useEffect(() => {
        if (Array.isArray(selectedProducts) && selectedProducts.length > 0) {
            setSelectedCollections([]);
        }
    }, [selectedProducts, setSelectedCollections]);

    // ✅ If collections selected, clear products
    useEffect(() => {
        if (Array.isArray(selectedCollections) && selectedCollections.length > 0) {
            setSelectedProducts([]);
        }
    }, [selectedCollections, setSelectedProducts]);

    const togglePopoverBrowsActive = (() => setPopoverTired((popoverButton) => !popoverButton));

    const handleBrowseProducts = async () => {
        const products = await shopify.resourcePicker({ type: 'product', multiple: multipleProduct && metaData?.product_count, selectionIds: selectedProducts });

        const productData = products?.map(product => {
            const existingProduct = selectedProducts?.find(p => p.id === product.id);

            return {
                id: product.id,
                product_count: existingProduct?.product_count || 1,
                title: product?.title,
                image: product?.images[0]?.originalSrc,
                hasOnlyDefaultVariant: product?.hasOnlyDefaultVariant === false ? '0' : '1',
                variants: product.variants.map(variant => ({ id: variant.id, price: variant?.price, image: variant?.image?.originalSrc, availableForSale: variant?.availableForSale, title: variant?.title, compare_price: variant?.compareAtPrice })),
            };
        });
        setSelectedProducts(productData || []);
        shopify.saveBar.show('save');
    };

    const handleBrowseCollections = async () => {
        const collection = await shopify.resourcePicker({ type: 'collection', multiple: false, selectionIds: selectedCollections })
        const collectionData = collection?.map(product => {
            return {
                id: product.id,
                title: product?.title,
                image: product?.image?.originalSrc,
            };
        });
        setSelectedCollections(collectionData || []);
        shopify.saveBar.show('save');
    };

    const handleVariantSelection = async (productId, productVariants, productName) => {
        try {
            const variantData = productVariants.map((product) => ({
                id: product.id
            }))

            const selectedVariants = await shopify.resourcePicker({
                type: "variant",
                multiple: true,
                action: "select",
                selectionIds: variantData,
                filter: {
                    query: productName,
                },
            });

            const cleanedVariants = selectedVariants.map((variant) => ({
                id: variant.id,
                price: variant?.price,
                title: variant?.title,
                image: variant?.image?.originalSrc,
                compare_price: variant?.compareAtPrice,
                availableForSale: variant.availableForSale
            }));

            setSelectedProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === productId
                        ? { ...product, variants: cleanedVariants }
                        : product
                )
            );
            shopify.saveBar.show('save')
        } catch (error) {
            
        }
    };

    const handleChangeItemValue = (productId, value) => {
        shopify.saveBar.show("save")
        setSelectedProducts((prev) =>
            prev.map((product) =>
                product.id === productId ? { ...product, product_count: Number(value) || 1 } : product
            )
        );
    };

    const handleRemoveItem = (id) => {
        setSelectedProducts(selectedProducts.filter((item) => item.id !== id));
        shopify.saveBar.show('save')
    };

    const handleRemoveCollection = (id) => {
        setSelectedCollections(selectedCollections.filter((item) => item.id !== id));
        shopify.saveBar.show('save');
    };

    return (
        <>
            {title &&
                <BlockStack align="space-between" gap="200">
                    <Text as="span" variant="headingMd">{title}</Text>
                    <Text as="span" variant="bodyMd" tone="subdued">{subtitle}</Text>
                </BlockStack>
            }
            <div style={{ marginTop: "5px" }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '100%' }}>
                        <TextField prefix={<Icon source={SearchIcon} />} label="Search" labelHidden placeholder="Search" autoComplete="off" disabled={disabled} />
                    </div>
                    {multiple ?
                        <Popover
                            active={popoverTired}
                            activator={<Button onClick={togglePopoverBrowsActive} disclosure disabled={disabled}>
                                Browse
                            </Button>}
                            autofocusTarget="first-node"
                            onClose={togglePopoverBrowsActive}
                        >
                            <ActionList
                                actionRole="menuitem"
                                items={[
                                    {
                                        content: 'Select Product',
                                        onAction: async () => {
                                            setPopoverTired(false);
                                            handleBrowseProducts();
                                        }
                                    },
                                    {
                                        content: 'Select Collection',
                                        onAction: async () => {
                                            setPopoverTired(false);
                                            handleBrowseCollections();
                                        }
                                    }]}
                            />
                        </Popover>
                        :
                        <Button onClick={handleBrowseProducts} disabled={disabled}>Browse</Button>
                    }
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                    {selectedProducts?.length > 0 && selectedProducts?.map((product, i) => {
                        const anySoldOut = product?.variants?.some(v => !v.availableForSale);

                        return (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <img src={product?.image} width="40" height="40" style={{ borderRadius: '10px', objectFit: 'contain' }} />
                                    <div>
                                        <Text as="p">{product.title}</Text>
                                        {product?.hasOnlyDefaultVariant === "0" && (
                                            <div style={{ display: "flex", alignItems: "center", gap: '0.5rem' }}>
                                                <p style={{ color: "gray" }}>{product.variants.length} variants selected</p>
                                                <p style={{ color: "blue", cursor: "pointer" }} onClick={() => handleVariantSelection(product?.id, product?.variants, product?.title)}>Edit Variants</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {anySoldOut &&
                                        <Box>
                                            <Badge tone="critical">Sold Out</Badge>
                                        </Box>
                                    }
                                    <div style={{ cursor: 'pointer' }} onClick={() => handleRemoveItem(product.id)} >
                                        <Icon source={XIcon} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {selectedCollections?.length > 0 && selectedCollections?.map((v, i) =>
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: '10px' }}>
                                <div style={{ width: "40px", height: "40px" }}>
                                    <img src={v?.image} width="40px" height="40px" style={{ borderRadius: "10px", objectFit: "contain" }} />
                                </div>
                                <Text as="p">{v.title}</Text>
                            </div>
                            <div style={{ cursor: "pointer" }} onClick={() => handleRemoveCollection(v.id)}>
                                <Icon source={XIcon}></Icon>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}


export default ProductSelection