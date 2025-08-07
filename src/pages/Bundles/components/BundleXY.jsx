// React Imports
import { useContext, useEffect, useState } from 'react';

// Shopify Polaris
import { BlockStack, Box, Button, ButtonGroup, Card, Checkbox, Divider, InlineStack, Layout, LegacyStack, Modal, Page, RadioButton, Select, Text, TextField } from '@shopify/polaris';
import { SaveBar } from '@shopify/app-bridge-react';

// Shopify Icons
import { ChevronDownIcon, ChevronRightIcon, ViewIcon } from '@shopify/polaris-icons';

// Third Party Imports
import ReactQuill from 'react-quill';
import { useNavigate, useParams } from 'react-router-dom';

// Custom Component
import { MetaContext } from '../../../components/MetaDataContext/MetaDataProvider';
import FileUploadDropZone from '../../../components/FileUploadDropZone/FileUploadDropZone';
import ProductSelection from '../../../components/ProductSelection/index';
import ProductWithCollections from '../../../components/ProductWithCollections/ProductWithCollections';
import ValidationErrors from '../../../components/ValidationErrors';
import BundlesPreview from '../BundlesPreview';
import DateTimePicker from '../../../components/DateRangePicker/DateTimePicker';
import YoutubeVideo from '../../../components/YoutubeVideo/YoutubeVideo';
import WidgetModal from '../../../components/WidgetModal/WidgetModal';
import PageSkeleton from '../../../components/PageSkeleton';
import { ShopifyContext } from '../../../components/ShopifyProvider/ShopifyProvider';
import { useFetchWithToken } from '../../../components/FetchDataAPIs/FetchWithToken';

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
    bundle_subtype: "fixedDeal",
    page_type: "new_page",
    discount_value: 10,
    start_time: "12:00 AM",
    end_time: "12:00 PM",
    endTime_status: "0",
    status: "Published",
    discount_label: "Buy X & Get Y Discount",
    discount_option_id: "1"
  })
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [media, setMedia] = useState([]);
  const [productsbuys, setProductsbuys] = useState([]);
  const [productsgets, setProductsgets] = useState([]);
  const [sectionsBuys, setSectionsBuys] = useState([]);
  const [selectedFirst, setSelectedFirst] = useState(null);
  const [selectedSecond, setSelectedSecond] = useState(null);
  const [sections, setSections] = useState([]);
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
          url: `https://test-app.dotmagicinfotech.in/api/bundles/${id}?shop=${shopName}`,
          method: 'GET',
        });

        const selectedOption = discountOptions.find(option => option.id === data.discount_option_id);
        setMedia(data.media);
        setSelectedDates({
          start: data.start_date ? new Date(data.start_date) : new Date(),
          end: data.end_date ? new Date(data.end_date) : new Date(),
        });

        setProductsbuys(data?.fixedDeal?.buys)
        setProductsgets(data?.fixedDeal?.gets)
        setSectionsBuys(data?.mixmatchDeal?.buys)
        setSections(data?.mixmatchDeal?.gets)

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

  const validateForm = () => {
    let errors = {};

    if (!data.bundle_name) errors.bundle_name = "Bundle name is required.";
    if (data.bundle_subtype === "fixedDeal") {
      if (!["4", "5"].includes(data?.discount_option_id) && (!data.discount_value || isNaN(data.discount_value) || data.discount_value <= 0)) {
        errors.discount_option_id = "Please enter a valid discount amount.";
      }
      if (productsbuys.length === 0) errors.productsbuys = "Select at least one item in X products.";
      if (productsgets.length === 0) errors.productsgets = "Select at least one item in Y products.";
    } else if (data.bundle_subtype === "mixmatchDeal") {
      if (sectionsBuys.length === 0) errors.sectionsBuys = "Select at least one item in X products.";
      if (sections.length === 0) errors.sections = "Select at least one item in Y products.";
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

      formData.append("bundle_subtype", data.bundle_subtype);
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
        buys: productsbuys || [],
        gets: productsgets || []
      }));

      const sectionsToSend = sectionsBuys.map((section, index) => {
        const { sectionImage, ...rest } = section;
        return rest;
      });
      const sectionsToSendGets = sections.map((section, index) => {
        const { sectionImage, ...rest } = section;
        return rest;
      });

      formData.append("mixmatchDeal", JSON.stringify({
        buys: sectionsToSend || [],
        gets: sectionsToSendGets || []
      }));

      sectionsBuys.forEach((section, index) => {
        const images = Array.isArray(section.sectionImage)
          ? section.sectionImage
          : section.sectionImage
            ? [section.sectionImage]
            : [];

        images.forEach((file) => {
          formData.append(`section_images_buys[${index}]`, file);
        });
      });

      sections.forEach((section, index) => {
        const images = Array.isArray(section.sectionImage)
          ? section.sectionImage
          : section.sectionImage
            ? [section.sectionImage]
            : [];

        images.forEach((file) => {
          formData.append(`section_images_gets[${index}]`, file);
        });
      });

      if (files?.length > 0) {
        files.forEach((file) => formData.append("media[]", file));
      }

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
        shopify.toast.show(`${id ? "Update" : "Create"} Successful Bundle`);
      } else {
        shopify.loading(false);
        shopify.toast.show(result.message || `Failed to ${id ? "Update" : "Save"} Buy X Get Y Bundle`, {
          isError: true,
          duration: 8000
        });
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
                  <LegacyStack vertical>
                    <RadioButton
                      label="Fixed deal"
                      helpText="Buy Product(s) X to get Product(s) Y for free or at a discount"
                      checked={data.bundle_subtype === 'fixedDeal'}
                      id="disabled"
                      name="fixedDeal"
                      onChange={() => {
                        handleChangeValue("bundle_subtype", "fixedDeal");
                        setSectionsBuys([]);
                        setSections([]);
                      }}
                    />
                    <RadioButton
                      label="Mix and match deal"
                      helpText="Buy from Section(s) X to get free or discounted item(s) from Section(s) Y"
                      id="optional"
                      name="mixmatchDeal"
                      checked={data.bundle_subtype === 'mixmatchDeal'}
                      onChange={() => {
                        handleChangeValue("bundle_subtype", "mixmatchDeal");
                        setProductsbuys([]);
                        setProductsgets([]);
                      }}
                    />
                  </LegacyStack>
                </Card>

                <BlockStack gap={"300"}>
                  {/* Customer buys (Buy X) and Customer gets (Get Y) Fixed deal*/}
                  {data?.bundle_subtype === "fixedDeal" &&
                    <div>
                      <Card>
                        <ProductSelection
                          title="Customer buys (Buy X)"
                          subtitle="Choose products that the customer buys."
                          selectedProducts={productsbuys}
                          setSelectedProducts={setProductsbuys}
                        />

                        <div style={{ margin: "10px 0px" }}>
                          <Divider borderWidth='025' borderColor='input-border' />
                        </div>

                        <ProductSelection
                          title="Customer gets (Get Y)"
                          subtitle="Choose products that the customer gets with a discount or for free."
                          selectedProducts={productsgets}
                          setSelectedProducts={setProductsgets}
                        />
                      </Card>
                    </div>
                  }

                  {/* Customer buys (Buy X) and Customer gets (Get Y) Mix and match deal */}
                  {data?.bundle_subtype === "mixmatchDeal" &&
                    <div>
                      <Card>
                        <BlockStack align="space-between" gap={"200"}>
                          <Text as={"span"} variant="headingMd">Customer buys (Buy X)</Text>
                          <Text as={"span"} variant="bodyMd" tone="subdued">Add sections that the customer buys from.</Text>
                          <ProductWithCollections
                            sections={sectionsBuys}
                            setSections={setSectionsBuys}
                          />
                        </BlockStack>

                        <div style={{ margin: "10px 0px" }}>
                          <Divider borderWidth='025' borderColor='input-border' />
                        </div>

                        <BlockStack align="space-between" gap={"200"}>
                          <Text as={"span"} variant="headingMd">Customer gets (Get Y)</Text>
                          <Text as={"span"} variant="bodyMd" tone="subdued">Add sections that the customer gets from with a discount or for free.</Text>
                          <ProductWithCollections
                            sections={sections}
                            setSections={setSections}
                          />
                        </BlockStack>
                      </Card>
                    </div>
                  }
                </BlockStack>

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
                      (productsbuys?.length > 0 && productsgets?.length > 0) ||
                      (sectionsBuys?.length > 0 && sections?.length > 0)
                    ) && (
                        <div style={{ maxHeight: '500px', overflowX: "auto", display: "flex", flexDirection: "column", scrollbarWidth: "none" }}>
                          {files.length > 0 &&
                            <div style={{ width: "100%" }}>
                              <img
                                src={files[0] instanceof File ? URL.createObjectURL(files[0]) : files[0]}
                                style={{ width: "100%", height: "247px", objectFit: "cover" }}
                              />
                            </div>
                          }
                          <div style={{ width: "100%" }}>
                            {data?.bundle_name &&
                              <p style={{ fontSize: "1rem", fontWeight: "500", marginBottom: "10px", lineHeight: "2rem" }}>{data?.bundle_name}</p>
                            }
                            <div
                              style={{ fontSize: "15px", fontWeight: "500" }}
                              dangerouslySetInnerHTML={{ __html: data?.bundle_description || "" }}
                            />
                            <p style={{ marginTop: '10px', fontSize: "1rem", fontWeight: "400", marginBottom: "15px" }}>$559.00 <span style={{ textDecoration: "line-through", marginLeft: "5px" }}>$1199.11</span></p>

                            {data?.bundle_subtype === "fixedDeal" && (
                              <>
                                <div style={{ border: "1px solid gray", borderRadius: "10px", display: "flex", flexDirection: "column", marginBottom: "-6px" }}>
                                  {productsbuys.map((value, index) => (
                                    <div key={index}>
                                      <div style={{ padding: "15px 10px" }}>
                                        <div style={{ display: "flex" }}>
                                          <img src={value?.image} style={{ width: "60px", height: "60px", objectFit: "fill", borderRadius: "10px" }} />
                                          <div style={{ marginLeft: "10px" }}>
                                            <p>{value?.title}</p>
                                            <p style={{ marginTop: '5px', fontWeight: "500" }}>$50.00</p>
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
                                      <div style={{ margin: "0px 10px" }}>
                                        <Divider />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                  <button style={{
                                    backgroundColor: "#262626", color: "white", cursor: "pointer", width: "45px", height: "45px", borderRadius: "50%", padding: "8px 8px 13px",
                                    fontWeight: "500", fontSize: "30px", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1
                                  }}>+</button>
                                </div>
                                <div style={{ border: "1px solid gray", borderRadius: "10px", display: "flex", flexDirection: "column", marginTop: "-6px", position: "relative", overflow: "hidden" }}>
                                  {productsgets.map((value, index) => (
                                    <div key={index} style={{ position: "relative" }}>
                                      <div style={{ padding: "15px 10px" }}>
                                        <div style={{ display: "flex" }}>
                                          <img src={value?.image} style={{ width: "60px", height: "60px", objectFit: "fill", borderRadius: "10px" }} />
                                          <div style={{ marginLeft: "10px" }}>
                                            <p>{value?.title}</p>
                                            <p style={{ marginTop: '5px', fontWeight: "500" }}>$50.00</p>
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
                                          position: 'absolute',
                                          top: "6px",
                                          right: "-16px",
                                          width: "95px",
                                          height: "23px",
                                          transform: "rotate(36deg)",
                                          backgroundColor: "red",
                                          color: "white",
                                          padding: "10px",
                                          fontWeight: "500",
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center"
                                        }}>
                                          {data?.discount_value === "100" ? "FREE" : `${data?.discount_value}% OFF`}
                                        </div>
                                      )}

                                      <div style={{ margin: "0px 10px" }}>
                                        <Divider />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                            {data?.bundle_subtype === "mixmatchDeal" && (
                              <>
                                <div style={{ border: "1px solid gray", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "-6px" }}>
                                  {sectionsBuys.map((value, index) => (
                                    <div key={index}>
                                      <div style={{ display: "flex", padding: "8px 6px" }}>
                                        <div style={{ cursor: "pointer", display: 'flex' }}>
                                          {selectedFirst === null ?
                                            <Button icon={ChevronRightIcon} variant="plain" onClick={() => setSelectedFirst(index)}></Button>
                                            :
                                            <Button icon={ChevronDownIcon} variant="plain" onClick={() => setSelectedFirst(null)}></Button>
                                          }
                                        </div>
                                        {value?.collection?.length > 0 &&
                                          <img src={value?.collection?.length > 0 ? value?.collection[0]?.image : value?.products[0]?.image ? value?.media?.[0] : value?.media?.[0]} style={{ width: "60px", height: "60px", marginLeft: "10px", objectFit: "fill", borderRadius: "10px" }} />
                                        }
                                        {value?.products?.length > 0 &&
                                          <img src={value?.products[0]?.image || value?.media[0]} style={{ width: "60px", height: "60px", marginLeft: "10px", objectFit: "fill", borderRadius: "10px" }} />
                                        }
                                        <div style={{ marginLeft: "10px" }}>
                                          <p>{value?.sectionTitle || value?.collection[0]?.title}</p>
                                          <p style={{ marginTop: '5px', fontWeight: "500" }}>$50.00</p>
                                        </div>
                                      </div>
                                      <div style={{ margin: "0px 10px" }}>
                                        <Divider />
                                      </div>
                                      {selectedFirst === index &&
                                        <div style={{ padding: "15px 10px" }}>
                                          {value?.products?.length > 0 ? (
                                            value.products.map((product, index) => (
                                              <div key={index}>
                                                <div style={{ display: "flex", padding: "15px 10px" }}>
                                                  <img
                                                    src={product?.image}
                                                    alt={product?.title}
                                                    style={{ width: "60px", height: "60px", borderRadius: "10px", marginLeft: "10px", objectFit: "fill" }}
                                                  />
                                                  <div style={{ marginLeft: "10px" }}>
                                                    <p>{product?.title}</p>
                                                    <p style={{ marginTop: '5px', fontWeight: "500" }}>$50.00</p>
                                                  </div>
                                                </div>
                                              </div>
                                            ))
                                          ) : value.collection.map((collection, index) => (
                                            <div key={index}>
                                              <div style={{ display: "flex", padding: "15px 10px" }}>
                                                <img
                                                  src={collection?.image}
                                                  alt={collection?.title}
                                                  style={{ width: "60px", height: "60px", borderRadius: "10px", marginLeft: "10px", objectFit: "fill" }}
                                                />
                                                <div style={{ marginLeft: "10px" }}>
                                                  <p>{collection?.title}</p>
                                                  <p style={{ marginTop: '5px', fontWeight: "500" }}>$50.00</p>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      }
                                      {index !== sectionsBuys.length - 1 && (
                                        <div style={{ margin: "0px -10px" }}>
                                          <Divider />
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                  <button disabled style={{
                                    backgroundColor: "#262626", color: "white", cursor: "pointer", width: "45px", height: "45px", borderRadius: "50%", padding: "8px",
                                    fontWeight: "500", fontSize: "30px", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1, paddingBottom: "12px"
                                  }}>+</button>
                                </div>
                                <div style={{ border: "1px solid gray", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "-6px" }}>
                                  {sections.map((value, index) => (
                                    <div key={index}>
                                      <div style={{ display: "flex", padding: "8px 6px", position: "relative", overflow: "hidden" }}>
                                        <div style={{ cursor: "pointer", display: 'flex' }}>
                                          {selectedSecond === null ?
                                            <Button icon={ChevronRightIcon} variant="plain" onClick={() => setSelectedSecond(index)}></Button>
                                            :
                                            <Button icon={ChevronDownIcon} variant="plain" onClick={() => setSelectedSecond(null)}></Button>
                                          }
                                        </div>
                                        {value?.collection?.length > 0 &&
                                          <img src={value?.collection?.length > 0 ? value?.collection[0]?.image : value?.products[0]?.image ? value?.media?.[0] : value?.media?.[0]} style={{ width: "60px", height: "60px", marginLeft: "10px", objectFit: "fill", borderRadius: "10px" }} />
                                        }
                                        {value?.products?.length > 0 &&
                                          <img src={value?.products[0]?.image || value?.media[0]} style={{ width: "60px", height: "60px", marginLeft: "10px", objectFit: "fill", borderRadius: "10px" }} />
                                        }
                                        <div style={{ marginLeft: "10px" }}>
                                          <p>{value?.sectionTitle || value?.collection[0]?.title}</p>
                                          <p style={{ marginTop: '5px', fontWeight: "500" }}>$50.00</p>
                                        </div>

                                        {index === 0 && (
                                          <div style={{
                                            position: 'absolute', top: "6px", right: "-16px", width: "95px", height: "23px", transform: "rotate(36deg)", backgroundColor: "red", color: "white", padding: "10px", fontWeight: "500", display: "flex", justifyContent: "center", alignItems: "center"
                                          }}>
                                            10% Off
                                          </div>
                                        )}
                                      </div>
                                      <div style={{ margin: "0px 10px" }}>
                                        <Divider />
                                      </div>
                                      {selectedSecond === index &&
                                        <div style={{ padding: "15px 10px" }}>
                                          {value?.products?.length > 0 ? (
                                            value.products.map((product, index) => (
                                              <div key={index}>
                                                <div style={{ display: "flex", padding: "15px 10px" }}>
                                                  <img
                                                    src={product?.image}
                                                    alt={product?.title}
                                                    style={{ width: "60px", height: "60px", borderRadius: "10px", marginLeft: "10px", objectFit: "fill" }}
                                                  />
                                                  <div style={{ marginLeft: "10px" }}>
                                                    <p>{product?.title}</p>
                                                    <p style={{ marginTop: '5px', fontWeight: "500" }}>$50.00</p>
                                                  </div>
                                                </div>
                                              </div>
                                            ))
                                          ) : value.collection.map((collection, index) => (
                                            <div key={index}>
                                              <div style={{ display: "flex", padding: "15px 10px" }}>
                                                <img
                                                  src={collection?.image}
                                                  alt={collection?.title}
                                                  style={{ width: "60px", height: "60px", borderRadius: "10px", marginLeft: "10px", objectFit: "fill" }}
                                                />
                                                <div style={{ marginLeft: "10px" }}>
                                                  <p>{collection?.title}</p>
                                                  <p style={{ marginTop: '5px', fontWeight: "500" }}>$50.00</p>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      }

                                      {index !== sections.length - 1 && (
                                        <div style={{ margin: "0px -10px" }}>
                                          <Divider />
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                <div style={{ backgroundColor: "#e9e9e9", borderRadius: "10px", display: "flex", justifyContent: "space-between", marginTop: "10px", alignItems: "center", padding: "10px" }}>
                                  <p style={{ fontSize: '1rem', fontWeight: "500" }}>$0.00</p>
                                  <p style={{ fontSize: '1rem', color: "gray" }}>No items added</p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                    <BundlesPreview
                      bundle_type_id="3"
                      type={data?.bundle_subtype}
                      modalSize="large"
                      buysX={data?.bundle_subtype === "fixedDeal" ? productsbuys : sectionsBuys}
                      getY={data?.bundle_subtype === "fixedDeal" ? productsgets : sections}
                      title={data?.bundle_name}
                      data={data}
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