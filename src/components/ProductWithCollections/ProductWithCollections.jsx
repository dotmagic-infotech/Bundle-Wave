// React Imports
import { useContext, useEffect, useState } from 'react'

// Shopify Imports
import { ActionList, BlockStack, Box, Button, Card, Collapsible, Icon, Modal, Popover, Select, Text, TextField } from '@shopify/polaris';
import { CaretUpIcon, ChevronDownIcon, DeleteIcon, EditIcon, PlusIcon, XIcon } from '@shopify/polaris-icons';

// Custom Component
import { MetaContext } from '../MetaDataContext/MetaDataProvider';
import { useFetchWithToken } from '../FetchDataAPIs/FetchWithToken';
import { ShopifyContext } from '../ShopifyProvider/ShopifyProvider';
import SingleFileUploadDropZone from '../FileUploadDropZone/SingleFileUploadDropZone';

function ProductWithCollections({ sections, setSections }) {

    // Hooks
    const { metaData } = useContext(MetaContext);
    const fetchWithToken = useFetchWithToken();
    const { shopName } = useContext(ShopifyContext);

    // State
    const [popoverButton, setPopoverButton] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    const [mediaModal, setMediaModal] = useState(null);
    const [filesModal, setFilesModal] = useState(null);
    const [open, setOpen] = useState(null);
    const [editingSectionId, setEditingSectionId] = useState(null);

    const togglePopoverActive = (() => setPopoverButton((popoverButton) => !popoverButton));
    const handleChangeModalSection = (() => setActiveModal(!activeModal));

    const handleToggle = (index) => {
        setOpen(prev => (prev === index ? null : index));
    };

    useEffect(() => {
        const editingSection = sections.find((section) => section.id === editingSectionId);
        if (editingSection) {
            if (editingSection.media) {
                setMediaModal(editingSection.media);
            }

            if (editingSection.sectionImage) {
                setFilesModal(editingSection.sectionImage);
            }
        }
    }, [editingSectionId])

    const handleEditSection = async (id) => {
        const sectionToEdit = sections.find(section => section.id === id);

        const updateSection = (updates) => {
            setSections(prev =>
                prev.map(section =>
                    section.id === id ? { ...section, ...updates } : section
                )
            );
        };

        if (sectionToEdit) {
            if (sectionToEdit.products?.length > 0) {
                try {
                    const selectedProducts = await shopify.resourcePicker({
                        type: "product",
                        multiple: true,
                        action: "select",
                        selectionIds: sectionToEdit.products,
                    });

                    const existingVariantIds = new Set();
                    const collectionIds = sections
                        .filter(section => section.id !== id && section.collection && section.collection.length > 0)
                        .map(section => section.collection[0].id.split("/").pop());

                    if (collectionIds.length > 0) {
                        try {
                            const collectionVariants = await fetchWithToken({
                                url: `https://bundle-wave-backend.xavierapps.com/api/collection_varients?shop=${shopName}`,
                                method: 'POST',
                                body: collectionIds,
                                isFormData: false,
                            });

                            collectionVariants.forEach(variant => {
                                existingVariantIds.add(variant.id);
                            });
                        } catch (err) {
                            console.error("Error fetching collection variants:", err);
                        }
                    }

                    const filteredProducts = [];
                    let hasDuplicate = false;

                    selectedProducts.forEach(product => {
                        const filteredVariants = product.variants.filter(
                            variant => !existingVariantIds.has(variant.id)
                        );

                        if (filteredVariants.length === 0) {
                            hasDuplicate = true;
                            return;
                        }

                        filteredProducts.push({
                            id: product.id,
                            title: product.title,
                            image: product.images[0]?.originalSrc,
                            hasOnlyDefaultVariant: product.hasOnlyDefaultVariant === false ? '0' : '1',
                            variants: filteredVariants.map(variant => ({ id: variant.id, price: variant?.price, image: variant?.image?.originalSrc, title: variant?.title })),
                        });
                    });

                    if (filteredProducts.length === 0) {
                        shopify.toast.show("Selected products already exist in other collection(s). Please choose different products.", {
                            isError: true,
                            duration: 9000
                        });
                        return;
                    }

                    if (hasDuplicate) {
                        shopify.toast.show("Some products were skipped because their variants exist in other collections.", {
                            isError: false,
                            duration: 8000
                        });
                    }

                    updateSection({ products: filteredProducts });
                    shopify.saveBar.show("save");
                } catch (error) {
                    console.error("Error selecting products:", error);
                }
            } else if (sectionToEdit.collection?.length > 0) {
                try {
                    const { selection } = await shopify.resourcePicker({
                        type: "collection",
                        multiple: false,
                        action: "select",
                        selectionIds: sectionToEdit.collection,
                    });

                    if (!selection || selection.length === 0) return;

                    const selectedCollection = selection[0];
                    const existingVariantIds = new Set();

                    sections.forEach(section => {
                        if (section.id === id) return;
                        if (section.products && Array.isArray(section.products)) {
                            section.products.forEach(product => {
                                product.variants.forEach(variant => {
                                    existingVariantIds.add(variant.id);
                                });
                            });
                        }
                    });

                    const collectionVariants = await fetchWithToken({
                        url: `https://bundle-wave-backend.xavierapps.com/api/collection_varients?shop=${shopName}`,
                        method: 'POST',
                        body: [selectedCollection.id.split('/').pop()],
                        isFormData: false,
                    });

                    const hasDuplicateVariant = collectionVariants.some(obj =>
                        existingVariantIds.has(obj.id)
                    );

                    if (hasDuplicateVariant) {
                        shopify.toast.show(`${selectedCollection.title} products already added. Please choose another collection.`, {
                            isError: true,
                            duration: 9000,
                        });
                        return;
                    }

                    const collectionData = [{
                        id: selectedCollection.id,
                        title: selectedCollection.title,
                        image: selectedCollection.image?.originalSrc || null,
                    }];

                    setSections(prevSections =>
                        prevSections.map(section =>
                            section.id === id ? { ...section, collection: collectionData } : section
                        )
                    );
                    shopify.saveBar.show("save");
                } catch (error) {
                    console.error("Error selecting collection:", error);
                }
            }
        }
    };

    const handleDeleteSection = (id) => {
        setSections(prevSections => prevSections.filter(section => section.id !== id));
        shopify.saveBar.show('save');
    };

    const handleAddProducts = async () => {
        try {
            setPopoverButton(false);

            const products = await shopify.resourcePicker({
                type: 'product',
                multiple: metaData?.product_count,
                action: 'Next'
            });

            if (!products || products.length === 0) return;
            const existingVariantIds = new Set();

            const collectionIds = sections
                .filter(section => section.collection && section.collection.length > 0)
                .map(section => section.collection[0].id.split("/").pop());

            if (collectionIds.length > 0) {
                try {
                    const collectionVariants = await fetchWithToken({
                        url: `https://bundle-wave-backend.xavierapps.com/api/collection_varients?shop=${shopName}`,
                        method: 'POST',
                        body: collectionIds,
                        isFormData: false,
                    });

                    collectionVariants.forEach(variant => {
                        existingVariantIds.add(variant.id);
                    });
                } catch (error) {
                    console.error("Failed to fetch collection variants:", error);
                }
            }

            const filteredProducts = [];
            let hasDuplicate = false;

            products.forEach(product => {
                const filteredVariants = product.variants.filter(variant => !existingVariantIds.has(variant.id));

                if (filteredVariants.length === 0) {
                    hasDuplicate = true;
                    return;
                }

                filteredProducts.push({
                    id: product.id,
                    title: product.title,
                    image: product.images[0]?.originalSrc,
                    hasOnlyDefaultVariant: product.hasOnlyDefaultVariant === false ? '0' : '1',
                    variants: filteredVariants.map(variant => ({ id: variant.id, price: variant?.price, image: variant?.image?.originalSrc, title: variant?.title, compare_price: variant?.compareAtPrice })),
                });
            });

            if (filteredProducts.length === 0) {
                shopify.toast.show("Selected product(s) already exist in added collections. Please choose other product(s).", {
                    isError: true,
                    duration: 9000
                });
                return;
            }

            if (hasDuplicate) {
                shopify.toast.show("Some selected products were skipped because their variants are already part of existing collections.", {
                    isError: false,
                    duration: 8000
                });
            }

            const newSection = {
                products: filteredProducts,
                collection: null,
                sectionImage: null,
                id: Date.now(),
                quantity: "1",
                discountRequirement: "exact_quantity",
                discription: "Product Description",
            };

            setSections(prevSections => {
                const updated = [...prevSections, { sectionTitle: `Section ${prevSections.length + 1}`, ...newSection }];

                setOpen(updated.length - 1);
                return updated;
            });
            shopify.saveBar.show('save');
        } catch (err) {
            console.error("Error In Product NOT Found", err);
        }
    };

    const handleAddCollections = async () => {
        try {
            setPopoverButton(false);

            const collections = await shopify.resourcePicker({
                type: 'collection',
                action: 'Next',
                multiple: false,
            });

            if (!collections || collections.length === 0) return;

            const selectedCollection = collections[0];
            const existingVariantIds = new Set();

            sections.forEach(section => {
                if (section.products && Array.isArray(section.products)) {
                    section.products.forEach(product => {
                        product.variants.forEach(variant => {
                            existingVariantIds.add(variant.id);
                        });
                    });
                }
            });

            const collectionVariants = await fetchWithToken({
                url: `https://bundle-wave-backend.xavierapps.com/api/collection_varients?shop=${shopName}`,
                method: 'POST',
                body: [selectedCollection.id.split('/').pop()],
                isFormData: false,
            });

            const hasDuplicateVariant = collectionVariants.some(obj =>
                existingVariantIds.has(obj.id)
            );

            if (hasDuplicateVariant) {
                shopify.toast.show(`${selectedCollection.title} products already added. Please choose another collection.`, {
                    isError: true,
                    duration: 5000
                });
                return;
            }

            const collectionData = {
                id: selectedCollection.id,
                title: selectedCollection.title,
                image: selectedCollection.image ? selectedCollection.image.originalSrc : null,
            };

            const newSection = {
                collection: [collectionData],
                quantity: "1",
                discountRequirement: "exact_quantity",
                discription: "Collections Description",
                id: Date.now(),
            };

            setSections(prevSections => {
                const updated = [...prevSections, newSection];
                setOpen(updated.length - 1);

                return updated;
            });

            shopify.saveBar.show('save');
        } catch (error) {
            console.error("Error In Collection NOT Found", error);
        }
    };

    const handleRemoveItem = (productId, sectionId) => {
        setSections((prevSections) =>
            prevSections.map((section) =>
                section.id === sectionId
                    ? {
                        ...section,
                        products: section.products.filter((product) => product.id !== productId),
                    }
                    : section
            )
        );
        shopify.saveBar.show("save");
    };

    const handleAddSectionImage = () => {
        if (filesModal?.length === 0 && mediaModal) {
            return;
        }

        setSections((prevSections) =>
            prevSections.map((section) =>
                section.id === editingSectionId
                    ? {
                        ...section,
                        sectionImage: filesModal,
                    }
                    : section
            )
        );

        shopify.saveBar.show('save');

        setFilesModal([]);
        setEditingSectionId(null);
        handleChangeModalSection();
    };

    const handleChangeModalSction = (id, field, value) => {
        setSections(prevSections =>
            prevSections.map(section => {
                if (section.id !== id) return section;

                if (field === "discountRequirement") {
                    const { quantity, minimum, maximum, ...rest } = section;

                    if (value === "exact_quantity") {
                        return { ...rest, discountRequirement: value, quantity: "1" };
                    } else if (value === "minimum_quantity") {
                        return { ...rest, discountRequirement: value, minimum: "1" };
                    } else if (value === "range_quantity") {
                        return { ...rest, discountRequirement: value, minimum: "1", maximum: "1" };
                    }

                    return { ...rest, discountRequirement: value };
                }

                return { ...section, [field]: value };
            })
        );
        shopify.saveBar.show('save');
    };

    const getSectionImageSrc = (section) => {
        const image = section.sectionImage;

        if (image) {
            if (image instanceof File) {
                return URL.createObjectURL(image);
            }
            if (typeof image === "string") {
                return image;
            }
        }

        if (section.media) {
            return section.media;
        }

        if (section.sectionImage === null || section?.media === null) {
            return section.products?.[0].image;
        }

        return "https://bundle-wave-backend.xavierapps.com/assets/bundles/placeholderImage.jpeg";
    };

    return (
        <div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {sections?.map((v, i) =>
                    <div key={i}>
                        <Card padding={0}>
                            <div style={{ padding: "12px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => handleToggle(i)}>
                                    {v.collection?.length > 0 ?
                                        <p style={{ fontWeight: "600", fontSize: '15px' }}>{v?.collection[0]?.title}</p>
                                        :
                                        <p style={{ fontWeight: "600", fontSize: '15px' }}>{v?.sectionTitle}</p>
                                    }
                                    <div>
                                        <Icon source={open === i ? CaretUpIcon : ChevronDownIcon} />
                                    </div>
                                </div>
                                <Collapsible
                                    open={open === i}
                                    id={`collapsible-${i}`}
                                    transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                                    expandOnPrint
                                >
                                    <div style={{ marginTop: "10px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: '10px' }}>
                                                {/* Image  */}
                                                {v.collection?.length > 0 ?
                                                    <img src={v?.collection[0]?.image} width="56px" height="56px" style={{ borderRadius: "10px", objectFit: "cover" }} />
                                                    :
                                                    <div className="hover-wrapper" style={{ position: "relative", cursor: "pointer", display: "inline-block" }}
                                                        onClick={(e) => {
                                                            setEditingSectionId(v.id);
                                                            handleChangeModalSection();
                                                            e.stopPropagation();
                                                        }}
                                                    >
                                                        <img src={getSectionImageSrc(v)} width="56px" height="56px" style={{ borderRadius: "10px", objectFit: "cover", display: "block", }} alt="" />
                                                        <div className="hover-overlay" >
                                                            <Icon source={EditIcon} tone='primary' />
                                                        </div>
                                                    </div>
                                                }

                                                {/* Title */}
                                                {v.collection?.length > 0 ?
                                                    <p style={{ fontWeight: "500", fontSize: '13px' }}>{v?.collection[0]?.title}</p>
                                                    :
                                                    <Box width='100%'>
                                                        <TextField
                                                            label="Section Title"
                                                            type='text'
                                                            placeholder='Enter Section Title'
                                                            value={v?.sectionTitle}
                                                            onChange={(value) => handleChangeModalSction(v.id, "sectionTitle", value)}
                                                            autoComplete="off"
                                                        />
                                                    </Box>
                                                }
                                            </div>
                                            <div style={{ cursor: "pointer" }} onClick={() => handleDeleteSection(v.id)}>
                                                <Icon source={DeleteIcon} />
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: '5px 0px' }}>
                                            <Box width='50%'>
                                                <Select
                                                    label="Requirement for discount"
                                                    options={[
                                                        { label: 'Exact quantity', value: 'exact_quantity' },
                                                        { label: 'Minimum quantity', value: 'minimum_quantity' },
                                                        { label: 'Range quantity', value: 'range_quantity' },
                                                    ]}
                                                    onChange={(value) => handleChangeModalSction(v.id, "discountRequirement", value)}
                                                    value={v.discountRequirement}
                                                />
                                            </Box>
                                            {v.collection?.length > 0 &&
                                                <>
                                                    {v.discountRequirement === "exact_quantity" &&
                                                        <Box width='50%'>
                                                            <TextField
                                                                label="Quantity"
                                                                type='number'
                                                                min={1}
                                                                value={v.quantity || 1}
                                                                onChange={(value) => handleChangeModalSction(v.id, "quantity", value)}
                                                                autoComplete="off"
                                                            />
                                                        </Box>
                                                    }
                                                    {v.discountRequirement === "minimum_quantity" &&
                                                        <Box width='50%'>
                                                            <TextField
                                                                label="Minimum"
                                                                type='number'
                                                                min={1}
                                                                value={v.minimum || 1}
                                                                onChange={(value) => handleChangeModalSction(v.id, "minimum", value)}
                                                                autoComplete="off"
                                                            />
                                                        </Box>
                                                    }
                                                    {v.discountRequirement === "range_quantity" &&
                                                        <>
                                                            <Box width='25%'>
                                                                <TextField
                                                                    label="Minimum"
                                                                    type='number'
                                                                    min={1}
                                                                    value={v.minimum || 1}
                                                                    onChange={(value) => handleChangeModalSction(v.id, "minimum", value)}
                                                                    autoComplete="off"
                                                                />
                                                            </Box>
                                                            <Box width='25%'>
                                                                <TextField
                                                                    label="Maximum"
                                                                    type='number'
                                                                    min={1}
                                                                    value={v.maximum || 1}
                                                                    onChange={(value) => handleChangeModalSction(v.id, "maximum", value)}
                                                                    autoComplete="off"
                                                                />
                                                            </Box>
                                                        </>
                                                    }
                                                </>
                                            }
                                            {v.products?.length > 0 &&
                                                <>
                                                    {v.discountRequirement === "exact_quantity" &&
                                                        <Box width='50%'>
                                                            <TextField
                                                                label="Quantity"
                                                                type='number'
                                                                min={1}
                                                                value={v.quantity || 1}
                                                                onChange={(value) => handleChangeModalSction(v.id, "quantity", value)}
                                                                autoComplete="off"
                                                            />
                                                        </Box>
                                                    }
                                                    {v.discountRequirement === "minimum_quantity" &&
                                                        <Box width='50%'>
                                                            <TextField
                                                                label="Minimum"
                                                                type='number'
                                                                min={1}
                                                                value={v.minimum || 1}
                                                                onChange={(value) => handleChangeModalSction(v.id, "minimum", value)}
                                                                autoComplete="off"
                                                            />
                                                        </Box>
                                                    }
                                                    {v.discountRequirement === "range_quantity" &&
                                                        <>
                                                            <Box width='25%'>
                                                                <TextField
                                                                    label="Minimum"
                                                                    type='number'
                                                                    min={1}
                                                                    value={v.minimum || 1}
                                                                    onChange={(value) => handleChangeModalSction(v.id, "minimum", value)}
                                                                    autoComplete="off"
                                                                />
                                                            </Box>
                                                            <Box width='25%'>
                                                                <TextField
                                                                    label="Maximum"
                                                                    type='number'
                                                                    min={1}
                                                                    value={v.maximum || 1}
                                                                    onChange={(value) => handleChangeModalSction(v.id, "maximum", value)}
                                                                    autoComplete="off"
                                                                />
                                                            </Box>
                                                        </>
                                                    }
                                                </>
                                            }
                                        </div>
                                        <TextField
                                            label="Section Discription"
                                            autoComplete="off"
                                            value={v.discription}
                                            onChange={(value) => handleChangeModalSction(v.id, "discription", value)}
                                        />
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "10px 0px" }}>
                                            <Text as='h3' variant='headingMd'>{v.collection?.length > 0 ? "Selected Collections" : "Selected Product"}</Text>
                                            <Button onClick={() => handleEditSection(v.id)}>Edit</Button>
                                        </div>
                                        <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
                                            {v.products?.length > 0 && v.products?.map((product, i) => (
                                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <img src={product?.image} width="40" height="40" style={{ borderRadius: '10px', objectFit: 'contain' }} />
                                                        <div>
                                                            <Text as="p">{product.title}</Text>
                                                            {product?.hasOnlyDefaultVariant === "0" && (
                                                                <div style={{ display: "flex", alignItems: "center", gap: '0.5rem' }}>
                                                                    <p style={{ color: "gray" }}>{product.variants.length} variants selected</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{ cursor: 'pointer' }} onClick={() => handleRemoveItem(product.id, v.id)} >
                                                            <Icon source={XIcon} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {v.collection?.length > 0 && v.collection?.map((v, i) =>
                                                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: '10px' }}>
                                                        <div style={{ width: "40px", height: "40px" }}>
                                                            <img src={v?.image} width="40px" height="40px" style={{ borderRadius: "10px", objectFit: "contain" }} />
                                                        </div>
                                                        <Text as="p">{v.title}</Text>
                                                    </div>
                                                    <div style={{ cursor: "pointer" }}>
                                                        <Icon source={XIcon}></Icon>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Collapsible>
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            <div style={{ marginTop: "10px" }}>
                <Popover
                    active={popoverButton}
                    activator={<Button onClick={togglePopoverActive} disclosure icon={PlusIcon}>
                        Add Section
                    </Button>}
                    autofocusTarget="first-node"
                    onClose={togglePopoverActive}
                >
                    <ActionList
                        actionRole="menuitem"
                        items={[
                            {
                                content: 'Select Product',
                                onAction: handleAddProducts
                            },
                            {
                                content: 'Select Collection',
                                onAction: handleAddCollections
                            }]}
                    />
                </Popover>
            </div>

            <Modal
                open={activeModal}
                onClose={() => {
                    setActiveModal(false);
                    setEditingSectionId(null);
                }}
                title={"Add Image"}
                primaryAction={{
                    content: "Add",
                    onAction: handleAddSectionImage,
                }}
            >
                <Modal.Section>
                    <BlockStack gap={200}>
                        <SingleFileUploadDropZone
                            media={mediaModal}
                            file={filesModal}
                            setFile={setFilesModal}
                        />
                    </BlockStack>
                </Modal.Section>
            </Modal>
        </div>
    )
}

export default ProductWithCollections