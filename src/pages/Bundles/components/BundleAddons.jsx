// React Imports
import { useContext, useEffect, useState } from 'react'

// Shopify Polaris
import { Badge, BlockStack, Box, Button, Card, Checkbox, Collapsible, Divider, Icon, InlineStack, Layout, Modal, Page, RadioButton, Select, Text, TextField } from '@shopify/polaris'
import { SaveBar } from '@shopify/app-bridge-react'

// shopify Icons
import { CircleChevronDownIcon, CircleChevronUpIcon, SearchIcon, ViewIcon, XIcon } from '@shopify/polaris-icons'

// Third Party IMports
import { useNavigate, useParams } from 'react-router-dom'

// Custom Component
import BundlesPreview from '../BundlesPreview'
import ValidationErrors from '../../../components/ValidationErrors'
import ProductSelection from '../../../components/ProductSelection'
import { MetaContext } from '../../../components/MetaDataContext/MetaDataProvider'
import DateTimePicker from '../../../components/DateRangePicker/DateTimePicker'
import YoutubeVideo from '../../../components/YoutubeVideo/YoutubeVideo'
import WidgetModal from '../../../components/WidgetModal/WidgetModal'
import PageSkeleton from '../../../components/PageSkeleton'
import { useFetchWithToken } from '../../../components/FetchDataAPIs/FetchWithToken'
import { ShopifyContext } from '../../../components/ShopifyProvider/ShopifyProvider'

const BundleAddons = () => {

  // Hooks
  const navigate = useNavigate();
  const { id } = useParams();
  const { discountOptions } = useContext(MetaContext);
  const { shopName } = useContext(ShopifyContext);
  const fetchWithToken = useFetchWithToken();

  // State
  const [data, setData] = useState({
    bundle_subtype: "all_product",
    bundle_description: "",
    discount_value: 10,
    start_time: "12:00 AM",
    end_time: "12:00 PM",
    endTime_status: "0",
    display_onShop: "product_page",
    bundle_title: "Product Add-ons",
    selection_type: 'multiple',
    status: "Published",
    discount_label: "Add-On Discount",
    discount_option_id: "1",
    selectedAddonIds: [],
    noPreselectetIds: "1",
    url: ""
  })
  const [errors, setErrors] = useState({})
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [open, setOpen] = useState(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [widgetModalOpen, setWidgetModalOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedDates, setSelectedDates] = useState({
    start: new Date(),
    end: new Date(),
  });

  const fetchBundleDetails = async (id) => {
    try {
      setLoading(true);
      const data = await fetchWithToken({
        url: `https://bundle-wave-backend.xavierapps.com/api/bundles/${id}`,
        method: 'GET',
      });

      const selectedOption = discountOptions.find(option => option.id === data.discount_option_id);

      setSelectedDates({
        start: data.start_date ? new Date(data.start_date) : new Date(),
        end: data.end_date ? new Date(data.end_date) : new Date(),
      });
      setSelectedCollections(data?.collections);
      setSelectedAddons(data?.addons);
      setSelectedProducts(data?.products);

      console.log("data:::", data);

      setData({
        bundle_name: data.bundle_name,
        discount_label: data.discount_label,
        bundle_subtype: data?.bundle_subtype,
        discount_option_id: selectedOption ? selectedOption.id : "",
        discount_value: data?.discount_value,
        collections: selectedCollections,
        products: selectedProducts,
        bundle_title: data?.bundle_title,
        bundle_description: data?.bundle_description,
        display_onShop: data?.display_onShop,
        selection_type: data?.selection_type,
        endTime_status: data?.endTime_status,
        start_time: data?.start_time,
        end_time: data?.end_time,
        status: data?.status,
        selectedAddonIds: data?.selectedAddonIds,
        noPreselectetIds: data?.noPreselectetIds,
        url: data?.url,
      });
    } catch (error) {
      console.error("Failed to fetch bundle details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBundleDetails(id);
    }
  }, [id]);

  const handleCheckboxChange = (index) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleVideoModal = () => setVideoModalOpen(prev => !prev);
  const toggleWidgetModal = () => setWidgetModalOpen(prev => !prev);

  const handleChangeValue = (key, value) => {
    if (key === "selectedAddonIds") {
      setData((prevData) => {
        const isSingle = prevData.selection_type === "single";
        const prevIds = Array.isArray(prevData.selectedAddonIds) ? prevData.selectedAddonIds : [];

        let updatedIds;

        if (isSingle) {
          updatedIds = [value];
        } else {
          const isSelected = prevIds.includes(value);
          updatedIds = isSelected
            ? prevIds.filter((id) => id !== value)
            : [...prevIds, value];
        }

        shopify.saveBar.show('save');

        return {
          ...prevData,
          selectedAddonIds: updatedIds,
        };
      });
    } else {
      setData((prevData) => ({
        ...prevData,
        [key]: value,
      }));
    }
    shopify.saveBar.show('save');
  };

  const handleBrowseCollections = async () => {
    try {
      const collection = await shopify.resourcePicker({
        type: "collection",
        multiple: false,
        selectionIds: selectedCollections,
      });

      const collectionData = collection.selection.map((item) => ({
        id: item.id,
        title: item.title,
        image: item.image?.originalSrc || "",
      }));

      setSelectedCollections(collectionData);
      shopify.saveBar.show("save");
    } catch (error) {
      console.error("Error selecting collection:", error);
    }
  };

  const handleRemoveCollection = (id) => {
    setSelectedAddons(selectedAddons.filter((item) => item.id !== id));
    shopify.saveBar.show('save');
  };

  const handleToggle = (id) => {
    setOpen(open === id ? null : id);
  };

  const handleDateChange = (value) => {
    setSelectedDates((prev) => ({
      ...prev,
      start: value.start ? new Date(value.start) : prev.start,
    }));
    shopify.saveBar.show('save');
  };

  const handleEndDateChange = (value) => {
    setSelectedDates((prev) => ({
      ...prev,
      end: value.end ? new Date(value.end) : prev.end,
    }));
    shopify.saveBar.show('save');
  };

  const validateForm = () => {
    let newErrors = {};

    if (!["4", "5"].includes(data?.discount_option_id)) {
      const value = Number(data.discount_value);
      if (!value || isNaN(value) || value <= 0) {
        newErrors.discount_option_id = "Please enter a valid discount amount.";
      }
      if (data.discount_option_id === "1" && value >= 101) {
        newErrors.discount_option_id = "Discount must be less than 100.";
      }
    }
    if (!data.bundle_title) newErrors.bundle_title = "Bundle Title is required.";
    if (!selectedDates?.start) newErrors.startDate = "Start date is required.";
    if (!data.start_time) newErrors.start_time = "Start time is required.";

    if (data?.bundle_subtype === "specific_collection") {
      if (selectedCollections?.length === 0) newErrors.selectedCollections = "Minimum one collection are required.";
    } else if (data?.bundle_subtype === "specific_product") {
      if (selectedProducts?.length === 0) newErrors.selectedProducts = "Minimum one product are required.";
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    setErrors({});

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      return;
    }

    shopify.loading(true);
    try {
      const formatDate = (date) =>
        new Date(date.getTime() - date.getTimezoneOffset() * 60000)
          .toISOString()
          .split("T")[0];

      let checkBundleName;
      if (data?.bundle_subtype === "specific_collection") {
        checkBundleName = selectedCollections[0]?.title
      } else if (data?.bundle_subtype === "specific_product") {
        checkBundleName = selectedProducts[0]?.title
      } else {
        checkBundleName = "all"
      }

      const passData = {
        bundle_name: `Product add-on for ${checkBundleName}`,
        discount_label: data?.discount_label,
        bundle_subtype: data?.bundle_subtype,
        discount_option_id: data?.discount_option_id,
        discount_value: data?.discount_value,
        addons: selectedAddons,
        bundle_title: data?.bundle_title,
        bundle_description: data?.bundle_description || "",
        display_onShop: data?.display_onShop,
        selection_type: data?.selection_type,
        start_date: formatDate(selectedDates?.start),
        endTime_status: data?.endTime_status,
        start_time: data?.start_time,
        status: data?.status,
        bundle_type_id: "5",
        selectedAddonIds: data.selectedAddonIds,
        noPreselectetIds: data.noPreselectetIds,
      }

      if (data?.bundle_subtype === "specific_collection") {
        passData.collections = selectedCollections;
        passData.products = [];
      } else if (data?.bundle_subtype === "specific_product") {
        passData.products = selectedProducts;
        passData.collections = [];
      } else if (data?.bundle_subtype === "all_product") {
        passData.products = [];
        passData.collections = [];
      }

      if (data.endTime_status === "1") {
        passData.end_date = formatDate(selectedDates.end);
        passData.end_time = data.end_time;
      } else {
        passData.end_date = null;
        passData.end_time = null;
      }

      const url = id
        ? `https://bundle-wave-backend.xavierapps.com/api/bundles/update/${id}`
        : `https://bundle-wave-backend.xavierapps.com/api/bundles/create`;

      const result = await fetchWithToken({
        url: url,
        method: 'POST',
        body: passData,
        isFormData: false,
      });

      if (result.status) {
        // navigate("/bundles");
        navigate(`/bundlesList/addons_bundle/edit/${result?.id}`)
        fetchBundleDetails(result?.id);
        shopify.loading(false);
        shopify.saveBar.hide("save");
        shopify.toast.show(`${id ? "Update" : "Create"} Successful Bundle`);
      } else {
        shopify.loading(false);
        if (result.error_type === "all_product") {
          setErrors({ all_product: `Only one "All Product" bundle is allowed per shop.` });
        } else {
          shopify.toast.show(result.message, {
            isError: true,
            duration: 8000
          });
        }
      }
    } catch {
      shopify.saveBar.hide("save");
      shopify.loading(false);
    } finally {
      shopify.saveBar.hide("save");
      shopify.loading(false);
    }
  }

  return (
    <>
      {loading ? (
        <PageSkeleton />
      ) : (
        <Page
          title={`${id ? "Update" : "Create"} Add-ons`}
          backAction={{
            onAction: () => {
              shopify.saveBar.hide('save')
              navigate("/bundles")
            }
          }}
          secondaryActions={id ? [
            {
              content: "Widget not visible?",
              onAction: toggleWidgetModal,
            },
            {
              content: "View on store",
              icon: ViewIcon,
              onAction: () => {
                if (data?.url) {
                  window.open(`https://${shopName}/products/${data?.url}`, '_blank')
                } else {
                  window.open(`https://${shopName}/?id=${id}`, '_blank');
                }
              }
            },
          ] : []}
        >
          <SaveBar id="save">
            <button variant="primary" onClick={handleSubmit}>Save</button>
            <button type='reset' onClick={() => {
              shopify.saveBar.hide('save');
              navigate("/bundles")
            }}></button>
          </SaveBar>

          {errors && <ValidationErrors errors={errors} />}

          <Layout>
            <Layout.Section>
              <BlockStack gap={"300"}>

                {/* Main product */}
                <Card>
                  <BlockStack gap="300">
                    <BlockStack>
                      <Text as="span" variant="headingMd">Main product</Text>
                      <Text as="span" variant="bodyMd" tone="subdued">Select the item that you want to pair with the add-on items for sale.</Text>
                    </BlockStack>
                    <InlineStack gap="200">
                      <div style={{ display: "flex", flexDirection: "column", width: '100%' }}>
                        <RadioButton
                          label="All products"
                          checked={data.bundle_subtype === 'all_product'}
                          id="all_product"
                          onChange={() => {
                            handleChangeValue("bundle_subtype", "all_product");
                            setSelectedProducts([]);
                            setSelectedCollections([]);
                          }}
                        />
                        <RadioButton
                          label="Products in a specific collection"
                          id="specific_collection"
                          checked={data.bundle_subtype === 'specific_collection'}
                          onChange={() => {
                            handleChangeValue("bundle_subtype", "specific_collection");
                            setSelectedProducts([]);
                          }}
                        />
                        <RadioButton
                          label="A specific product"
                          id="specific_product"
                          checked={data.bundle_subtype === 'specific_product'}
                          onChange={() => {
                            handleChangeValue("bundle_subtype", "specific_product");
                            setSelectedCollections([]);
                          }}
                        />
                        {data?.bundle_subtype === 'specific_collection' &&
                          <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: "5px" }}>
                              <div style={{ width: '100%' }}>
                                <TextField prefix={<Icon source={SearchIcon} />} label="Search" labelHidden placeholder="Search" autoComplete="off" />
                              </div>
                              <Button onClick={handleBrowseCollections}>Browse</Button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                              {selectedCollections?.map((v, i) =>
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
                          </>
                        }
                        {data?.bundle_subtype === 'specific_product' &&
                          <ProductSelection
                            selectedProducts={selectedProducts}
                            setSelectedProducts={setSelectedProducts}
                            productCount={false}
                            multipleProduct={false}
                          />
                        }
                      </div>
                    </InlineStack>
                  </BlockStack>
                </Card>

                {/* Add-ons */}
                <Card>
                  <BlockStack gap="300">
                    <BlockStack>
                      <ProductSelection
                        title="Add-ons"
                        subtitle="Select the add-ons you want to sell alongside the main product."
                        selectedProducts={selectedAddons}
                        setSelectedProducts={setSelectedAddons}
                      />
                    </BlockStack>
                  </BlockStack>
                </Card>

                {/* Discount */}
                <Card>
                  <BlockStack gap="300">
                    <Text as="span" variant="headingMd">Discount</Text>
                    <Text as="span" variant="bodyMd" tone="subdued">Set the discount that applies on the add-on items.</Text>

                    <InlineStack gap="200">
                      {/* Discount Type Selection */}
                      <Box width="200px">
                        <Select
                          label="Type"
                          options={discountOptions.map(({ label, id, disabled }) => ({
                            label,
                            value: id,
                            disabled: disabled === "1",
                          }))}
                          placeholder="Select Type"
                          onChange={(id) => {
                            const selectedOption = discountOptions.find(option => option.id === id);
                            if (selectedOption?.disabled === "1") return;

                            handleChangeValue("discount_value", "0");
                            handleChangeValue("discount_option_id", id);
                          }}
                          value={data.discount_option_id}
                        />
                      </Box>

                      {data?.discount_option_id &&
                        <>
                          {!["4", "5"].includes(data.discount_option_id) && (
                            <Box width="100px" >
                              <TextField
                                label="Amount"
                                min={1}
                                prefix={data.discount_option_id === "1" ? "%" : "$"}
                                type="number"
                                value={data.discount_value}
                                onChange={(value) => handleChangeValue("discount_value", value)}
                                autoComplete="off"
                              />
                            </Box>
                          )}
                        </>
                      }
                    </InlineStack>
                  </BlockStack>
                </Card>

                {/* Details */}
                <Card>
                  <BlockStack gap="300">
                    <Text as="span" variant="headingMd">Details</Text>
                    <TextField
                      label="Title"
                      value={data?.bundle_title}
                      onChange={(value) => handleChangeValue("bundle_title", value)}
                      maxLength={150}
                      autoComplete="off"
                      showCharacterCount
                    />
                    <TextField
                      label="Short description"
                      value={data?.bundle_description}
                      onChange={(value) =>
                        handleChangeValue("bundle_description", value || "")
                      }
                      maxLength={200}
                      autoComplete="off"
                      showCharacterCount
                    />
                  </BlockStack>
                </Card>

                {/* Display on your shop */}
                <Card>
                  <BlockStack gap="300">
                    <Text as="span" variant="headingMd">Display on your shop</Text>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <RadioButton
                        label="Inline block on the main product’s page"
                        checked={data?.display_onShop === "product_page"}
                        id="product_page"
                        onChange={() => handleChangeValue("display_onShop", "product_page")}
                      />
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <RadioButton
                          label="Pop-up after clicking on Add To Cart button"
                          id="cart_button"
                          checked={data?.display_onShop === "cart_button"}
                          onChange={() => handleChangeValue("display_onShop", "cart_button")}
                        />
                        <Badge tone="info">New</Badge>
                      </div>
                    </div>
                  </BlockStack>
                </Card>

                {/* Advanced settings */}
                <div style={{ marginBottom: "10px" }}>
                  <Card>
                    <BlockStack gap="300">
                      <Text as="span" variant="headingMd">Advanced settings</Text>
                      <Card>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => handleToggle(1)}>
                          <p>Selection type</p>
                          <Button
                            onClick={() => handleToggle(1)}
                            icon={open === 1 ? CircleChevronUpIcon : CircleChevronDownIcon}
                            ariaExpanded={open === 1}
                            ariaControls="basic-collapsible"
                            variant='plain'
                          >
                          </Button>
                        </div>
                        <Collapsible
                          open={open === 1}
                          id="basic-collapsible"
                          transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                          expandOnPrint
                        >
                          <div style={{ margin: "10px 0px" }}>
                            <Divider />
                          </div>
                          <div>
                            <RadioButton
                              label="Allow multiple selections"
                              helpText="Customers can add both “Add-on A” and “Add-on B” to their cart"
                              checked={data?.selection_type === 'multiple'}
                              id="multiple"
                              name="multiple"
                              onChange={() => {
                                handleChangeValue("selection_type", "multiple");
                                handleChangeValue("selectedAddonIds", "");
                                handleChangeValue("noPreselectetIds", "0");
                              }}
                            />
                            <RadioButton
                              label="Restrict to a single selection"
                              helpText="Customers are restricted to adding only “Add-on A” or “Add-on B” to their cart, but not both"
                              id="single"
                              name="single"
                              checked={data?.selection_type === 'single'}
                              onChange={() => {
                                handleChangeValue("selection_type", "single");
                                handleChangeValue("noPreselectetIds", "1")
                                handleChangeValue("selectedAddonIds", "");
                              }}
                            />
                          </div>
                        </Collapsible>
                      </Card>
                      <Card>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => handleToggle(2)}>
                          <p>Preselected add-ons</p>
                          <Button
                            onClick={() => handleToggle(2)}
                            icon={open === 2 ? CircleChevronUpIcon : CircleChevronDownIcon}
                            ariaExpanded={open === 2}
                            ariaControls="basic-collapsible"
                            variant='plain'
                          >
                          </Button>
                        </div>
                        <Collapsible
                          open={open === 2}
                          id="basic-collapsible"
                          transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                          expandOnPrint
                        >
                          <div style={{ margin: "10px 0px" }}>
                            <Divider />
                          </div>
                          {data?.selection_type === 'single' &&
                            <>
                              <RadioButton
                                label="No preselected product"
                                checked={data.noPreselectetIds === "1"}
                                onChange={(value) => {
                                  const checked = value ? "1" : "0"
                                  handleChangeValue("noPreselectetIds", checked)
                                  if (checked === "1") {
                                    handleChangeValue("selectedAddonIds", "");
                                  }
                                }}
                                id="preselected"
                                name="preselected"
                              />
                              <div style={{ margin: "10px 0px" }}>
                                <Divider />
                              </div>
                            </>
                          }
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                            {selectedAddons?.map((v, i) =>
                              <div key={i}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                  <div>
                                    {data?.selection_type === 'single' ? (
                                      <RadioButton
                                        checked={Array.isArray(data.selectedAddonIds) && data.selectedAddonIds.includes(v.id)}
                                        onChange={() => {
                                          handleChangeValue("selectedAddonIds", v.id);
                                          handleChangeValue("noPreselectetIds", "0")
                                        }}
                                      />
                                    ) : (
                                      <Checkbox
                                        checked={Array.isArray(data.selectedAddonIds) && data.selectedAddonIds.includes(v.id)}
                                        onChange={() => handleChangeValue("selectedAddonIds", v.id)}
                                      />
                                    )}
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: '10px' }}>
                                    <div style={{ width: "50px", height: "50px" }}>
                                      <img
                                        src={v?.image}
                                        width="100%"
                                        height="100%"
                                        style={{ borderRadius: "10px", objectFit: "contain" }}
                                      />
                                    </div>
                                    <Text as="p">{v.title}</Text>
                                  </div>
                                </div>
                                {i !== selectedAddons.length - 1 && (
                                  <div style={{ margin: "10px 0px" }}>
                                    <Divider />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </Collapsible>
                      </Card>
                      <Card>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => handleToggle(5)}>
                          <p>Discount</p>
                          <Button
                            onClick={() => handleToggle(5)}
                            icon={open === 5 ? CircleChevronUpIcon : CircleChevronDownIcon}
                            ariaExpanded={open === 5}
                            ariaControls="basic-collapsible"
                            variant='plain'
                          >
                          </Button>
                        </div>
                        <Collapsible
                          open={open === 5}
                          id="basic-collapsible"
                          transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                          expandOnPrint
                        >
                          <div style={{ margin: "10px 0px" }}>
                            <Divider />
                          </div>
                          <TextField
                            label="Discount label"
                            value={data.discount_label}
                            onChange={(value) => handleChangeValue("discount_label", value)}
                            autoComplete="off"
                          />
                        </Collapsible>
                      </Card>
                      <Card>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => handleToggle(6)}>
                          <p>Active dates</p>
                          <Button
                            onClick={() => handleToggle(6)}
                            icon={open === 6 ? CircleChevronUpIcon : CircleChevronDownIcon}
                            ariaExpanded={open === 6}
                            ariaControls="basic-collapsible"
                            variant='plain'
                          >
                          </Button>
                        </div>
                        <Collapsible
                          open={open === 6}
                          id="basic-collapsible"
                          transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                          expandOnPrint
                        >
                          <div style={{ margin: "10px 0px" }}>
                            <Divider />
                          </div>
                          <div style={{ margin: "10px 0px" }}>
                            <DateTimePicker
                              label="Start"
                              dateValue={selectedDates.start}
                              timeValue={data.start_time}
                              onDateChange={handleDateChange}
                              onTimeChange={(time) => handleChangeValue("start_time", time)}
                            />
                          </div>

                          <Checkbox
                            label="Set end time"
                            helpText="By setting the end time the bundle will automatically be drafted after the end time."
                            checked={data.endTime_status === "1"}
                            onChange={(value) => handleChangeValue("endTime_status", value ? "1" : "0")}
                          />

                          {data.endTime_status === "1" &&
                            <div style={{ margin: "10px 0px" }}>
                              <DateTimePicker
                                label="End"
                                dateValue={selectedDates.end}
                                timeValue={data.end_time}
                                onDateChange={handleEndDateChange}
                                onTimeChange={(time) => handleChangeValue("end_time", time)}
                              />
                            </div>
                          }
                        </Collapsible>
                      </Card>
                    </BlockStack>
                  </Card>
                </div>
              </BlockStack>
            </Layout.Section>

            <Layout.Section variant="oneThird">
              <BlockStack gap={"300"}>
                <Card>
                  <BlockStack>
                    <Text as="span" variant="headingMd">Status</Text>
                  </BlockStack>

                  <div style={{ margin: "10px 0px" }}>
                    <Select
                      label=""
                      options={
                        [{ label: 'Draft', value: 'Draft' },
                        { label: 'Published', value: 'Published' },
                        ]
                      }
                      onChange={(value) => handleChangeValue("status", value)}
                      value={data.status}
                    />
                  </div>
                </Card>

                <Card>
                  <BlockStack gap="300">
                    <Text as="span" variant="headingMd">Watch our step-by-step get started video</Text>
                  </BlockStack>
                  <div style={{ marginTop: "10px", cursor: "pointer" }} onClick={toggleVideoModal}>
                    <img src='https://cdn.shopify.com/s/files/1/0839/1399/8619/files/Screenshot_2.png?v=1743768094' width="100%" />
                  </div>
                </Card>

                <Card>
                  <BlockStack gap="300">
                    <Text as="span" variant="headingMd">Bundle preview</Text>
                    {(selectedProducts.length > 0 || selectedCollections.length > 0) && selectedAddons.length > 0 &&
                      <div style={{ maxHeight: '500px', overflowX: "auto", display: "flex", flexDirection: "column", scrollbarWidth: "none" }}>
                        <div style={{ width: "100%" }}>
                          <img
                            src={selectedProducts[0]?.image || selectedCollections[0]?.image}
                            style={{ width: "100%", height: "290px", objectFit: "cover" }}
                          />
                        </div>
                        <div style={{ width: "100%" }}>
                          <p style={{ marginTop: '10px', fontSize: "1rem", fontWeight: "500", marginBottom: "5px" }}>{data?.bundle_title}</p>
                          <span>{data?.bundle_description}</span>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "10px" }}>
                            {selectedAddons.map((value, index) => {
                              const isChecked = data?.selectedAddonIds.includes(value?.id) ? true : false;

                              return (
                                <div key={index}>
                                  <div style={{ border: "1px solid gray", borderRadius: "10px", display: "flex", alignItems: "center", padding: "10px" }}>
                                    <Checkbox checked={isChecked || !!checkedItems[index]} onChange={() => handleCheckboxChange(index)} />
                                    <img src={value?.image} style={{ width: "50px", height: "50px", marginLeft: "10px", objectFit: "fill" }} />
                                    <div style={{ marginLeft: "10px" }}>
                                      <p>{value?.title}</p>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    }

                    <BundlesPreview
                      bundle_type_id="5"
                      modalSize="large"
                      data={data}
                      products={selectedProducts}
                      collections={selectedCollections}
                      secondCollection={selectedAddons}
                    />
                  </BlockStack>
                </Card>
              </BlockStack>
            </Layout.Section>
          </Layout>

          <Modal
            open={videoModalOpen}
            onClose={toggleVideoModal}
            title="Watch how it works"
            size='large'
          >
            <Modal.Section>
              <YoutubeVideo />
            </Modal.Section>
          </Modal>

          <Modal
            open={widgetModalOpen}
            onClose={toggleWidgetModal}
            title="Widget not visible?"
            size='large'
          >
            <Modal.Section>
              <WidgetModal copyId={id} />
            </Modal.Section>
          </Modal>
        </Page>
      )}
    </>
  )
}

export default BundleAddons