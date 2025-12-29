// React Imports
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Third Party Imports
import debounce from "lodash/debounce";
import { useNavigate } from 'react-router-dom';

// Shopify Polaris
import {
    IndexTable, LegacyCard, useIndexResourceState, Page, Tabs, Icon, TextField, Popover, ActionList, ButtonGroup, Button, Modal, TextContainer, Spinner, InlineStack, Banner, BlockStack, Text, Tooltip, Badge, ResourceList, ResourceItem, Scrollable,
} from '@shopify/polaris';
import { SaveBar, useAppBridge } from '@shopify/app-bridge-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Shopify Icons
import { AlertCircleIcon, ClipboardIcon, ClockIcon, DeleteIcon, DuplicateIcon, EditIcon, SearchIcon, ViewIcon } from '@shopify/polaris-icons';

// Custom Component
import { useApiRequest } from "../../../components/FetchDataAPIs/index"
import { ShopifyContext } from '../../../components/ShopifyProvider/ShopifyProvider';
import { MetaContext } from '../../../components/MetaDataContext/MetaDataProvider';

function BundleTable() {
    // Hooks
    const navigate = useNavigate();
    const { shopName } = useContext(ShopifyContext);
    const apiRequest = useApiRequest();
    const queryClient = useQueryClient();
    const shopify = useAppBridge();
    const { metaData } = useContext(MetaContext);

    // State
    const [selectedTabs, setSelectedTabs] = useState("All");
    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [popoverActive, setPopoverActive] = useState(false);
    const [activePopoverId, setActivePopoverId] = useState(null);
    const [activeBundleId, setActiveBundleId] = useState(null);
    const [active, setActive] = useState(false);
    const [activeDublicate, setActiveDublicate] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [displayBanner, setDisplayBanner] = useState("");
    const [copiedId, setCopiedId] = useState(null);

    const handleTabChange = (selectedTabIndex) => setSelectedTabs(tabs[selectedTabIndex].id);
    const togglePopoverActive = (() => setPopoverActive((popoverActive) => !popoverActive));
    const toggleViewActiveFor = (id) => setActivePopoverId(prev => (prev === id ? null : id));
    const closeView = () => setActivePopoverId(null);
    const handleChange = (() => setActive(!active));

    const debouncedSetSearch = useMemo(
        () => debounce((value) => {
            setDebouncedSearch(value);
            setCurrentPage(1);
        }, 500),
        []
    );

    const updateText = useCallback((value) => {
        const v = value || '';
        setSearchValue(v);
        debouncedSetSearch(v);
    }, [debouncedSetSearch]);

    useEffect(() => () => debouncedSetSearch.cancel(), [debouncedSetSearch]);

    const tabs = [
        { id: 'All', content: 'All' },
        { id: 'Published', content: 'Published' },
        { id: 'Draft', content: 'Draft' },
    ];

    const fetchBundles = async ({ queryKey }) => {
        const [_key, { page, status, search, shop }] = queryKey;

        const url = `https://bundle-wave-backend.xavierapps.com/api/bundles?limit=10&pagenumber=${page}&status=${status}&search=${encodeURIComponent(search)}&shop=${shop}`;

        const { status: ok, data } = await apiRequest(url, 'GET');
        if (!ok) throw new Error('Failed to fetch bundles');

        return data;
    };

    const { data, isLoading: bundleLoadnig } = useQuery({
        queryKey: [
            'bundles',
            { page: currentPage, status: selectedTabs, search: debouncedSearch, shop: shopName },
        ],
        queryFn: fetchBundles,
        staleTime: 0
    });

    const bundleData = data?.bundles ?? [];
    const pagination = data?.pagination ?? {};

    /* ----------------------- MUTATIONS ----------------------- */

    const deleteMutation = useMutation({
        mutationFn: (payload) =>
            apiRequest(
                'https://bundle-wave-backend.xavierapps.com/api/bundles/delete-multiple',
                'POST',
                payload
            ),

        onMutate: async (variables) => {
            await queryClient.cancelQueries({
                queryKey: ['bundles'],
                exact: false,
            });

            const previous = queryClient.getQueriesData({
                queryKey: ['bundles'],
            });

            queryClient.setQueriesData(
                { queryKey: ['bundles'], exact: false },
                (old) => {
                    if (!old?.bundles) return old;

                    return {
                        ...old,
                        bundles: old.bundles.filter(
                            (b) =>
                                !variables.bundle_data.some(
                                    (d) => Number(d.bundle_id) === Number(b.bundle_id)
                                )
                        ),
                    };
                }
            );

            return { previous };
        },

        onError: (_err, _vars, ctx) => {
            ctx?.previous?.forEach(([key, data]) => {
                queryClient.setQueryData(key, data);
            });
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['bundles'],
                exact: false,
                refetchType: 'active',
            });

            shopify.toast.show('Bundles deleted');
            handleChange();
            clearSelection();
            setCurrentPage(1);
        },
    });

    const handleDeleteConfirm = () => {
        if (deleteMutation.isPending) return;

        deleteMutation.mutate({
            bundle_data: bundleData
                .filter((b) => selectedResources.includes(String(b.bundle_id)))
                .map((b) => ({
                    bundle_id: b.bundle_id,
                    bundle_table: b.bundle_table,
                })),
        });
    };

    const duplicateMutation = useMutation({
        mutationFn: (payload) =>
            apiRequest(
                `https://bundle-wave-backend.xavierapps.com/api/bundles/duplicate-multiple?shop=${shopName}`,
                'POST',
                payload
            ),

        onError: (error, _vars, ctx) => {
            shopify.toast.show(
                error?.message || 'Failed to update bundle status',
                {
                    isError: true,
                    duration: 5000,
                }
            );
        },

        onSuccess: (res) => {
            queryClient.invalidateQueries({
                queryKey: ['bundles'],
                exact: false,
                refetchType: 'active',
            });

            shopify.toast.show(res?.data?.message || 'Bundles duplicated');
            clearSelection();
            setActiveDublicate(false);
        },
    });

    const handleDuplicateConfirm = (bundle_id = null, bundle_table = null) => {
        if (duplicateMutation.isPending) return;

        let payload = [];

        if (bundle_id && bundle_table) {
            payload = [{ bundle_id, bundle_table }];
        }
        else {
            payload = bundleData
                .filter((b) => selectedResources.includes(String(b.bundle_id)))
                .map((b) => ({
                    bundle_id: b.bundle_id,
                    bundle_table: b.bundle_table,
                }));
        }

        if (!payload.length) {
            shopify.toast.show('Please select at least one bundle to clone', {
                isError: true,
            });
            return;
        }

        duplicateMutation.mutate({
            bundle_data: payload,
        });
    };

    const statusMutation = useMutation({
        mutationFn: ({ bundle_id, bundle_table, status }) =>
            apiRequest(
                `https://bundle-wave-backend.xavierapps.com/api/bundles/status?shop=${shopName}`,
                'POST',
                { bundle_id, bundle_table, status }
            ),

        onMutate: async ({ bundle_id, status }) => {
            await queryClient.cancelQueries({
                queryKey: ['bundles'],
                exact: false,
            });

            const previous = queryClient.getQueriesData({
                queryKey: ['bundles'],
            });

            queryClient.setQueriesData(
                { queryKey: ['bundles'], exact: false },
                (old) => {
                    if (!old?.bundles) return old;

                    return {
                        ...old,
                        bundles: old.bundles.map((b) =>
                            String(b.bundle_id) === String(bundle_id)
                                ? { ...b, status }
                                : b
                        ),
                    };
                }
            );

            return { previous };
        },

        onError: (error, _vars, ctx) => {
            ctx?.previous?.forEach(([key, data]) => {
                queryClient.setQueryData([
                    'bundles',
                    { page: currentPage, status: selectedTabs, search: searchValue, shop: shopName },
                ], data);
            });

            shopify.toast.show(
                error?.message || 'Failed to update bundle status',
                {
                    isError: true,
                    duration: 5000,
                }
            );
        },

        onSuccess: (res) => {
            queryClient.invalidateQueries({
                queryKey: ['bundles'],
                exact: false,
            });
            shopify.toast.show(res?.data?.message || 'Bundle status updated');
        },
    });

    const updatingBundleId = statusMutation.isPending ? statusMutation.variables?.bundle_id : null;

    const updatingStatus = statusMutation.isPending ? statusMutation.variables?.status : null;

    const handlePublish = (bundle) => {
        if (statusMutation.isPending) return;

        statusMutation.mutate({
            bundle_id: bundle.bundle_id,
            bundle_table: bundle.bundle_table,
            status: 'Published',
        });
    };

    const handleDraft = (bundle) => {
        if (statusMutation.isPending) return;

        statusMutation.mutate({
            bundle_id: bundle.bundle_id,
            bundle_table: bundle.bundle_table,
            status: 'Draft',
        });
    };

    const handleCopy = (id, textToCopy) => {
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                setCopiedId(id);
                shopify.toast.show(`Copied to clipboard`);
                setTimeout(() => {
                    setCopiedId(null);
                }, 2000);
            })
            .catch((err) => {
                shopify.toast.show(`Failed to copy`);
            });
    };

    const resourceData = bundleData?.map(item => ({
        id: String(item.bundle_id),
    }));

    const { selectedResources, allResourcesSelected, handleSelectionChange, clearSelection } = useIndexResourceState(resourceData);

    const MediaIcons = ({ media }) => (
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginRight: '6rem', height: 40, }}>
            {media?.slice(0, 2).map((v, index) => (
                <div
                    key={index}
                    style={{
                        width: 40,
                        height: 40,
                        overflow: "hidden",
                        position: "absolute",
                        left: index * 30,
                        zIndex: 10 - index,
                        borderRadius: 8,
                        border: "1px solid #ddd",
                    }}
                >
                    <img
                        src={v.url}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </div>
            ))}

            {media?.length > 2 && (
                <div
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 500,
                        backgroundColor: "#f6f6f7",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "1px solid #ccc",
                        position: "absolute",
                        left: 60,
                        zIndex: 8,
                    }}
                >
                    +{media.length - 2}
                </div>
            )}
        </div>
    );

    const getEditUrl = (bundle_type_id, bundle_id) => {
        switch (bundle_type_id) {
            case "1":
                return `/bundlesList/fixed_bundle/edit/${bundle_id}`;
            case "2":
                return `/bundlesList/mix-match/edit/${bundle_id}`;
            case "3":
                return `/bundlesList/buy_xy/edit/${bundle_id}`;
            case "4":
                return `/bundlesList/volume_bundle/edit/${bundle_id}`;
            case "5":
                return `/bundlesList/addons_bundle/edit/${bundle_id}`;
            case "6":
                return `/bundlesList/frequently_bundle/edit/${bundle_id}`;
            default:
                return null;
        }
    };

    const handleNextPage = () => {
        if (pagination.current_page < pagination.total_pages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (pagination.current_page > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const rowMarkup = bundleData?.length > 0 && bundleData?.map(({ bundle_id, media, bundle_subtype, discount_options, bundle_name, discount_option_id, discount_value, status, active_status, bundle_type_id, bundle_table, bundle_type_name, url }, index) => {

        const hasTitle = media?.some(v => v.title?.trim());
        const mediaIcons = <MediaIcons media={media} />;

        return (
            <IndexTable.Row
                id={bundle_id.toString()}
                key={bundle_id.toString()}
                selected={selectedResources.includes(bundle_id.toString())}
                position={index}
                onClick={() => {
                    const url = getEditUrl(bundle_type_id, bundle_id);
                    navigate(url);
                }}
            >
                <IndexTable.Cell>
                    {hasTitle ? (
                        <Popover
                            active={activeBundleId === bundle_id}
                            preferredPosition="mostSpace"
                            activator={
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveBundleId((prev) =>
                                            prev === bundle_id ? null : bundle_id
                                        );
                                    }}
                                    style={{ cursor: "pointer", display: "inline-flex" }}
                                >
                                    {mediaIcons}
                                </div>
                            }
                            onClose={() => setActiveBundleId(null)}
                        >
                            <Popover.Pane>
                                <Scrollable style={{ maxHeight: "300px" }}>
                                    <ResourceList
                                        resourceName={{ singular: 'customer', plural: 'customers' }}
                                        items={media}
                                        renderItem={(item, index) => (
                                            <ResourceItem
                                                key={index}
                                                media={
                                                    <img
                                                        alt={item.title}
                                                        src={item.url}
                                                        style={{ width: 40, height: 40, borderRadius: 8 }}
                                                    />
                                                }
                                                accessibilityLabel={`View details for ${item.title}`}
                                                name={item.title}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Text variant="bodyMd" fontWeight="bold">
                                                    {item.title}
                                                </Text>

                                                {item?.variants?.length > 0 &&
                                                    item.variants.map((variant, i) => (
                                                        <Text key={i} as="p">
                                                            {variant}
                                                        </Text>
                                                    ))}
                                            </ResourceItem>
                                        )}
                                    />
                                </Scrollable>
                            </Popover.Pane>
                        </Popover>
                    ) : (
                        mediaIcons
                    )}
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text variant="bodyMd" fontWeight="medium" as="h3" tone='magic'>
                        {bundle_name}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Text>{bundle_id}</Text>
                        <Tooltip content={copiedId === bundle_id ? "Copied" : "Copy"}>
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopy(bundle_id, bundle_id);
                                }}
                            >
                                <Icon source={ClipboardIcon} />
                            </div>
                        </Tooltip>
                    </div>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    {discount_option_id === "1"
                        ? `${discount_value}% OFF`
                        : discount_option_id === "3"
                            ? `Set Price $${discount_value}`
                            : bundle_type_id === "4"
                                ? `${discount_options?.length} option`
                                : bundle_type_id === "2"
                                    ? (bundle_subtype === "Single"
                                        ? `$${discount_value} OFF`
                                        : `${discount_options?.length} option`)
                                    : "No Discounts"}
                </IndexTable.Cell>
                <IndexTable.Cell>
                    {active_status === "Pending" ? (
                        <Badge tone="info" size="large" icon={ClockIcon}>
                            {active_status}
                        </Badge>
                    ) : active_status === "Expired" ? (
                        <Badge tone="critical" size="large" icon={AlertCircleIcon}>
                            {active_status}
                        </Badge>
                    ) : (
                        <ButtonGroup variant="segmented">
                            <Button
                                variant={status === "Published" ? "primary" : "secondary"}
                                loading={updatingBundleId === bundle_id && updatingStatus === 'Published'}
                                disabled={updatingBundleId === bundle_id && updatingStatus === 'Published'}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (status !== 'Published') handlePublish({
                                        bundle_id,
                                        bundle_table,
                                    });
                                }}
                            >
                                Published
                            </Button>

                            <Button
                                variant={status === "Draft" ? "primary" : "secondary"}
                                loading={updatingBundleId === bundle_id && updatingStatus === 'Draft'}
                                disabled={updatingBundleId === bundle_id && updatingStatus === 'Draft'}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (status !== 'Draft') handleDraft({
                                        bundle_id,
                                        bundle_table,
                                    });
                                }}
                            >
                                Draft
                            </Button>
                        </ButtonGroup>
                    )}
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text variant="bodyMd" fontWeight="medium" as="h3" tone='magic'>
                        {bundle_type_name}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <InlineStack gap={100}>
                        {status === "Published" &&
                            <Tooltip content="Preview">
                                <Popover
                                    active={activePopoverId === bundle_id}
                                    activator={
                                        <Button disabled={selectedResources.length > 0} icon={ViewIcon}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleViewActiveFor(bundle_id);
                                            }}
                                        ></Button>
                                    }
                                    autofocusTarget="first-node"
                                    onClose={() => {
                                        if (activePopoverId === bundle_id) closeView();
                                    }}
                                >
                                    <Popover.Pane>
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <ActionList
                                                actionRole="menuitem"
                                                items={[
                                                    {
                                                        content: 'Home page',
                                                        disabled: bundle_subtype === "all_product",
                                                        onAction: () => {
                                                            toggleViewActiveFor(bundle_id);
                                                            window.open(`https://${shopName}/?id=${bundle_id}`, '_blank');
                                                        }
                                                    },
                                                    {
                                                        content: 'Include product page',
                                                        onAction: () => {
                                                            toggleViewActiveFor(bundle_id);
                                                            window.open(`https://${shopName}/${url}`, '_blank')
                                                        }
                                                    },
                                                ]}
                                            />
                                        </div>
                                    </Popover.Pane>
                                </Popover>
                            </Tooltip>
                        }

                        <Tooltip content="Edit">
                            <Button disabled={selectedResources.length > 0} icon={EditIcon} onClick={(event) => {
                                event.stopPropagation();
                                let url = "";

                                if (bundle_type_id === "1") {
                                    url = `/bundlesList/fixed_bundle/edit/${bundle_id}`;
                                } else if (bundle_type_id === "2") {
                                    url = `/bundlesList/mix-match/edit/${bundle_id}`;
                                } else if (bundle_type_id === "3") {
                                    url = `/bundlesList/buy_xy/edit/${bundle_id}`;
                                } else if (bundle_type_id === "4") {
                                    url = `/bundlesList/volume_bundle/edit/${bundle_id}`;
                                } else if (bundle_type_id === "5") {
                                    url = `/bundlesList/addons_bundle/edit/${bundle_id}`;
                                } else if (bundle_type_id === "6") {
                                    url = `/bundlesList/frequently_bundle/edit/${bundle_id}`;
                                } else {
                                    alert("Other Bundle");
                                    return;
                                }

                                navigate(url);
                            }}></Button>
                        </Tooltip>

                        <Tooltip content="Clone">
                            <Button disabled={selectedResources.length > 0} icon={DuplicateIcon} onClick={(event) => {
                                event.stopPropagation();
                                handleDuplicateConfirm(bundle_id, bundle_table)
                            }}></Button>
                        </Tooltip>
                    </InlineStack>
                </IndexTable.Cell>
            </IndexTable.Row>
        )
    });

    return (
        <Page
            title="Bundles"
            primaryAction={{ content: 'Create New Bundle', onAction: () => navigate("/bundlesList") }}
            fullWidth
        >
            <SaveBar id="save"></SaveBar>

            <BlockStack gap={500}>
                {displayBanner &&
                    <Banner title="Discount deleted — bundle not created."
                        tone="warning"
                    >
                        <p>{displayBanner}</p>
                    </Banner>
                }
                {metaData?.plan_id === "1" || metaData?.plan_id === "2" &&
                    <Banner title="Upgrade to more bundle unlock."
                        tone="info"
                        secondaryAction={{
                            content: 'Upgrade now',
                            onAction: () => navigate("/plans")
                        }}
                    >
                        <p>You're currently on a <strong>{metaData?.plan_title} plan</strong>. Upgrade to access advanced bundle types, detailed analytics, and priority support.
                        </p>
                    </Banner>
                }
                <div style={{ marginBottom: "15px" }}>
                    <LegacyCard>
                        <div style={{ padding: "10px 10px 0px 10px" }}>
                            <TextField
                                prefix={<Icon source={SearchIcon} />}
                                onChange={updateText}
                                label="Search"
                                labelHidden
                                value={searchValue}
                                placeholder="Search Bundles..."
                                autoComplete="off"
                            />
                        </div>
                        <div style={{ display: "flex", justifyContent: 'space-between', alignItems: "center" }}>
                            <Tabs tabs={tabs} selected={tabs.findIndex(tab => tab.id === selectedTabs)} onSelect={handleTabChange}></Tabs>
                            {selectedResources?.length > 0 && (
                                <div>
                                    <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", padding: "0.5rem" }}>
                                        <Popover
                                            active={popoverActive}
                                            activator={<Button onClick={togglePopoverActive} disclosure variant='secondary'>
                                                Actions
                                            </Button>}
                                            autofocusTarget="first-node"
                                            onClose={togglePopoverActive}
                                        >
                                            <ActionList
                                                actionRole="menuitem"
                                                items={[
                                                    { content: 'Delete', icon: DeleteIcon, onAction: handleChange },
                                                    { content: 'Clone', icon: DuplicateIcon, onAction: () => setActiveDublicate(true) }
                                                ]}
                                            />
                                        </Popover>
                                    </div>
                                </div>
                            )}
                        </div>
                        {bundleLoadnig ? (
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "calc(100vh - 350px)" }}>
                                <Spinner accessibilityLabel="Small spinner example" size="small" />
                            </div>
                        ) : bundleData?.length > 0 ? (
                            <IndexTable
                                resourceName={{ singular: 'order', plural: 'Bundles' }}
                                itemCount={bundleData?.length}
                                selectedItemsCount={allResourcesSelected ? 'All' : selectedResources?.length}
                                onSelectionChange={handleSelectionChange}
                                headings={[
                                    { title: 'Bundled items' },
                                    { title: 'Name' },
                                    { title: 'Bundle Id' },
                                    { title: 'Discount' },
                                    { title: 'Status' },
                                    { title: 'Type' },
                                    { title: 'Action' },
                                ]}
                                pagination={{
                                    label: `Page ${pagination.current_page} of ${pagination.total_pages}`,
                                    hasNext: pagination?.current_page < pagination?.total_pages,
                                    hasPrevious: pagination?.current_page > 1,
                                    onNext: handleNextPage,
                                    onPrevious: handlePreviousPage,
                                }}
                            >
                                {rowMarkup}
                            </IndexTable>
                        ) : (
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "calc(100vh - 350px)" }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <img
                                        src="https://cdn.shopify.com/s/files/1/0839/1399/8619/files/nodataimg.svg?v=1751617174"
                                        alt="No data found"
                                        style={{ width: "200px", height: "200px", marginBottom: "10px" }}
                                    />
                                    <p style={{ fontSize: "20px", fontWeight: "500" }}>No bundle data found</p>
                                </div>
                            </div>
                        )}
                    </LegacyCard>
                </div>
            </BlockStack>

            <Modal
                open={active}
                onClose={handleChange}
                title={`Are you sure you want to delete ${selectedResources.length > 0 ? selectedResources.length : 1} bundles?`}
                primaryAction={{
                    content: 'Delete',
                    destructive: true,
                    loading: deleteMutation.isPending,
                    onAction: handleDeleteConfirm,
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: handleChange,
                    },
                ]}
            >
                <Modal.Section>
                    <TextContainer>
                        <p>
                            This action cannot be undone. Deleting the selected bundles will remove them permanently from your store.
                        </p>
                    </TextContainer>
                </Modal.Section>
            </Modal>
            <Modal
                open={activeDublicate}
                onClose={() => setActiveDublicate(false)}
                title={`Are you sure you want to duplicate ${selectedResources.length} bundles?`}
                primaryAction={{
                    content: 'Clone',
                    loading: duplicateMutation.isPending,
                    onAction: handleDuplicateConfirm,
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: () => setActiveDublicate(false),
                    },
                ]}
            >
                <Modal.Section>
                    <TextContainer>
                        <p>
                            This action will create a copy of the selected bundles. You can modify the duplicated bundles after creation.
                        </p>
                    </TextContainer>
                </Modal.Section>
            </Modal>
        </Page>
    );
}

export default BundleTable;
