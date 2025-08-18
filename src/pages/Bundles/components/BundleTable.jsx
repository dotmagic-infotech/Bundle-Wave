// React Imports
import { useCallback, useContext, useEffect, useState } from 'react';

// Third Party Imports
import debounce from "lodash/debounce";
import { useNavigate } from 'react-router-dom';

// Shopify Polaris
import {
    IndexTable, LegacyCard, useIndexResourceState, Page, Tabs, Icon, TextField, Popover, ActionList, ButtonGroup, Button, Modal, TextContainer, Spinner, InlineStack, Banner, BlockStack, Divider, Text, Tooltip, Badge,
} from '@shopify/polaris';
import { SaveBar, useAppBridge } from '@shopify/app-bridge-react';

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
    const shopify = useAppBridge();
    const { metaData } = useContext(MetaContext);

    // State
    const [selectedTabs, setSelectedTabs] = useState("All");
    const [searchValue, setSearchValue] = useState("");
    const [bundleData, setBundleData] = useState([]);
    const [pagination, setPagination] = useState({});
    const [popoverActive, setPopoverActive] = useState(false);
    const [active, setActive] = useState(false);
    const [activeDublicate, setActiveDublicate] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [displayBanner, setDisplayBanner] = useState("");
    const [copiedId, setCopiedId] = useState(null);
    const [loadData, setLoadData] = useState(false);
    const [loadingButton, setLoadingButton] = useState({ id: null, type: null });
    const [loadingBundleId, setLoadingBundleId] = useState(null);

    const handleTabChange = (selectedTabIndex) => setSelectedTabs(tabs[selectedTabIndex].id);
    const togglePopoverActive = (() => setPopoverActive((popoverActive) => !popoverActive));
    const handleChange = (() => setActive(!active));
    const handleDublicateChange = (() => setActiveDublicate(!activeDublicate));

    const updateText = useCallback((value) => {
        setSearchValue(value || '');
    }, []);

    const tabs = [
        { id: 'All', content: 'All' },
        { id: 'Published', content: 'Published' },
        { id: 'Draft', content: 'Draft' },
    ];

    const fetchData = async (search = "") => {
        setLoading(true);
        try {
            const url = `https://bundle-wave-backend.xavierapps.com/api/bundles?limit=10&pagenumber=${currentPage}&status=${selectedTabs}&search=${encodeURIComponent(search)}&shop=${shopName}`;
            const { status, data } = await apiRequest(url, 'GET');

            if (status) {
                setBundleData(data?.bundles);
                setDisplayBanner(data?.message);
                setPagination(data?.pagination);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        shopify.saveBar.hide("save");

        fetchData();
    }, [currentPage, selectedTabs]);

    const debouncedFetchData = useCallback(
        debounce((value) => {
            fetchData(value);
        }, 500),
        []
    );

    useEffect(() => {
        if (searchValue === "" || searchValue) {
            debouncedFetchData(searchValue);
        }
    }, [searchValue, debouncedFetchData]);

    const handleStatusChange = async (newStatus, bundle_id, bundle_table) => {
        setLoadingButton({ id: bundle_id, type: newStatus });
        try {
            const url = `https://bundle-wave-backend.xavierapps.com/api/bundles/status?shop=${shopName}`;
            const { data } = await apiRequest(url, 'POST', {
                bundle_id: bundle_id,
                status: newStatus,
                bundle_table: bundle_table
            });

            if (data?.status) {
                fetchData();
            } else {
                shopify.toast.show(data?.message, {
                    isError: true,
                    duration: 8000
                });
            }
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setLoadingButton({ id: null, type: null });
        }
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

    // IndexTable State
    const resourceData = bundleData?.map(item => ({
        id: item.bundle_id,
    }));

    const { selectedResources, allResourcesSelected, handleSelectionChange, clearSelection } = useIndexResourceState(resourceData);

    const rowMarkup = bundleData?.length > 0 && bundleData?.map(({ bundle_id, media, bundle_subtype, discount_options, bundle_name, discount_option_id, discount_value, status, active_status, bundle_type_id, bundle_table, bundle_type_name }, index) => (
        <IndexTable.Row
            id={bundle_id.toString()}
            key={bundle_id.toString()}
            selected={selectedResources.includes(bundle_id.toString())}
            position={index}
        >
            <IndexTable.Cell>
                <Tooltip
                    width='wide'
                    content={
                        <div style={{ padding: '4px 8px' }}>
                            {media.map((v, index) => (
                                <div key={index}>
                                    <div style={{ display: 'flex', alignItems: "center", marginBottom: '6px' }}>
                                        <div style={{ width: '40px', height: '40px' }}>
                                            <img src={v.url} alt="" style={{ width: '100%', height: '100%', borderRadius: '4px' }} />
                                        </div>
                                        <div style={{ marginLeft: "10px" }}>
                                            <p style={{ fontSize: '13px', fontWeight: 600, margin: 0 }}>{v.title}</p>
                                            {v?.variants?.length > 0 && (
                                                <ul style={{ margin: 0, paddingLeft: '16px' }}>
                                                    {v.variants.map((variant, i) => (
                                                        <li key={i} style={{ fontSize: '12px', color: 'gray' }}>{variant}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                    {index !== media.length - 1 &&
                                        <div style={{ margin: "8px 0px" }}>
                                            <Divider />
                                        </div>
                                    }
                                </div>
                            ))}
                        </div>
                    }
                    preferredPosition="above"
                >
                    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                        {media?.slice(0, 2).map((v, index) => (
                            <div key={index} style={{
                                width: "40px", height: "40px",
                                overflow: "hidden",
                                position: index === 0 ? "static" : "absolute",
                                left: index === 0 ? "0px" : "20px",
                                zIndex: index,
                                borderRadius: "50%",
                                backgroundColor: "#f6f6f7"
                            }}>
                                <img src={v.url} style={{ width: "100%", height: "100%" }} />
                            </div>
                        ))}
                        {media?.length > 2 && (
                            <div style={{ width: "40px", height: "40px", borderRadius: "50%", fontSize: "16px", fontWeight: "600", backgroundColor: "#f6f6f7", display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid gray", zIndex: 1 }}>
                                +{media.length - 2}
                            </div>
                        )}
                    </div>
                </Tooltip>
            </IndexTable.Cell>
            <IndexTable.Cell>
                <div style={{ display: "flex", gap: "1rem" }}>
                    {bundle_name}
                </div>
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
                            loading={loadingButton.id === bundle_id && loadingButton.type === "Published"} // ✅ only show loader if matching
                            onClick={(e) => {
                                e.stopPropagation();
                                status === "Published" ? undefined :
                                    handleStatusChange("Published", bundle_id, bundle_table);
                            }}
                        >
                            Published
                        </Button>

                        <Button
                            variant={status === "Draft" ? "primary" : "secondary"}
                            loading={loadingButton.id === bundle_id && loadingButton.type === "Draft"} // ✅ same idea
                            onClick={(e) => {
                                e.stopPropagation();
                                status === "Draft" ? undefined :
                                    handleStatusChange("Draft", bundle_id, bundle_table);
                            }}
                        >
                            Draft
                        </Button>
                    </ButtonGroup>
                )}
            </IndexTable.Cell>
            <IndexTable.Cell>
                {bundle_type_name}
            </IndexTable.Cell>
            <IndexTable.Cell>
                <InlineStack gap={200}>
                    <Tooltip content="Edit Bundle">
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

                    <Tooltip content="Clone Bundle">
                        <Button disabled={selectedResources.length > 0} loading={loadingBundleId === bundle_id} icon={DuplicateIcon} onClick={(event) => {
                            event.stopPropagation();
                            handleDuplicateSingle(bundle_id, bundle_table)
                        }}></Button>
                    </Tooltip>

                    {status === "Published" &&
                        <Tooltip content="Preview Bundle">
                            <Button disabled={selectedResources.length > 0} icon={ViewIcon} onClick={(event) => {
                                event.stopPropagation();
                                window.open(`https://${shopName}/?id=${bundle_id}`, '_blank')
                            }}></Button>
                        </Tooltip>
                    }

                    <Tooltip content="Delete Bundle">
                        <Button disabled={selectedResources.length > 0} icon={DeleteIcon} onClick={(event) => {
                            handleChange()
                        }}></Button>
                    </Tooltip>
                </InlineStack>
            </IndexTable.Cell>
        </IndexTable.Row>
    ));

    const handleDelete = async () => {
        try {
            setLoadData(true);
            const url = `https://bundle-wave-backend.xavierapps.com/api/bundles/delete-multiple?shop=${shopName}`;

            const { data } = await apiRequest(url, 'POST', {
                bundle_data: bundleData
                    .filter(({ bundle_id }) => selectedResources.includes(bundle_id))
                    .map(({ bundle_id, bundle_table }) => ({ bundle_id, bundle_table }))
            });

            setLoadData(false);
            if (data?.status) {
                fetchData();
                handleChange();
                clearSelection();
                setCurrentPage(1);
            } else {
                clearSelection();
                handleChange();
                shopify.toast.show(data?.message, {
                    isError: true,
                    duration: 8000
                });
            }
        } catch (error) {
            console.error("Failed to fetch bundle details:", error);
        }
    }

    const handleDublicate = async () => {
        try {
            setLoadData(true);
            const url = `https://bundle-wave-backend.xavierapps.com/api/bundles/duplicate-multiple?shop=${shopName}`;
            const { data } = await apiRequest(url, 'POST', {
                bundle_data: bundleData
                    .filter(({ bundle_id }) => selectedResources.includes(bundle_id))
                    .map(({ bundle_id, bundle_table }) => ({ bundle_id, bundle_table }))
            });

            setLoadData(false);

            if (data?.status) {
                fetchData();
                handleDublicateChange();
                clearSelection();
                setCurrentPage(1);
            } else {
                clearSelection();
                handleDublicateChange();
                shopify.toast.show(data?.message, {
                    isError: true,
                    duration: 8000
                });
            }
        } catch (error) {
            console.error("Failed to fetch bundle details:", error);
        }
    }

    const handleDuplicateSingle = async (bundle_id, bundle_table) => {
        try {
            setLoadingBundleId(bundle_id);

            const url = `https://bundle-wave-backend.xavierapps.com/api/bundles/duplicate-multiple?shop=${shopName}`;
            const payload = {
                bundle_data: [{ bundle_id, bundle_table }]
            };

            const { data } = await apiRequest(url, 'POST', payload);

            if (data?.status) {
                fetchData();
                clearSelection();
                setCurrentPage(1);
            } else {
                clearSelection();
                shopify.toast.show(data?.message, {
                    isError: true,
                    duration: 8000
                });
            }
        } catch (error) {
            console.error("Failed to duplicate bundle:", error);
            setLoadingBundleId(null);
        } finally {
            setLoadingBundleId(null);
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
                                placeholder="Search"
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
                                                items={[{ content: 'Delete', onAction: handleChange }, { content: 'Clone', onAction: handleDublicateChange }]}
                                            />
                                        </Popover>
                                    </div>
                                </div>
                            )}
                        </div>
                        {loading ? (
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
                    loading: loadData,
                    onAction: handleDelete,
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
                onClose={handleDublicateChange}
                title={`Are you sure you want to duplicate ${selectedResources.length} bundles?`}
                primaryAction={{
                    content: 'Clone',
                    loading: loadData,
                    onAction: handleDublicate,
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: handleDublicateChange,
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
