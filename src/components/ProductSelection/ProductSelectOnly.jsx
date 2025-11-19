// React Imports
import { useContext } from "react";

// Shopify Imports
import { BlockStack, Button, Icon, Text, TextField } from "@shopify/polaris";
import { SearchIcon, XIcon } from "@shopify/polaris-icons";

// Custom Component
import { MetaContext } from "../MetaDataContext/MetaDataProvider";

const ProductSelectOnly = ({
    title,
    subtitle,
    selectedProducts,
    setSelectedProducts,
    disabled = false,
    multipleProduct = true,
}) => {

    // Hooks
    const { metaData } = useContext(MetaContext);

    const handleBrowseProducts = async () => {
        const products = await shopify.resourcePicker({ type: 'product', multiple: multipleProduct && metaData?.product_count, selectionIds: selectedProducts });

        const productData = products?.map(product => {
            
            return {
                id: product.id,
                // product_count: existingProduct?.product_count || 1,
                title: product?.title,
                image: product?.images[0]?.originalSrc,
                // hasOnlyDefaultVariant: product?.hasOnlyDefaultVariant === false ? '0' : '1',
                // variants: product.variants.map(variant => ({ id: variant.id, title: variant?.title, })),
            };
        });
        setSelectedProducts(productData || []);
        shopify.saveBar.show('save');
    };

    const handleRemoveItem = (id) => {
        setSelectedProducts(selectedProducts.filter((item) => item.id !== id));
        shopify.saveBar.show('save')
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
                    <Button onClick={handleBrowseProducts} disabled={disabled}>Browse</Button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                    {selectedProducts?.length > 0 && selectedProducts?.map((product, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img src={product?.image} width="40" height="40" style={{ borderRadius: '10px', objectFit: 'contain' }} />
                                <div>
                                    <Text as="p">{product.title}</Text>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ cursor: 'pointer' }} onClick={() => handleRemoveItem(product.id)} >
                                    <Icon source={XIcon} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default ProductSelectOnly