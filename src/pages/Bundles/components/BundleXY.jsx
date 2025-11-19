// React Imports
import { useContext, useEffect, useState } from 'react';

// Shopify Polaris
import { BlockStack, Box, Button, ButtonGroup, Card, Checkbox, Divider, Icon, InlineStack, Layout, Modal, Page, RadioButton, Select, Text, TextField } from '@shopify/polaris';
import { SaveBar } from '@shopify/app-bridge-react';

// Shopify Icons
import { SearchIcon, ViewIcon, XIcon } from '@shopify/polaris-icons';

// Third Party Imports
import ReactQuill from 'react-quill';
import { useNavigate, useParams } from 'react-router-dom';

// Custom Component
import { MetaContext } from '../../../components/MetaDataContext/MetaDataProvider';
import FileUploadDropZone from '../../../components/FileUploadDropZone/FileUploadDropZone';
import ProductSelection from '../../../components/ProductSelection/index';
import ProductSelectOnly from '../../../components/ProductSelection/ProductSelectOnly';
import ValidationErrors from '../../../components/ValidationErrors';
import BundlesPreview from '../BundlesPreview';
import DateTimePicker from '../../../components/DateRangePicker/DateTimePicker';
import YoutubeVideo from '../../../components/YoutubeVideo/YoutubeVideo';
import WidgetModal from '../../../components/WidgetModal/WidgetModal';
import PageSkeleton from '../../../components/PageSkeleton';
import { ShopifyContext } from '../../../components/ShopifyProvider/ShopifyProvider';
import { useFetchWithToken } from '../../../components/FetchDataAPIs/FetchWithToken';
import { getTotalPrice } from '../../../assets/helpers';

const BundleXY = () => {

  // Hooks
  const { discountOptions } = useContext(MetaContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const { shopName } = useContext(ShopifyContext);
  const fetchWithToken = useFetchWithToken();

  // State
  const [data, setData] = useState({
    bundle_description: "",
    bundle_subtype: "specific_product",
    page_type: "new_page",
    discount_value: 10,
    start_time: "12:00 AM",
    end_time: "12:00 PM",
    endTime_status: "0",
    status: "Published",
    discount_label: "Buy X & Get Y Discount",
    discount_option_id: "1"
  });
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [media, setMedia] = useState([]);
  const [displayIncludePage, setDisplayIncludePage] = useState([]);
  const [collectionbuys, setCollectionbuys] = useState([]);
  const [productsbuys, setProductsbuys] = useState([]);
  const [productsgets, setProductsgets] = useState([]);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [widgetModalOpen, setWidgetModalOpen] = useState(false);
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
          url: `https://bundle-wave-backend.xavierapps.com/api/bundles/${id}?shop=${shopName}`,
          method: 'GET',
        });

        const selectedOption = discountOptions.find(option => option.id === data.discount_option_id);
        setMedia(data.media);
        setSelectedDates({
          start: data.start_date ? new Date(data.start_date) : new Date(),
          end: data.end_date ? new Date(data.end_date) : new Date(),
        });

        if (data?.bundle_subtype === "specific_product") {
          setProductsbuys(data?.fixedDeal?.buys)
        } else {
          setCollectionbuys(data?.fixedDeal?.buys)
        }
        setProductsgets(data?.fixedDeal?.gets)

        setData({
          bundle_subtype: data.bundle_subtype,
          page_type: data?.page_type,
          discount_option_id: selectedOption ? selectedOption?.id : "1",
          discount_value: data?.discount_value,
          bundle_name: data?.bundle_name,
          discount_label: data.discount_label,
          bundle_description: data?.bundle_description,
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

  const toggleWidgetModal = () => setWidgetModalOpen(prev => !prev);
  const total = getTotalPrice(productsbuys).toFixed(2);

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

  const toggleVideoModal = () => setVideoModalOpen(prev => !prev);

  const handleRemoveCollection = (id) => {
    shopify.saveBar.show('save');
    setCollectionbuys(collectionbuys.filter((item) => item.id !== id));
  };

  const handleBrowseCollections = async () => {
    try {
      const collection = await shopify.resourcePicker({
        type: "collection",
        multiple: false,
        selectionIds: collectionbuys,
      });

      const collectionData = collection.selection.map((item) => ({
        id: item.id,
        title: item.title,
        image: item.image?.originalSrc || "",
      }));

      setCollectionbuys(collectionData);
      shopify.saveBar.show("save");
    } catch (error) {
      console.error("Error selecting collection:", error);
    }
  };

  const validateForm = () => {
    let errors = {};

    if (!data.bundle_name) errors.bundle_name = "Bundle name is required.";
    if (!["4", "5"].includes(data?.discount_option_id)) {
      const value = Number(data.discount_value);
      if (!value || isNaN(value) || value <= 0) {
        errors.discount_option_id = "Please enter a valid discount amount.";
      }
      if (data.discount_option_id === "1" && value >= 101) {
        errors.discount_option_id = "Discount must be less than 100.";
      }
    }
    if (data.page_type === "product_page" && displayIncludePage?.length === 0) {
      errors.displayIncludePage = "Select product to show your bundle in  include product page.";
    }
    if (data?.bundle_subtype === "specific_product") {
      if (productsbuys.length === 0)
        errors.productsbuys = "Select at least one item in X products.";
    } else if (data?.bundle_subtype === "specific_collection") {
      if (collectionbuys.length === 0)
        errors.collectionbuys = "Select at least one item in Y products.";
    } else if (data?.bundle_subtype === "all_product") {
      if (productsgets.length === 0)
        errors.productsgets = "Select at least one item in Y products.";
    }

    if (productsgets.length === 0)
      errors.productsgets = "Select at least one item in Y products.";

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

      formData.append("bundle_subtype", data?.bundle_subtype);
      formData.append("page_type", data.page_type);
      formData.append("discount_option_id", data.discount_option_id);
      formData.append("discount_value", data.discount_value);
      formData.append("bundle_name", data.bundle_name);
      formData.append("discount_label", data.discount_label);
      formData.append("bundle_description", data.bundle_description || "");
      formData.append("start_date", formatDate(selectedDates?.start));
      formData.append("start_time", data.start_time || "00:00");
      formData.append("status", data.status || "Draft");
      formData.append("bundle_type_id", 3);
      formData.append("endTime_status", data.endTime_status || "0");
      formData.append("old_media", JSON.stringify(media || []));

      formData.append("fixedDeal", JSON.stringify({
        buys: data?.bundle_subtype === "specific_product" ? productsbuys : data?.bundle_subtype === "specific_collection" ? collectionbuys : [],
        gets: productsgets || []
      }));

      if (files?.length > 0) {
        files.forEach((file) => formData.append("media[]", file));
      }

      if (data.page_type === "product_page") {
        formData.append("includePageId", JSON.stringify(displayIncludePage));
      } else {
        formData.append("includePageId", JSON.stringify([]));
      }

      if (data.endTime_status === "1") {
        formData.append("end_date", formatDate(selectedDates.end));
        formData.append("end_time", data.end_time);
      } else {
        formData.append("end_date", null);
        formData.append("end_time", null);
      }

      const url = id
        ? `https://bundle-wave-backend.xavierapps.com/api/bundles/update/${id}?shop=${shopName}`
        : `https://bundle-wave-backend.xavierapps.com/api/bundles/create?shop=${shopName}`;

      const result = await fetchWithToken({
        url: url,
        method: 'POST',
        body: formData,
        isFormData: true,
      });

      if (result.status) {
        shopify.loading(false);
        // navigate("/bundles");
        shopify.toast.show(`${id ? "Update" : "Create"} Successful Bundle`);
      } else {
        shopify.loading(false);
        if (result.error_type === "all_product") {
          setErrors({ all_product: `Only one "All Product" bundle is allowed per shop.` });
        } else {
          shopify.toast.show(result.message || `Failed to ${id ? "Update" : "Save"} Buy X Get Y Bundle`, {
            isError: true,
            duration: 8000
          });
        }
      }
    } catch {
      shopify.loading(false);
      shopify.toast.show(`Failed to ${id ? "Update" : "Save"} Bundle`);
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
          title={`${id ? "Update" : "Create"} Buy X Get Y`}
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

          <div style={{ marginBottom: "10px" }}>
            <ButtonGroup variant='segmented'>
              <Button variant={data?.page_type === "new_page" ? "primary" : "secondary"} onClick={() => handleChangeValue("page_type", "new_page")}>Create New Page</Button>
              <Button variant={data?.page_type === "product_page" ? "primary" : "secondary"} onClick={() => handleChangeValue("page_type", "product_page")}>Included Product Page</Button>
            </ButtonGroup>
          </div>

          <Layout>
            <Layout.Section>
              <BlockStack gap={"300"}>
                <Card>
                  <BlockStack gap="300">
                    <BlockStack>
                      <Text as="span" variant="headingMd">Customer buys (X)</Text>
                      <Text as="span" variant="bodyMd" tone="subdued">The offer is triggered for...</Text>
                    </BlockStack>
                    <InlineStack gap="200">
                      <div style={{ display: "flex", flexDirection: "column", width: '100%' }}>
                        <RadioButton
                          label="All products"
                          checked={data.bundle_subtype === 'all_product'}
                          id="all_product"
                          onChange={() => {
                            handleChangeValue("bundle_subtype", "all_product");
                            setProductsbuys([]);
                            setCollectionbuys([]);
                          }}
                        />
                        <RadioButton
                          label="Products in a specific collection"
                          id="specific_collection"
                          checked={data.bundle_subtype === 'specific_collection'}
                          onChange={() => {
                            handleChangeValue("bundle_subtype", "specific_collection");
                            setProductsbuys([]);
                          }}
                        />
                        <RadioButton
                          label="A specific product"
                          id="specific_product"
                          checked={data.bundle_subtype === 'specific_product'}
                          onChange={() => {
                            handleChangeValue("bundle_subtype", "specific_product");
                            setCollectionbuys([]);
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
                              {collectionbuys?.map((v, i) =>
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
                            selectedProducts={productsbuys}
                            setSelectedProducts={setProductsbuys}
                          />
                        }
                      </div>
                    </InlineStack>
                  </BlockStack>
                </Card>

                <BlockStack gap={"300"}>
                  <Card>
                    <ProductSelection
                      title="Customer gets (Y)"
                      subtitle="Choose products that the customer gets with a discount or for free."
                      selectedProducts={productsgets}
                      setSelectedProducts={setProductsgets}
                    />
                  </Card>
                </BlockStack>

                {data?.page_type === "product_page" &&
                  <Card>
                    <ProductSelectOnly
                      title="Display Bundle On Selected Products"
                      subtitle="Select the products where this bundle should be displayed on the product page."
                      selectedProducts={displayIncludePage}
                      setSelectedProducts={setDisplayIncludePage}
                    />
                  </Card>
                }

                {/* Discount */}
                <Card>
                  <BlockStack gap="300">
                    <BlockStack align="space-between" gap="200">
                      <Text as="span" variant="headingMd">Discount</Text>
                      <Text as="span" variant="bodyMd" tone="subdued">Add a discount for the bundle</Text>
                    </BlockStack>
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

                {/* Bundle details */}
                <Card>
                  <BlockStack gap={"300"}>
                    <BlockStack>
                      <Text as="span" variant="headingMd">Bundle details</Text>
                    </BlockStack>
                    <BlockStack gap={'300'}>
                      <TextField
                        label="Title"
                        value={data.bundle_name}
                        onChange={(value) => handleChangeValue("bundle_name", value)}
                        maxLength={255}
                        autoComplete="off"
                        showCharacterCount
                      />

                      <div>
                        <Text>Product description</Text>
                        <ReactQuill
                          theme="snow"
                          value={data.bundle_description}
                          onChange={(value) =>
                            handleChangeValue("bundle_description", value || "")
                          }
                          placeholder="Write something..."
                          style={{ height: "120px" }}
                        />
                      </div>

                      <div style={{ marginTop: "2.5rem" }}>
                        <FileUploadDropZone media={media} setMedia={setMedia} files={files} setFiles={setFiles} />
                      </div>
                    </BlockStack>
                  </BlockStack>
                </Card>

                <div style={{ paddingBottom: "10px" }}>
                  <Card>
                    <BlockStack gap="300">
                      <BlockStack align="space-between" gap="200">
                        <Text as="span" variant="headingMd">Advanced settings</Text>
                      </BlockStack>
                      <InlineStack gap="200">
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
            <Layout.Section variant='oneThird'>
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
                    {(
                      (data?.bundle_subtype === "specific_product" && productsbuys?.length > 0 && productsgets?.length > 0) ||
                      (data?.bundle_subtype !== "specific_product" && collectionbuys?.length > 0 && productsgets?.length > 0)
                    ) && (
                        <div style={{ maxHeight: '500px', overflowX: "auto", display: "flex", flexDirection: "column", scrollbarWidth: "none" }}>
                          <div style={{ width: "100%" }}>
                            {data?.bundle_subtype === "specific_product" ? (
                              <img
                                src={files[0] instanceof File ? URL.createObjectURL(files[0]) : files[0] || productsbuys?.[0]?.image}
                                style={{ width: "100%", height: "247px", objectFit: "cover" }}
                              />
                            ) : (
                              <img
                                src={files[0] instanceof File ? URL.createObjectURL(files[0]) : files[0] || collectionbuys?.[0]?.image}
                                style={{ width: "100%", height: "247px", objectFit: "cover" }}
                              />
                            )}
                          </div>
                          <div style={{ width: "100%", display: "flex", flexDirection: "column", marginTop: "10px", gap: "10px" }}>
                            {data?.bundle_name &&
                              <p style={{ fontSize: "1.5rem", fontWeight: "500", marginBottom: "10px", lineHeight: "1" }}>{data?.bundle_name}</p>
                            }
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <p style={{ fontSize: "20px", fontWeight: "500" }}>Total Price</p>
                              <div style={{ display: "flex", alignItems: 'center', gap: "10px" }}>
                                <p style={{ fontSize: "20px", fontWeight: "600" }}>${total}</p>
                              </div>
                            </div>

                            <Divider borderColor="border-hover" />

                            <div style={{ border: "1px solid #7a26bf", borderRadius: "10px", display: "flex", flexDirection: "column", marginBottom: "-6px" }}>
                              {(data?.bundle_subtype === "specific_product" ? productsbuys : collectionbuys)?.map((value, index) => (
                                <div key={index}>
                                  <div style={{ padding: "12px 10px" }}>
                                    <div style={{ display: "flex" }}>
                                      <img src={value?.image} width="60px" height="60px" />
                                      <div style={{ marginLeft: "10px" }}>
                                        <p style={{ fontSize: "15px", fontWeight: "500" }}>{value?.title}</p>
                                        <p style={{ fontSize: "15px", marginTop: '10px', fontWeight: "500" }}>{value?.variants?.[0]?.price ? `$${value?.variants?.[0]?.price}` : ""}</p>
                                      </div>
                                    </div>
                                    {value?.variants?.length > 1 &&
                                      <select disabled style={{ width: "100%", height: "36px", backgroundColor: "#fafafa", borderRadius: "8px", marginTop: "10px" }}>
                                        <option selected>
                                          Variants
                                        </option>
                                      </select>
                                    }
                                  </div>

                                  {index !== (data?.bundle_subtype === "specific_product" ? productsbuys : collectionbuys).length - 1 && (
                                    <hr style={{ margin: "0px 10px" }} />
                                  )}
                                </div>
                              ))}
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", margin: "-15px 0px" }}>
                              <button disabled style={{ backgroundColor: "rgb(122, 38, 191)", border: "none", color: "rgb(255, 255, 255)", cursor: "pointer", width: "40px", height: "40px", borderRadius: "50%", padding: "8px 8px 16px", fontWeight: 500, fontSize: "33px", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1 }}>+</button>
                            </div>
                            <div style={{ border: "1px solid #7a26bf", borderRadius: "10px", display: "flex", flexDirection: "column", marginTop: "-6px", position: "relative", overflow: "hidden" }}>
                              {productsgets.map((value, index) => (
                                <div key={index} style={{ position: "relative" }}>
                                  <div style={{ padding: "12px 10px" }}>
                                    <div style={{ display: "flex" }}>
                                      <img src={value?.image} width="60px" height="60px" />
                                      <div style={{ marginLeft: "10px" }}>
                                        <p style={{ fontSize: "15px", fontWeight: "500" }}>{value?.title}</p>
                                        <p style={{ fontSize: "15px", marginTop: '5px', fontWeight: "500" }}>$50.00</p>
                                      </div>
                                    </div>
                                    {value?.variants?.length > 1 &&
                                      <select disabled style={{ width: "100%", height: "36px", backgroundColor: "#fafafa", borderRadius: "8px", marginTop: "10px" }}>
                                        <option selected>
                                          Variants
                                        </option>
                                      </select>
                                    }
                                  </div>

                                  {index === 0 && (
                                    <div style={{
                                      position: 'absolute', top: "10px", right: "-19px", width: "95px", height: "23px", transform: "rotate(39deg)", backgroundColor: "rgb(122, 38, 191)", color: "white", padding: "10px", fontWeight: "500", display: "flex", justifyContent: "center", alignItems: "center"
                                    }}>
                                      {data?.discount_value === "100" ? "FREE" : `${data?.discount_value}% OFF`}
                                    </div>
                                  )}

                                  {index !== productsgets.length - 1 && (
                                    <hr style={{ margin: "0px 10px" }} />
                                  )}
                                </div>
                              ))}
                            </div>
                            <div style={{ fontSize: "15px", fontWeight: "500" }} dangerouslySetInnerHTML={{ __html: data?.bundle_description || "" }} />
                          </div>
                        </div>
                      )}

                    <BundlesPreview
                      bundle_type_id="3"
                      type={data?.bundle_subtype}
                      modalSize="large"
                      buysX={data?.bundle_subtype === "specific_product" ? productsbuys : collectionbuys}
                      getY={productsgets}
                      title={data?.bundle_name}
                      data={data}
                      total={total}
                      media={media}
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

export default BundleXY