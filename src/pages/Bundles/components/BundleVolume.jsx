// React Imports
import { useContext, useEffect, useState } from 'react'

// Shopify Polaris
import { BlockStack, Box, Button, Card, Checkbox, Divider, Icon, InlineError, InlineStack, Layout, Modal, Page, RadioButton, Select, Text, TextField } from '@shopify/polaris'
import { SaveBar } from '@shopify/app-bridge-react';

// Shopify Icons
import { DeleteIcon, PlusIcon, SearchIcon, ViewIcon, XIcon } from '@shopify/polaris-icons';

// Third Party Imports
import { useNavigate, useParams } from 'react-router-dom';

// Custom Component
import { MetaContext } from '../../../components/MetaDataContext/MetaDataProvider';
import ProductSelection from '../../../components/ProductSelection/index';
import ValidationErrors from '../../../components/ValidationErrors';
import BundlesPreview from '../BundlesPreview';
import DateTimePicker from '../../../components/DateRangePicker/DateTimePicker';
import YoutubeVideo from '../../../components/YoutubeVideo/YoutubeVideo';
import PageSkeleton from '../../../components/PageSkeleton';
import { ShopifyContext } from '../../../components/ShopifyProvider/ShopifyProvider';
import { useFetchWithToken } from '../../../components/FetchDataAPIs/FetchWithToken';
import WidgetModal from '../../../components/WidgetModal/WidgetModal';

const BundleVolume = () => {

  // Hooks
  const { discountOptions } = useContext(MetaContext);
  const { id } = useParams();
  const navigate = useNavigate()
  const { shopName } = useContext(ShopifyContext);
  const fetchWithToken = useFetchWithToken();

  // State
  const [data, setData] = useState({
    bundle_subtype: "all_product",
    start_time: "12:00 AM",
    end_time: "12:00 PM",
    endTime_status: "0",
    status: "Published",
    discount_label: "Volume Discount",
    bundle_info: "Buy more, Save more"
  })
  const [discountOption, setDiscountOption] = useState([
    { id: 1, required_items: "1", type: "1", discount_value: "10", description: "Buy 1 items", Label: "", Badge: "", selected_default: "0", allow_users: "0" }
  ]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [errors, setErrors] = useState({});
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [widgetModalOpen, setWidgetModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState({
    start: new Date(),
    end: new Date(),
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [])

  useEffect(() => {
    const fetchBundleDetails = async () => {
      try {
        const data = await fetchWithToken({
          url: `https://test-app.dotmagicinfotech.in/api/bundles/${id}?shop=${shopName}`,
          method: 'GET',
        });

        const selectedOption = discountOptions.find(option => option.id === data.discount_option_id);
        setSelectedDates({
          start: data.start_date ? new Date(data.start_date) : new Date(),
          end: data.end_date ? new Date(data.end_date) : new Date(),
        });

        setDiscountOption(data?.discount_options)

        setSelectedProducts(data?.products)
        setSelectedCollections(data?.collections)

        setData({
          bundle_subtype: data.bundle_subtype,
          different_variants: data.different_variants,
          theme_variant: data.theme_variant,
          discount_option_id: selectedOption ? selectedOption?.id : "",
          bundle_name: data?.bundle_name,
          discount_label: data.discount_label,
          bundle_info: data?.bundle_info,
          show_bundle_widget: data?.show_bundle_widget,
          start_time: data?.start_time,
          endTime_status: data?.endTime_status || "0",
          end_time: data?.end_time,
          status: data?.status
        });
      } catch (error) {
        console.error("Failed to fetch bundle details:", error);
      }
    };

    if (id) {
      fetchBundleDetails();
    }
  }, [id]);

  const toggleVideoModal = () => setVideoModalOpen(prev => !prev);
  const toggleWidgetModal = () => setWidgetModalOpen(prev => !prev);

  const handleCheckboxFour = (index) => {
    setSelectedOption(index);
  };

  const handleChangeValue = (key, value) => {
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
    shopify.saveBar.show('save');
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

  const handleAddOption = () => {
    if (discountOption?.length < 10) {
      shopify.saveBar.show("save");

      const lastRequiredItems = discountOption.length > 0
        ? parseInt(discountOption[discountOption.length - 1]?.required_items, 10) || 1
        : 1;

      setDiscountOption([
        ...discountOption,
        {
          id: discountOption.length + 1,
          required_items: (lastRequiredItems + 1).toString(),
          Label: "", 
          Badge: "",
          allow_users: "0",
          type: "1",
          discount_value: "10",
          description: `Buy ${lastRequiredItems + 1} items`
        }
      ]);
    }
  };

  const handleRemoveOption = (id) => {
    if (discountOption?.length > 1) {
      shopify.saveBar.show("save");
      setDiscountOption(discountOption.filter(option => option.id !== id));
    }
  };

  const handleChangeOption = (id, key, value) => {
    shopify.saveBar.show("save");

    setDiscountOption((prevOptions) =>
      prevOptions.map((option) =>
        option.id === id ? { ...option, [key]: value } : option
      )
    );
  };

  const handleRemoveCollection = (id) => {
    shopify.saveBar.show('save');
    setSelectedCollections(selectedCollections.filter((item) => item.id !== id));
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

  const validateForm = () => {
    let errors = {};

    discountOption.forEach((option, index) => {
      if (!option.required_items || option.required_items <= 0) {
        errors[`required_items_${option.id}`] =
          "Each discount option must have at least 1 required item.";
      }

      if (index > 0) {
        const previousValue = discountOption[index - 1]?.required_items || 0;
        if (parseInt(option.required_items, 10) <= parseInt(previousValue, 10)) {
          errors[`required_items_${option.id}`] =
            "The number of required items should be in increasing order.";
        }
      }
    });

    if (!data.bundle_info) errors.bundle_name = "Bundle information is required.";

    if (data.bundle_subtype === "all_product") {

    } else if (data.bundle_subtype === "specific_collection") {
      if (selectedCollections.length === 0) errors.selectedCollections = "Select at least one Collections";
    } else if (data.bundle_subtype === "specific_product") {
      if (selectedProducts.length === 0) errors.selectedProducts = "Select at least one Products.";
    }

    return errors;
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
      const formData = new FormData();

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

      formData.append("bundle_subtype", data.bundle_subtype);
      formData.append("discount_options", JSON.stringify(discountOption));
      formData.append("bundle_name", `Volume discount on ${checkBundleName}`);
      formData.append("discount_label", data.discount_label);
      formData.append("bundle_info", data?.bundle_info);
      formData.append("different_variants", data.different_variants);
      formData.append("theme_variant", data.theme_variant);
      formData.append("start_date", formatDate(selectedDates?.start));
      formData.append("endTime_status", data.endTime_status || "0");
      formData.append("start_time", data.start_time || "00:00");
      formData.append("status", data.status || "Draft");
      formData.append("bundle_type_id", 4);
      formData.append("products", JSON.stringify(selectedProducts));
      formData.append("collections", JSON.stringify(selectedCollections));

      if (data.endTime_status === "1") {
        formData.append("end_date", formatDate(selectedDates.end));
        formData.append("end_time", data.end_time);
      } else {
        formData.append("end_date", null);
        formData.append("end_time", null);
      }

      const url = id
        ? `https://test-app.dotmagicinfotech.in/api/bundles/update/${id}?shop=${shopName}`
        : `https://test-app.dotmagicinfotech.in/api/bundles/create?shop=${shopName}`;

      const result = await fetchWithToken({
        url: url,
        method: 'POST',
        body: formData,
        isFormData: true,
      });

      if (result.status) {
        shopify.loading(false);
        navigate("/bundles");
        shopify.saveBar.hide("save");
        shopify.toast.show(`${id ? "Update" : "Create"} Successful Bundle`);
      } else {
        shopify.loading(false);
        shopify.toast.show(result.message || `Failed to ${id ? "Update" : "Save"} Volume Bundle`, {
          isError: true,
          duration: 8000
        });
      }
    } catch {
      shopify.loading(false);
      shopify.saveBar.hide("save");
    } finally {
      shopify.loading(false);
      shopify.saveBar.hide("save");
    }
  }

  return (
    <>
      {loading ? (
        <PageSkeleton />
      ) : (
        <Page
          title={`${id ? "Update" : "Create"} Volume discount`}
          backAction={{ onAction: () => navigate("/bundles") }}
          primaryAction={
            id ? <Button icon={ViewIcon}
              onClick={() => window.open(`https://${shop}/?id=${id}`, '_blank')}
            >
              Preview
            </Button> : undefined
          }
          secondaryActions={id ? [
            {
              content: "Widget not visible?",
              onAction: toggleWidgetModal,
            },
          ] : []}
        >
          <SaveBar id="save">
            <button variant="primary" onClick={handleSubmit}>Save</button>
            <button variant="breadcrumb" onClick={() => {
              shopify.saveBar.hide('save');
              navigate("/bundles")
            }}></button>
          </SaveBar>

          {errors && <ValidationErrors errors={errors} />}

          <Layout>
            <Layout.Section>
              <BlockStack gap={"300"}>
                <Card>
                  <BlockStack gap="300">
                    <BlockStack>
                      <Text as="span" variant="headingMd">Discounted products</Text>
                      <Text as="span" variant="bodyMd" tone="subdued">Select a specific product, a collection, or all of your products to apply the volume discount.</Text>
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

                {/* Discount options */}
                <Card>
                  <BlockStack gap={"300"}>
                    <BlockStack>
                      <Text as="span" variant="headingMd">Discount options</Text>
                      <Text as={"span"} variant="bodyMd" tone="subdued">Enter the number of items and discount for each option.</Text>
                      <div>
                        {discountOption.map((option, index) => (
                          <div key={option.id}>
                            <div style={{ marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <Text as="span" variant="headingMd">OPTION {index + 1}</Text>
                              {index > 0 && (
                                <Button icon={DeleteIcon} onClick={() => handleRemoveOption(option.id)} />
                              )}
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "10px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Box width="190px">
                                  <TextField
                                    label="Required items"
                                    min={1}
                                    type='number'
                                    value={option.required_items}
                                    onChange={(value) => handleChangeOption(option.id, "required_items", value)}
                                    autoComplete="off"
                                    error={index > 0 && parseInt(option.required_items, 10) <= parseInt(discountOption[index - 1].required_items, 10)}
                                  />
                                </Box>
                                <Box width="190px">
                                  <Select
                                    label="Discount type"
                                    options={discountOptions.map(({ label, id, disabled }) => ({
                                      label,
                                      value: id,
                                      disabled: disabled === "1",
                                    }))}
                                    placeholder="Select Type"
                                    value={option.type}
                                    onChange={(id) => {
                                      const selectedOption = discountOptions.find(option => option.id === id);
                                      if (selectedOption?.disabled === "1") return;
                                      if (selectedOption?.id === "4" || selectedOption?.id === "5") {
                                        handleChangeOption(option.id, "discount_value", "")
                                      }
                                      handleChangeOption(option.id, "type", id)
                                    }}
                                  />
                                </Box>
                                <Box width="190px">
                                  <TextField
                                    label="Value"
                                    min={1}
                                    prefix={option.type === "1" ? "%" : "$"}
                                    type="number"
                                    disabled={["4", "5"].includes(option.type)}
                                    value={option.discount_value}
                                    onChange={(value) => handleChangeOption(option.id, "discount_value", value)}
                                    autoComplete="off"
                                  />
                                </Box>
                              </div>
                              {index > 0 &&
                                parseInt(option.required_items, 10) <= parseInt(discountOption[index - 1].required_items, 10) && (
                                  <InlineError message="The number of required items should be in increasing order." fieldID="myFieldID" />
                                )
                              }
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Box width="190px">
                                  <TextField
                                    label="description"
                                    value={option.description}
                                    onChange={(value) => handleChangeOption(option.id, "description", value)}
                                    autoComplete="off"
                                  />
                                </Box>
                                <Box width="190px">
                                  <TextField
                                    label="Label"
                                    showCharacterCount
                                    maxLength={20}
                                    value={option.Label}
                                    onChange={(value) => handleChangeOption(option.id, "Label", value)}
                                    autoComplete="off"
                                  />
                                </Box>
                                <Box width="190px">
                                  <TextField
                                    label="Badge"
                                    showCharacterCount
                                    maxLength={20}
                                    value={option.Badge}
                                    onChange={(value) => handleChangeOption(option.id, "Badge", value)}
                                    autoComplete="off"
                                  />
                                </Box>
                              </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", margin: "10px 0px" }}>
                              <Checkbox
                                label="Selected by default"
                                checked={option.selected_default === "1"}
                                onChange={(value) => {
                                  if (value) {
                                    discountOption.forEach(opt => {
                                      handleChangeOption(opt.id, "selected_default", "0");
                                    });
                                    handleChangeOption(option.id, "selected_default", "1");
                                  } else {
                                    handleChangeOption(option.id, "selected_default", "0");
                                  }
                                }}
                              />
                              {discountOption.length > 1 && index === discountOption.length - 1 && (
                                <Checkbox
                                  label="Allow users to buy extra items with this discount option"
                                  checked={option.allow_users === "1"}
                                  onChange={(value) => {
                                    handleChangeOption(option.id, "allow_users", value ? "1" : "0");
                                  }}
                                />
                              )}
                            </div>

                            <Divider />
                          </div>
                        ))}
                        <div style={{ marginTop: "10px" }}>
                          <Button icon={PlusIcon} onClick={handleAddOption} disabled={discountOption?.length >= 10}>
                            Add Option
                          </Button>
                        </div>
                      </div>
                    </BlockStack>
                  </BlockStack>
                </Card>

                {/* Bundle information */}
                <Card>
                  <BlockStack gap={"300"}>
                    <BlockStack>
                      <Text as="span" variant="headingMd">Bundle information</Text>
                      <div style={{ marginTop: '10px' }}>
                        <TextField
                          label="Title"
                          placeholder='Enter Bundle Information'
                          value={data?.bundle_info}
                          onChange={(value) => handleChangeValue("bundle_info", value)}
                          maxLength={150}
                          autoComplete="off"
                          showCharacterCount
                        />
                      </div>
                    </BlockStack>
                  </BlockStack>
                </Card>

                {/* Advanced settings */}
                <div style={{ paddingBottom: "10px" }}>
                  <Card>
                    <BlockStack gap="300">
                      <BlockStack align="space-between" gap="200">
                        <Text as="span" variant="headingMd">Advanced settings</Text>
                      </BlockStack>
                      <InlineStack gap="200">

                        <div style={{ display: "flex", flexDirection: "column", marginTop: '10px' }}>
                          <Checkbox
                            label="Let customers choose different variants for each item"
                            checked={data.different_variants === "1"}
                            onChange={(value) => {
                              handleChangeValue("different_variants", value ? "1" : "0");
                              if (value) {
                                handleChangeValue("theme_variant", "0")
                              }
                            }}
                          />
                          {data?.different_variants === "1" &&
                            <Checkbox
                              label="Show theme variant picker"
                              checked={data.theme_variant === "1"}
                              onChange={(value) => handleChangeValue("theme_variant", value ? "1" : "0")}
                            />
                          }
                        </div>
                        {/* Discount */}
                        <div style={{ width: "100%" }}>
                          <Card>
                            <BlockStack gap={"300"}>
                              <BlockStack>
                                <Text as="span" variant="headingMd">Discount</Text>
                              </BlockStack>
                            </BlockStack>
                            <div style={{ width: "100%", margin: "10px 0px" }}>
                              <TextField
                                label="Discount label"
                                value={data.discount_label}
                                onChange={(value) => handleChangeValue("discount_label", value)}
                                autoComplete="off"
                              />
                            </div>
                          </Card>
                        </div>

                        {/* Active dates */}
                        <div style={{ width: "100%" }}>
                          <Card>
                            <BlockStack gap={"300"}>
                              <BlockStack>
                                <Text as="span" variant="headingMd">Active Dates</Text>
                              </BlockStack>
                            </BlockStack>

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
                          </Card>
                        </div>
                      </InlineStack>
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
                    {(data?.bundle_subtype === "specific_product"
                      ? selectedProducts?.length > 0
                      : selectedCollections?.length > 0
                    ) && (
                        <div style={{ maxHeight: '500px', overflowX: "auto", display: "flex", flexDirection: "column", scrollbarWidth: "none" }}>
                          <div style={{ width: "100%" }}>
                            {data?.bundle_info &&
                              <p style={{ margin: '10px 0px 10px', fontSize: "0.8rem", fontWeight: "500", marginBottom: "10px" }}>{data?.bundle_info}</p>
                            }
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                              {discountOption.map((value, index) => (
                                <div key={index}>
                                  <div style={{ border: "2px solid", borderColor: value?.selected_default === "1" ? "black" : "#dbdbdb", borderRadius: "10px", padding: "22px", position: "relative" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}>
                                      <div style={{ display: "flex", alignItems: "center", }}>
                                        <RadioButton
                                          checked={value?.selected_default === "1"}
                                          onChange={() => handleCheckboxFour(index)}
                                        />
                                        <div style={{ marginLeft: "10px", display: "flex", gap: "0.5rem" }}>
                                          <p style={{ fontWeight: "400" }}>
                                            {value?.description}
                                          </p>
                                          {value?.Label &&
                                            <p style={{ backgroundColor: "black", padding: "0px 5px", color: 'white', borderRadius: "10px", fontSize: "10px", maxWidth: "80px", height: "20px" }}>{value?.Label}</p>
                                          }
                                        </div>
                                      </div>
                                      <p style={{ fontWeight: "500", fontSize: "1rem" }}>$77.00</p>
                                    </div>
                                    {value?.Badge &&
                                      <div style={{ backgroundColor: "red", display: "flex", justifyContent: 'center', alignItems: "center", height: "20px", position: "absolute", right: "75px", top: "-2px", padding: '7px', fontSize: "11px", color: "white", borderRadius: "4px", fontWeight: "500" }}>
                                        {value?.Badge}
                                      </div>
                                    }
                                    {selectedOption === index &&
                                      <>
                                        {value?.required_items > 3 &&
                                          <div style={{ marginTop: "10px" }}>
                                            <Divider />
                                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                                              <p>Quantity</p>
                                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                <div style={{ width: "20px", height: "20px", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "black", color: "white", borderRadius: "10px", cursor: "pointer", userSelect: "none" }}>-</div>
                                                {value?.required_items}
                                                <div style={{ width: "20px", height: "20px", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "black", color: "white", borderRadius: "10px", cursor: "pointer", userSelect: "none" }}>+</div>
                                              </div>
                                            </div>
                                          </div>
                                        }
                                      </>
                                    }
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                    <BundlesPreview
                      bundle_type_id="4"
                      modalSize="large"
                      type={data?.bundle_subtype}
                      title={data?.bundle_info}
                      products={selectedProducts}
                      collections={selectedCollections}
                      discountOptions={discountOption}
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

export default BundleVolume