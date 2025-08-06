// React Imports
import { useContext, useEffect, useState } from 'react'

// Third Party Imports
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Shopify Polaris Imports
import { BlockStack, Box, Card, InlineStack, Layout, Page, Text, Checkbox, Icon, Button, Select, TextField, Collapsible, Modal, Divider, LegacyCard, ButtonGroup } from "@shopify/polaris";
import { SaveBar, useAppBridge } from '@shopify/app-bridge-react';

// Shopify Polaris Icons
import { ChevronUpIcon, ChevronDownIcon, ViewIcon, } from '@shopify/polaris-icons';

// Custom Components
import BundlesPreview from '../BundlesPreview';
import { MetaContext } from '../../../components/MetaDataContext/MetaDataProvider';
import FileUploadDropZone from '../../../components/FileUploadDropZone/FileUploadDropZone';
import ProductSelection from '../../../components/ProductSelection';
import ValidationErrors from '../../../components/ValidationErrors';
import DateTimePicker from '../../../components/DateRangePicker/DateTimePicker';
import YoutubeVideo from '../../../components/YoutubeVideo/YoutubeVideo';
import WidgetModal from '../../../components/WidgetModal/WidgetModal';
import PageSkeleton from '../../../components/PageSkeleton';
import { ShopifyContext } from '../../../components/ShopifyProvider/ShopifyProvider';
import { useFetchWithToken } from '../../../components/FetchDataAPIs/FetchWithToken';

const BundleFixed = () => {
  // Hooks
  const { id } = useParams();
  const { discountOptions } = useContext(MetaContext);
  const shopify = useAppBridge();
  const { shopName } = useContext(ShopifyContext);
  const navigate = useNavigate();
  const fetchWithToken = useFetchWithToken();

  // State
  const [data, setData] = useState({
    bundle_description: "",
    start_time: "12:00 AM",
    end_time: "12:00 PM",
    status: "Published",
    discount_option_id: "1",
    discount_value: "10",
    page_type: "new_page",
    discount_label: "Fixed Discount"
  });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [files, setFiles] = useState([]);
  const [media, setMedia] = useState([]);
  const [openProduct, setOpenProduct] = useState(false);
  const [errors, setErrors] = useState({});
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
  }, []);

  useEffect(() => {
    const fetchBundleDetails = async () => {
      try {
        const data = await fetchWithToken({
          url: `https://test-app.dotmagicinfotech.in/api/bundles/${id}?shop=${shopName}`,
          method: 'GET',
        });

        const selectedOption = discountOptions.find(option => option.id === data.discount_option_id);
        const productData = data.products.map((v) => ({
          id: v.id,
          variants: v.variants,
          title: v.title,
          image: v.image,
          hasOnlyDefaultVariant: v.hasOnlyDefaultVariant,
          product_count: v.product_count
        }));

        setMedia(data.media);
        setSelectedDates({
          start: data.start_date ? new Date(data.start_date) : new Date(),
          end: data.end_date ? new Date(data.end_date) : new Date(),
        });

        setSelectedProducts(productData);

        setData({
          page_type: data?.page_type,
          discount_option_id: selectedOption ? selectedOption.id : "",
          discount_value: data.discount_value || "",
          status: data.status || "Draft",
          bundle_name: data.bundle_name || "",
          discount_label: data.discount_label || "",
          bundle_description: data.bundle_description || "",
          endTime_status: data.endTime_status,
          startDate: data.start_date ? new Date(data.start_date) : null,
          start_time: data.start_time || "1:00 AM",
          endDate: data.end_date ? new Date(data.end_date) : null,
          end_time: data.end_time || "1:00 AM",
        });
      } catch (error) {
        console.error("Failed to fetch bundle details:", error);
      }
    };

    if (id) {
      fetchBundleDetails();
    }
  }, [id]);

  const handleToggleProduct = (() => setOpenProduct((open) => !open));
  const toggleVideoModal = () => setVideoModalOpen(prev => !prev);
  const toggleWidgetModal = () => setWidgetModalOpen(prev => !prev);

  const handleDateChange = (value) => {
    setSelectedDates((prev) => ({
      ...prev,
      start: value.start ? new Date(value.start) : prev.start,
    }));
  };

  const handleEndDateChange = (value) => {
    setSelectedDates((prev) => ({
      ...prev,
      end: value.end ? new Date(value.end) : prev.end,
    }));
    shopify.saveBar.show('save');
  };

  const handleChangeValue = (key, value) => {
    shopify.saveBar.show('save');
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!["4", "5"].includes(data?.discount_option_id) && (!data.discount_value || isNaN(data.discount_value) || data.discount_value <= 0)) {
      newErrors.discount_option_id = "Please enter a valid discount amount.";
    }
    if (!data.bundle_name) newErrors.bundle_name = "Bundle name is required.";
    if (!selectedDates?.start) newErrors.startDate = "Start date is required.";
    if (!data.start_time) newErrors.start_time = "Start time is required.";
    if (!selectedProducts || selectedProducts?.length < 2) newErrors.selectedProducts = "Minimum two products are required.";

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
      const formData = new FormData();
      const formatDate = (date) =>
        new Date(date.getTime() - date.getTimezoneOffset() * 60000)
          .toISOString()
          .split("T")[0];

      formData.append("page_type", data.page_type);
      formData.append("products", JSON.stringify(selectedProducts));
      formData.append("discount_option_id", data.discount_option_id);
      formData.append("discount_value", data.discount_value);
      formData.append("bundle_name", data.bundle_name);
      formData.append("discount_label", data.discount_label);
      formData.append("bundle_description", data.bundle_description || "");
      formData.append("old_media", JSON.stringify(media));
      formData.append("status", data.status || "Draft");
      formData.append("start_date", formatDate(selectedDates.start));
      formData.append("start_time", data.start_time);
      formData.append("bundle_type_id", 1);
      formData.append("endTime_status", data.endTime_status);

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
        navigate("/bundles");
        shopify.loading(false);
        shopify.saveBar.hide("save");
        shopify.toast.show(`${id ? "Update" : "Create"} Successful Bundle`);
      } else {
        shopify.saveBar.hide("save")
        shopify.loading(false);
        shopify.toast.show(result.message || `Failed to ${id ? "Update" : "Save"} Fixed Bundle`, {
          isError: true,
          duration: 8000
        });
      }
    } catch {
      shopify.loading(false);
      shopify.saveBar.hide("save");
    }
  };

  return (
    <>
      {loading ? (
        <PageSkeleton />
      ) : (
        <Page
          title={`${id ? "Update" : "Create"} Fixed Bundle`}
          backAction={{
            onAction: () => {
              navigate("/bundles");
            }
          }}
          primaryAction={id ? <Button icon={ViewIcon} onClick={() => window.open(`https://${shop}/?id=${id}`, '_blank')}>Preview</Button> : undefined}
          secondaryActions={id ? [
            {
              content: "Widget not visible?",
              onAction: toggleWidgetModal,
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

          {errors &&
            <ValidationErrors errors={errors} />
          }

          <div style={{ marginBottom: "10px" }}>
            <ButtonGroup variant='segmented'>
              <Button variant={data?.page_type === "new_page" ? "primary" : "secondary"} onClick={() => handleChangeValue("page_type", "new_page")}>Create New Page</Button>
              <Button variant={data?.page_type === "product_page" ? "primary" : "secondary"} onClick={() => handleChangeValue("page_type", "product_page")}>Included Product Page</Button>
            </ButtonGroup>
          </div>

          <Layout>
            <Layout.Section>
              <BlockStack gap={"300"}>
                {/* Included Products */}
                <Card>
                  <ProductSelection
                    title="Included Products"
                    subtitle="Add products you want to sell together"
                    selectedProducts={selectedProducts}
                    setSelectedProducts={setSelectedProducts}
                  />
                </Card>

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
                          options={discountOptions?.map(({ label, id, disabled }) => ({
                            label,
                            value: id,
                            disabled: disabled === "1",
                          }))}
                          placeholder="Select Type"
                          onChange={(id) => {
                            const selectedOption = discountOptions?.find(option => option.id === id);
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
                      <div style={{ marginBottom: "2.5rem" }}>
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

                      <FileUploadDropZone media={media} setMedia={setMedia} files={files} setFiles={setFiles} />
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

                        {/* Active Dates */}
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
                      options={[
                        { label: 'Draft', value: 'Draft' },
                        { label: 'Published', value: 'Published' },
                      ]}
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
                    {selectedProducts.length > 0 &&
                      <LegacyCard sectioned>
                        <div style={{ maxHeight: '500px', overflowX: "auto", display: "flex", flexDirection: "column", scrollbarWidth: "none" }}>
                          {files.length > 0 ?
                            <div style={{ width: "100%" }}>
                              <img
                                // src={id ? media[0] : files[0] instanceof File ? URL.createObjectURL(files[0]) : files[0]}
                                src={files[0] instanceof File ? URL.createObjectURL(files[0]) : files[0]}
                                style={{ width: "100%", height: "247px", objectFit: "cover" }}
                              />
                            </div>
                            : <div style={{ width: "100%" }}>
                              <img
                                src={media[0]}
                                style={{ width: "100%", height: "247px", objectFit: "cover" }}
                              />
                            </div>
                          }
                          <div style={{ width: "100%" }}>
                            {data?.bundle_name &&
                              <p style={{ marginTop: '10px', fontSize: "2rem", fontWeight: "500", marginBottom: "25px", lineHeight: "2rem" }}>{data?.bundle_name}</p>
                            }
                            <p style={{ marginTop: '10px', fontSize: "1rem", fontWeight: "400", marginBottom: "25px" }}>$559.00 <span style={{ textDecoration: "line-through", marginLeft: "5px" }}>$1199.11</span></p>

                            {selectedProducts?.length > 0 && selectedProducts.map((product, index) => (
                              <div key={index}>
                                <div style={{ display: "flex" }}>
                                  <img
                                    src={product?.image}
                                    alt={product?.title}
                                    style={{ width: "60px", height: "60px", borderRadius: "10px", objectFit: "fill" }}
                                  />
                                  <div style={{ marginLeft: "10px" }}>
                                    <p>{product?.title}</p>
                                    <p style={{ marginTop: '5px', fontWeight: "500" }}>$50.00</p>
                                  </div>
                                </div>
                                {index !== selectedProducts.length - 1 && (
                                  <div style={{ margin: "10px 0px" }}>
                                    <Divider />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </LegacyCard>
                    }

                    <BundlesPreview
                      bundle_type_id="1"
                      title={data?.bundle_name}
                      media={media}
                      modalSize="large"
                      products={selectedProducts}
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
  );
}

export default BundleFixed