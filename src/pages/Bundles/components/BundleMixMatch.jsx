// React Imports
import { useContext, useEffect, useState } from 'react'

// Shopify Polaris
import { BlockStack, Box, Button, ButtonGroup, Card, Checkbox, Divider, InlineError, InlineStack, Layout, LegacyStack, Modal, Page, RadioButton, Select, Text, TextField } from '@shopify/polaris'
import { SaveBar } from '@shopify/app-bridge-react';

// Shopify Icons
import { ChevronDownIcon, ChevronRightIcon, DeleteIcon, PlusIcon, ViewIcon } from '@shopify/polaris-icons'

// Third Party Imports
import { useNavigate, useParams } from 'react-router-dom'
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Images
import oneimage from "../../../assets/PngImage/1.svg"
import twoimage from "../../../assets/PngImage/2.svg"

// Custom Component
import { MetaContext } from '../../../components/MetaDataContext/MetaDataProvider';
import { useFetchWithToken } from '../../../components/FetchDataAPIs/FetchWithToken';
import FileUploadDropZone from '../../../components/FileUploadDropZone/FileUploadDropZone';
import ProductWithCollections from '../../../components/ProductWithCollections/ProductWithCollections';
import ProductSelection from '../../../components/ProductSelection';
import ValidationErrors from '../../../components/ValidationErrors';
import BundlesPreview from '../BundlesPreview';
import DateTimePicker from '../../../components/DateRangePicker/DateTimePicker';
import YoutubeVideo from '../../../components/YoutubeVideo/YoutubeVideo';
import WidgetModal from '../../../components/WidgetModal/WidgetModal';
import PageSkeleton from '../../../components/PageSkeleton';
import ProductSelectOnly from '../../../components/ProductSelection/ProductSelectOnly';

function BundleMixMatch() {

  // Hooks
  const navigate = useNavigate();
  const { id } = useParams();
  const { discountOptions } = useContext(MetaContext);
  const fetchWithToken = useFetchWithToken();

  // State
  const [data, setData] = useState({
    discount_value: "10",
    bundle_description: "",
    bundle_subtype: "Single",
    page_type: "new_page",
    start_time: "12:00 AM",
    end_time: "12:00 PM",
    endTime_status: "0",
    status: "Published",
    discount_option_id: "1",
    discount_label: "Mix and Match Discount",
    show_action: "new_page",
    url: ""
  });
  const [files, setFiles] = useState([]);
  const [media, setMedia] = useState([]);
  const [displayIncludePage, setDisplayIncludePage] = useState([]);
  const [selProductsTired, setSelProductsTired] = useState([]);
  const [selCollectionTired, setSelCollectionTired] = useState([]);
  const [sections, setSections] = useState([]);
  const [errors, setErrors] = useState({});
  const [validBuyStart, setValidBuyStart] = useState(true);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [widgetModalOpen, setWidgetModalOpen] = useState(false);
  const [selectedFirst, setSelectedFirst] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedDates, setSelectedDates] = useState({ start: new Date(), end: new Date() });
  const [discountOption, setDiscountOption] = useState([
    { id: 1, discountValue: "10", buy_start: "1", buy_end: "", type: "1", range: "", allow_users: "" }
  ]);

  const fetchBundleDetails = async (id) => {
    try {
      setLoading(true);
      const data = await fetchWithToken({
        url: `https://bundle-wave-backend.xavierapps.com/api/bundles/${id}`,
        method: 'GET',
      });

      const selectedOption = discountOptions.find(option => option.id === data.discount_option_id);
      setMedia(data.media);
      setSelectedDates({
        start: data.start_date ? new Date(data.start_date) : new Date(),
        end: data.end_date ? new Date(data.end_date) : new Date(),
      });

      setSections(data.sections);
      setSelProductsTired(data?.products)
      setSelCollectionTired(data?.collections)
      setDisplayIncludePage(data?.includePageId);
      setDiscountOption(data?.tiered_discount_options)

      setData({
        discount_option_id: selectedOption ? selectedOption.id : "selCollectionTired1",
        discount_value: data.discount_value,
        bundle_subtype: data.bundle_subtype,
        page_type: data?.page_type,
        status: data.status,
        sections: data.sections,
        bundle_name: data.bundle_name,
        discount_label: data.discount_label,
        bundle_description: data.bundle_description || "",
        endTime_status: data.endTime_status,
        start_time: data.start_time,
        end_time: data?.end_time,
        show_action: data?.page_type,
        url: data?.url
      });
    } catch (error) {
      console.error("Failed to fetch bundle details:", error);
      shopify.saveBar.hide("save");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBundleDetails(id);
    }
  }, [id]);

  useEffect(() => {
    if (selProductsTired?.length > 0) {
      setSelCollectionTired([]);
    }
  }, [selProductsTired]);

  useEffect(() => {
    if (selCollectionTired?.length > 0) {
      setSelProductsTired([]);
    }
  }, [selCollectionTired]);

  useEffect(() => {
    const hasInvalidBuyStart = discountOption.some((option, index) =>
      index > 0 &&
      parseInt(option.buy_start || "0", 10) <= parseInt(discountOption[index - 1].buy_start || "0", 10)
    );

    setValidBuyStart(hasInvalidBuyStart);
  }, [discountOption]);

  const toggleWidgetModal = () => setWidgetModalOpen(prev => !prev);
  const toggleVideoModal = () => setVideoModalOpen(prev => !prev);

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
    if (discountOption?.length < 3) {
      setDiscountOption([...discountOption, { id: discountOption?.length + 1, buy_start: discountOption?.length + 1, type: "1", discountValue: "10", }]);
    }
  };

  const handleRemoveOption = (id) => {
    if (discountOption?.length > 1) {
      setDiscountOption(discountOption.filter(option => option.id !== id));
    }
  };

  const handleChangeOption = (id, key, value) => {
    setDiscountOption((prevOptions) =>
      prevOptions.map((option) =>
        option.id === id ? { ...option, [key]: value } : option
      )
    );
    shopify.saveBar.show('save');
  };

  const getSectionImage = (section) => {
    if (section?.collection?.length > 0) return section.collection[0]?.image;
    if (section?.products?.length > 0) return section.products[0]?.image;
    if (section?.media) return section.media;
    if (section?.sectionImage?.length > 0) return section.sectionImage[0];
    return "";
  };

  const validateForm = () => {
    let newErrors = {};

    if (!data.bundle_name) newErrors.bundle_name = "Bundle name is required.";
    if (data.page_type === "product_page" && displayIncludePage?.length === 0) {
      newErrors.displayIncludePage = "Select product to show your bundle in  include product page.";
    }
    if (data.bundle_subtype === "Single") {
      if (!["4", "5"].includes(data?.discount_option_id)) {
        const value = Number(data.discount_value);
        if (!value || isNaN(value) || value <= 0) {
          newErrors.discount_option_id = "Please enter a valid discount amount.";
        }
        if (data.discount_option_id === "1" && value >= 101) {
          newErrors.discount_option_id = "Discount must be less than 100.";
        }
      }

      if (sections.length === 0) newErrors.section = "Please add at least a product or a collection.";
    } else if (data.bundle_subtype === "Tiered") {
      if (selProductsTired.length === 0 && selCollectionTired.length === 0) newErrors.tieredProductError = "Please add at least a product or a collection.";
    }
    if (validBuyStart) newErrors.tiered_discount_options = "This value must be greater than the previous option.";

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
      formData.append("bundle_subtype", data.bundle_subtype);
      formData.append("discount_option_id", data.discount_option_id || 1);
      formData.append("page_type", data.page_type);
      formData.append("discount_value", data.discount_value);
      formData.append("bundle_name", data.bundle_name);
      formData.append("discount_label", data.discount_label);
      formData.append("bundle_description", data.bundle_description || "");
      const formatDate = (date) =>
        new Date(date.getTime() - date.getTimezoneOffset() * 60000)
          .toISOString()
          .split("T")[0];
      formData.append("start_date", formatDate(selectedDates.start));
      formData.append("status", data.status || "Draft");
      formData.append("start_time", data.start_time);
      formData.append("bundle_type_id", 2);
      formData.append("endTime_status", data.endTime_status || "0");
      formData.append("old_media", JSON.stringify(media));

      // Append SECTIONS as JSON WITHOUT the image blobs
      const sectionsToSend = sections.map((section, index) => {
        const { sectionImage, ...rest } = section;
        return rest;
      });
      formData.append("sections", JSON.stringify(sectionsToSend));

      // Attach section images as binary
      sections.forEach((section, index) => {
        const images = Array.isArray(section.sectionImage)
          ? section.sectionImage
          : section.sectionImage
            ? [section.sectionImage]
            : [];

        images.forEach((file) => {
          formData.append(`section_images[${index}]`, file);
        });
      });

      formData.append("products", JSON.stringify(selProductsTired));
      formData.append("collections", JSON.stringify(selCollectionTired));
      formData.append("tiered_discount_options", JSON.stringify(discountOption));

      if (files?.length > 0) {
        files.forEach(file => formData.append("media[]", file));
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
        ? `https://bundle-wave-backend.xavierapps.com/api/bundles/update/${id}`
        : `https://bundle-wave-backend.xavierapps.com/api/bundles/create`;

      const result = await fetchWithToken({
        url: url,
        method: 'POST',
        body: formData,
        isFormData: true,
      });

      if (result.status) {
        // navigate("/bundles");
        navigate(`/bundlesList/mix-match/edit/${result?.id}`)
        fetchBundleDetails(result?.id);
        shopify.loading(false);
        shopify.saveBar.hide("save");
        shopify.toast.show(`${id ? "Update" : "Create"} Successful Bundle`);
      } else {
        shopify.loading(false);
        shopify.saveBar.hide("save")
        shopify.toast.show(result.message || `Failed to ${id ? "Update" : "Save"} Mix-Match Bundle`, {
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
          title={`${id ? "Update" : "Create"} Mix and Match`}
          backAction={{ onAction: () => navigate("/bundles") }}
          secondaryActions={id ? [
            {
              content: "Widget not visible?",
              onAction: toggleWidgetModal,
            },
            ...(data?.show_action === "new_page" ?
              [
                {
                  content: "View on store",
                  icon: ViewIcon,
                  onAction: () => window.open(`https://${shop}/?id=${id}`, '_blank'),
                },
              ]
              : []),
          ] : []}
          actionGroups={id && data?.show_action === "product_page" ? [
            {
              title: 'View In Store',
              icon: ViewIcon,
              actions: [
                {
                  content: 'New page',
                  onAction: () => window.open(`https://${shop}/?id=${id}`, '_blank'),
                },
                {
                  content: 'Include product page',
                  onAction: () => window.open(`https://${shop}/products/${data?.url}`, '_blank'),
                },
              ],
            },
          ] : undefined}
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
                {/* Discount structure */}
                <Card>
                  <BlockStack align="space-between" gap={"200"}>
                    <Text as={"span"} variant="headingMd">Discount structure</Text>
                  </BlockStack>
                  <LegacyStack vertical>
                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                      <Card padding={0}>
                        <label htmlFor="Single" style={{ display: "block", cursor: "pointer" }}>
                          <img src={oneimage} />
                          <div style={{ padding: "7px 10px 10px 15px" }}>
                            <RadioButton
                              label="Single Discount"
                              checked={data.bundle_subtype === 'Single'}
                              id="Single"
                              name="accounts"
                              onChange={() => {
                                handleChangeValue("bundle_subtype", "Single");
                                setSelProductsTired([]);
                                setSelCollectionTired([]);
                                setDiscountOption([]);
                              }}
                            />
                          </div>
                        </label>
                      </Card>
                      <Card padding={0}>
                        <label htmlFor="Tiered" style={{ display: "block", cursor: "pointer" }}>
                          <img src={twoimage} />
                          <div style={{ padding: "7px 10px 10px 15px" }}>
                            <RadioButton label="Tiered Discount" id="Tiered" name="accounts" checked={data.bundle_subtype === 'Tiered'}
                              onChange={() => {
                                handleChangeValue("bundle_subtype", "Tiered")
                                setSections([]);
                                setData((prev) => ({
                                  ...prev,
                                  discount_option_id: "",
                                  discount_value: "",
                                }));
                              }}
                            />
                          </div>
                        </label>
                      </Card>
                    </div>
                  </LegacyStack>
                </Card>

                <BlockStack gap={"300"}>
                  {/* Sections */}
                  {data.bundle_subtype === "Single" &&
                    <Card>
                      <BlockStack align="space-between" gap={"200"}>
                        <Text as={"span"} variant="headingMd">Sections</Text>
                        <Text as={"span"} variant="bodyMd" tone="subdued">Add sections you want your customers to buy from.</Text>
                        <ProductWithCollections
                          sections={sections}
                          setSections={setSections}
                        />
                      </BlockStack>
                    </Card>
                  }

                  {/* Included products */}
                  {data.bundle_subtype === "Tiered" &&
                    <Card>
                      <ProductSelection
                        title="Included Products"
                        subtitle="Add products you want to sell together"
                        selectedProducts={selProductsTired}
                        setSelectedProducts={setSelProductsTired}
                        selectedCollections={selCollectionTired}
                        setSelectedCollections={setSelCollectionTired}
                        multiple={true}
                        productCount={false}
                      />
                    </Card>
                  }

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
                  {data.bundle_subtype === "Single" &&
                    <Card>
                      <BlockStack align="space-between" gap={"200"}>
                        <Text as={"span"} variant="headingMd">Discount</Text>
                        <InlineStack gap="200">
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
                                    prefix={data.discount_option_id === "1" ? "%" : "$"}
                                    type="number"
                                    min={0}
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
                  }

                  {/* Discount options */}
                  {data.bundle_subtype === "Tiered" &&
                    <Card>
                      <BlockStack gap={"300"}>
                        <BlockStack>
                          <Text as="span" variant="headingMd">Discount options</Text>
                          <Text as={"span"} variant="bodyMd" tone="subdued">Enter the number of items and discount for each option.</Text>
                          <div>
                            {discountOption.map((option, index) => {
                              const isInvalidBuyStart =
                                index > 0 &&
                                parseInt(option.buy_start || "0", 10) <= parseInt(discountOption[index - 1].buy_start || "0", 10);

                              return (
                                <div key={option.id}>
                                  <div style={{ marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Text as="span" variant="headingMd">OPTION {index + 1}</Text>
                                    {index > 0 && (
                                      <Button icon={DeleteIcon} onClick={() => handleRemoveOption(option.id)} />
                                    )}
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "15px" }}>
                                    <Text as='span'>Buy</Text>
                                    <Box width="80px">
                                      <TextField
                                        labelHidden
                                        type="number"
                                        value={option.buy_start}
                                        onChange={(value) => handleChangeOption(option.id, "buy_start", value)}
                                        autoComplete="off"
                                        error={isInvalidBuyStart}
                                      />
                                    </Box>
                                    {/* {option.range === "1" &&
                                    <>
                                      <Text as='span'>-</Text>
                                      <Box width="100px">
                                        <TextField
                                          label="Amount"
                                          labelHidden
                                          type="number"
                                          value={option.buy_end}
                                          onChange={(value) => handleChangeOption(option.id, "buy_end", value)}
                                          autoComplete="off"
                                        />
                                      </Box>
                                    </>
                                  } */}
                                    <Text as='span'>items for</Text>
                                    <Box width="170px">
                                      <Select
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
                                            handleChangeOption(option.id, "discountValue", "")
                                          }
                                          handleChangeOption(option.id, "type", id)
                                        }}
                                      />
                                    </Box>
                                    {!["4", "5"].includes(option.type) && (
                                      <Box width="100px">
                                        <TextField
                                          label="Amount"
                                          labelHidden
                                          prefix={option.type === "1" ? "%" : "$"}
                                          type="number"
                                          value={option.discountValue}
                                          onChange={(value) => handleChangeOption(option.id, "discountValue", value)}
                                          autoComplete="off"
                                        />
                                      </Box>
                                    )}
                                  </div>
                                  {isInvalidBuyStart && (
                                    <div style={{ marginTop: "10px" }}>
                                      <InlineError message="This value must be greater than the previous option." fieldID={`buyStart-${option.id}`} />
                                    </div>
                                  )}

                                  <div style={{ display: "flex", flexDirection: "column", margin: "10px 0px" }}>
                                    {/* <Checkbox
                                    label="Add range"
                                    checked={option.range === "1"}
                                    disabled={option.allow_users === "1"}
                                    onChange={(value) => {
                                      handleChangeOption(option.id, "range", value ? "1" : "0");
                                      if (!value) {
                                        handleChangeOption(option.id, "buy_end", "");
                                      }
                                    }}
                                  /> */}

                                    {index === discountOption.length - 1 && (
                                      <Checkbox
                                        label="Allow users to buy extra items with this discount option"
                                        checked={option.allow_users === "1"}
                                        onChange={(value) => {
                                          handleChangeOption(option.id, "allow_users", value ? "1" : "0");
                                          if (value) {
                                            handleChangeOption(option.id, "range", "0");
                                            handleChangeOption(option.id, "buy_end", "");
                                          }
                                        }}
                                      />
                                    )}
                                  </div>

                                  <Divider />
                                </div>
                              )
                            })}
                            <div style={{ marginTop: "10px" }}>
                              <Button icon={PlusIcon} onClick={handleAddOption} disabled={discountOption?.length >= 3}>
                                Add Option
                              </Button>
                            </div>
                          </div>
                        </BlockStack>
                      </BlockStack>
                    </Card>
                  }

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
                          maxLength={50}
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
                        [
                          { label: 'Draft', value: 'Draft' },
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
                    {(sections?.length > 0 || selCollectionTired.length > 0 || selProductsTired.length > 0) &&
                      <div style={{ maxHeight: '500px', height: "500%", overflowX: "auto", scrollbarWidth: "none" }}>
                        <div style={{ width: "100%" }}>
                          {data?.bundle_subtype === "Single" ? (
                            <img src={files[0] instanceof File ? URL.createObjectURL(files[0]) : files[0] || sections?.[0]?.products?.[0]?.image || sections?.[0]?.collection?.[0]?.image} style={{ width: "100%", height: "247px", objectFit: "cover" }} />
                          ) : (
                            <img src={files[0] instanceof File ? URL.createObjectURL(files[0]) : files[0] || selProductsTired?.[0]?.image} style={{ width: "100%", height: "247px", objectFit: "cover" }} />
                          )}
                        </div>
                        <div style={{ width: "100%" }}>
                          {data?.bundle_subtype === "Single" && (
                            <>
                              {data?.bundle_name &&
                                <p style={{ margin: '10px 0px', fontSize: "1.5rem", fontWeight: "500", lineHeight: "1" }}>{data?.bundle_name}</p>
                              }
                              <div style={{ border: "1px solid gray", borderRadius: "10px", display: "flex", flexDirection: "column", marginBottom: "-6px" }}>
                                {sections.map((value, index) => {
                                  const sectionImg = getSectionImage(value);

                                  return (
                                    <div key={index}>
                                      <div style={{ display: "flex", padding: "15px 10px" }}>
                                        <div style={{ cursor: "pointer", display: 'flex' }}>
                                          {selectedFirst === "" ?
                                            <Button icon={ChevronRightIcon} variant="plain" onClick={() => setSelectedFirst(index)}></Button>
                                            :
                                            <Button icon={ChevronDownIcon} variant="plain" onClick={() => setSelectedFirst("")}></Button>
                                          }
                                        </div>
                                        <img src={sectionImg} width="60" height="60" style={{ marginLeft: "10px" }} />
                                        <div style={{ marginLeft: "10px" }}>
                                          <p>{value?.sectionTitle || value?.collection[0]?.title}</p>
                                          <p style={{ marginTop: '5px', fontWeight: "500" }}>{value?.discription}</p>
                                        </div>
                                      </div>
                                      <div style={{ margin: "0px 10px" }}>
                                        <Divider />
                                      </div>
                                      {selectedFirst === index &&
                                        <div>
                                          {value.products?.length > 0 && value.products.map((product, index) => (
                                            <div key={index}>
                                              <div style={{ display: "flex", padding: "15px 10px" }}>
                                                <img
                                                  src={product?.image}
                                                  alt={product?.title}
                                                  width="60" height="60"
                                                  style={{ marginLeft: "10px" }}
                                                />
                                                <div style={{ marginLeft: "10px" }}>Sections
                                                  <p>{product?.title}</p>
                                                  <p style={{ marginTop: '5px', fontWeight: "500" }}>${product?.variants[0]?.price}</p>
                                                </div>
                                              </div>
                                              {index !== value.products.length - 1 && (
                                                <div><Divider /></div>
                                              )}
                                            </div>
                                          ))}
                                          {value.collection?.length > 0 && value.collection.map((product, index) => (
                                            <div key={index}>
                                              <div style={{ display: "flex", padding: "15px 10px" }}>
                                                <img src={product?.image} alt={product?.title}
                                                  width="60" height="60"
                                                  style={{ marginLeft: "10px" }}
                                                />
                                                <div style={{ marginLeft: "10px" }}>
                                                  <p>{product?.title}</p>
                                                  <p style={{ marginTop: '5px', fontWeight: "500" }}>$50.00</p>
                                                </div>
                                              </div>
                                              {index !== value.collection?.length - 1 && (
                                                <div>
                                                  <Divider />
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      }
                                      {index !== sections.length - 1 && (
                                        <div><Divider /></div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                              <div style={{ fontSize: "15px", fontWeight: "500", marginTop: "15px" }} dangerouslySetInnerHTML={{ __html: data?.bundle_description || "" }} />
                            </>
                          )}

                          {data?.bundle_subtype === "Tiered" && (
                            <>
                              <div style={{ borderRadius: "10px", display: "flex", flexDirection: "column", maxHeight: "400px", gap: "10px" }}>
                                {data?.bundle_name &&
                                  <p style={{ fontSize: "1.5rem", fontWeight: "500", lineHeight: "1" }}>{data?.bundle_name}</p>
                                }
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                  {discountOption?.map((option, index) => (
                                    <div key={index} style={{
                                      backgroundColor: index === 0 ? "#7a26bf" : "#dddddd", color: index === 0 ? "#FFFFFF" : "#000000", borderRadius: "10px", opacity: 0.9, display: "flex", flexDirection: "column", cursor: "pointer", gap: "0.5rem", padding: "9px", width: "100%", boxShadow: "0 0 10px rgba(0,0,0,0.1)"
                                    }}>
                                      <p style={{ fontWeight: 600, fontSize: "1.3rem", textAlign: "center" }}>
                                        {option.buy_start}+ <span style={{ fontWeight: 500, fontSize: "1rem" }}>Items</span>
                                      </p>
                                      <p style={{ fontWeight: 500, fontSize: "0.9rem", textAlign: "center" }}>
                                        {option?.discountValue}% OFF
                                      </p>
                                    </div>
                                  ))}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", border: "2px solid #7a26bf", padding: "8px", borderRadius: "8px" }}>
                                  {selProductsTired?.length > 0 && selProductsTired.map((value, index) => (
                                    <div key={index}>
                                      <div>
                                        <div style={{ display: "flex" }}>
                                          <img src={value?.image} style={{ width: "60px", height: "60px" }} />
                                          <div style={{ marginLeft: "10px" }}>
                                            <p>{value?.title}</p>
                                            <p style={{ marginTop: '5px', fontWeight: "500" }}>$50.00</p>
                                          </div>
                                        </div>
                                      </div>
                                      {index !== selProductsTired.length - 1 && (
                                        <div style={{ margin: "15px 10px" }}>
                                          <Divider />
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                  {selCollectionTired?.length > 0 && selCollectionTired?.map((value, index) => (
                                    <div key={index}>
                                      <div>
                                        <div style={{ display: "flex" }}>
                                          <img src={value?.image} style={{ width: "60px", height: "60px" }} />
                                          <div style={{ marginLeft: "10px" }}>
                                            <p>{value?.title}</p>
                                            <p style={{ marginTop: '5px', fontWeight: "500" }}>$50.00</p>
                                          </div>
                                        </div>
                                      </div>
                                      {index !== selCollectionTired?.length - 1 && (
                                        <div style={{ margin: "15px 10px" }}>
                                          <Divider />
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                <div style={{ fontSize: "15px", fontWeight: "500" }} dangerouslySetInnerHTML={{ __html: data?.bundle_description || "" }} />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    }

                    <BundlesPreview
                      bundle_type_id="2"
                      title={data?.bundle_name}
                      data={data}
                      type={data?.bundle_subtype}
                      discountOption={discountOption}
                      modalSize="large"
                      sections={sections}
                      products={selProductsTired}
                      collections={selCollectionTired}
                    />
                  </BlockStack>
                </Card>
              </BlockStack>
            </Layout.Section>
          </Layout >

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

export default BundleMixMatch
