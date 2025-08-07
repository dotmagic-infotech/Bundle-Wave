// React Imports
import { useContext, useEffect, useState } from 'react'

// Shopify Polaris
import { BlockStack, Box, Button, Card, InlineStack, Layout, LegacyCard, Modal, Page, RadioButton, Select, SkeletonBodyText, SkeletonDisplayText, Text, TextContainer, TextField } from '@shopify/polaris'
import { SaveBar } from '@shopify/app-bridge-react'
import { ViewIcon } from '@shopify/polaris-icons'

// Third Party IMports
import { useNavigate, useParams } from 'react-router-dom'

// Custom Component
import ValidationErrors from '../../../components/ValidationErrors'
import ProductSelection from '../../../components/ProductSelection'
import { MetaContext } from '../../../components/MetaDataContext/MetaDataProvider'
import BundlesPreview from '../BundlesPreview'
import PageSkeleton from '../../../components/PageSkeleton'
import { ShopifyContext } from '../../../components/ShopifyProvider/ShopifyProvider'
import { useFetchWithToken } from '../../../components/FetchDataAPIs/FetchWithToken'
import WidgetModal from '../../../components/WidgetModal/WidgetModal'

const Frequently = () => {

  // Hooks
  const { id } = useParams();
  const navigate = useNavigate();
  const { discountOptions } = useContext(MetaContext);
  const { shopName } = useContext(ShopifyContext);
  const fetchWithToken = useFetchWithToken();

  // State
  const [data, setData] = useState({
    bundle_subtype: "all_product",
    discount_option_id: "1",
    discount_label: "Frequently Discount",
    discount_value: 1,
    bundle_title: "Frequently Bought Together",
    status: "Published"
  })
  const [errors, setErrors] = useState({})
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductsOffers, setSelectedProductsOffers] = useState([]);
  const [widgetModalOpen, setWidgetModalOpen] = useState(false);

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
        setSelectedProducts(data?.products);
        setSelectedProductsOffers(data?.offered_products);

        setData({
          bundle_subtype: data?.bundle_subtype,
          discount_label: data.discount_label,
          discount_option_id: selectedOption ? selectedOption.id : "",
          discount_value: data?.discount_value,
          bundle_name: data?.bundle_name,
          bundle_title: data?.bundle_title,
          status: data?.status,
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

  useEffect(() => {
    if (selectedProducts?.length === 0) {
      setSelectedProductsOffers([])
    }
  }, [selectedProducts])

  const handleChangeValue = (key, value) => {
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
    shopify.saveBar.show('save');
  };

  const validateForm = () => {
    let newErrors = {};

    const hasDuplicateProduct = selectedProducts?.some((mainProduct) =>
      selectedProductsOffers?.some(
        (offerProduct) => mainProduct.id === offerProduct.id
      )
    );

    if (!data.bundle_name) newErrors.bundle_name = "Please Enter Name";

    if (selectedProductsOffers?.length > 3) {
      newErrors.bundle_name = "You can only add up to 3 offered products.";
    }

    if (hasDuplicateProduct) {
      newErrors.bundle_name = "The main product cannot be presented as an offered product";
    }

    if (!["4", "5"].includes(data?.discount_option_id) && (!data.discount_value || isNaN(data.discount_value) || data.discount_value <= 0)) {
      newErrors.discount_value = "Please enter a valid discount amount.";
    }

    if (data?.bundle_subtype === "specific_product") {
      if (!selectedProducts || selectedProducts?.length < 1) newErrors.selectedProducts = "Minimum One products are required.";
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
      const passData = {
        bundle_subtype: data?.bundle_subtype,
        discount_label: data.discount_label,
        discount_option_id: data?.discount_option_id,
        discount_value: data?.discount_value,
        bundle_name: data?.bundle_name,
        bundle_title: data?.bundle_title,
        status: data?.status,
        bundle_type_id: 6,
      }

      if (data?.bundle_subtype === "specific_product") {
        passData.products = selectedProducts;
        passData.offered_products = selectedProductsOffers
      }
      const url = id
        ? `https://test-app.dotmagicinfotech.in/api/bundles/update/${id}?shop=${shopName}`
        : `https://test-app.dotmagicinfotech.in/api/bundles/create?shop=${shopName}`;

      const result = await fetchWithToken({
        url: url,
        method: 'POST',
        body: passData,
        isFormData: false,
      });

      if (result.status) {
        navigate("/bundles");
        shopify.loading(false);
        shopify.saveBar.hide("save");
        shopify.toast.show(`${id ? "Update" : "Create"} Successful Bundle`);
      } else {
        shopify.loading(false);
        shopify.toast.show(result.message || `Failed to ${id ? "Update" : "Save"} Frequently Bundle`, {
          isError: true,
          duration: 8000
        });
      }
    } catch {
      shopify.loading(false);
      shopify.saveBar.hide("save");
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
          title={`${id ? "Update" : "Create"} Frequently bought together`}
          backAction={{
            onAction: () => {
              shopify.saveBar.hide('save')
              navigate("/bundles")
            }
          }}
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

          <div style={{ marginBottom: "15px" }}>
            {errors && <ValidationErrors errors={errors} />}
          </div>

          <Layout>
            <Layout.Section>
              <BlockStack gap={"300"}>
                {/* FBT type */}
                <Card>
                  <BlockStack gap="300">
                    <BlockStack>
                      <Text as="span" variant="headingMd">FBT type</Text>
                    </BlockStack>
                    <InlineStack gap="200">
                      <div style={{ display: "flex", flexDirection: "column", width: '100%' }}>
                        <RadioButton
                          label="All products"
                          helpText="AI suggests the best selling product combinations on all your product pages."
                          checked={data.bundle_subtype === 'all_product'}
                          id="all_product"
                          onChange={() => {
                            handleChangeValue("bundle_subtype", "all_product");
                            setSelectedProducts([]);
                          }}
                        />
                        <RadioButton
                          label="Specific product"
                          helpText="For a specific product, define related and best-selling products or use the suggestions of AI."
                          id="specific_product"
                          checked={data.bundle_subtype === 'specific_product'}
                          onChange={() => {
                            handleChangeValue("bundle_subtype", "specific_product");
                            setSelectedProducts([]);
                          }}
                        />
                      </div>
                    </InlineStack>
                  </BlockStack>
                </Card>

                {data?.bundle_subtype === "specific_product" &&
                  <Card>
                    <BlockStack gap="300">
                      <Text as="span" variant="headingMd">Main product</Text>
                      <Text as="span" variant="bodyMd" tone="subdued">Select the product you want to offer frequently bought together products for</Text>

                      <ProductSelection
                        selectedProducts={selectedProducts}
                        setSelectedProducts={setSelectedProducts}
                        productCount={false}
                        multipleProduct={false}
                      />
                    </BlockStack>
                  </Card>
                }

                {data?.bundle_subtype === "specific_product" &&
                  <Card>
                    <BlockStack gap="300">
                      <Text as="span" variant="headingMd">Offered products</Text>
                      <Text as="span" variant="bodyMd" tone="subdued">Select the products that are frequently bought with the main product. (You can choose up to 3 products.)</Text>

                      <ProductSelection
                        selectedProducts={selectedProductsOffers}
                        setSelectedProducts={setSelectedProductsOffers}
                        productCount={false}
                        disabled={selectedProducts?.length === 0}
                      />
                    </BlockStack>
                  </Card>
                }

                {/* Discount */}
                <Card>
                  <BlockStack gap="300">
                    <Text as="span" variant="headingMd">Discount</Text>
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
                                min={1}
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

                {/* Advanced settings */}
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
                    </InlineStack>
                  </BlockStack>
                </Card>

                {/* General */}
                <div style={{ paddingBottom: "10px" }}>
                  <Card>
                    <BlockStack gap="300">
                      <Text as="span" variant="headingMd">General</Text>
                      <>
                        <TextField
                          label="Name"
                          value={data?.bundle_name}
                          onChange={(value) => handleChangeValue("bundle_name", value)}
                          maxLength={150}
                          autoComplete="off"
                          showCharacterCount
                        />
                        <span>Your customers won’t see this name. This name is used for you to identify this bundle.</span>
                      </>
                      <TextField
                        label="Title"
                        value={data?.bundle_title}
                        onChange={(value) => handleChangeValue("bundle_title", value)}
                        maxLength={200}
                        autoComplete="off"
                        showCharacterCount
                      />
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
                  </BlockStack>
                </Card>

                <Card>
                  <BlockStack gap="300">
                    <Text as="span" variant="headingMd">Bundle preview</Text>
                    <LegacyCard sectioned>
                      <TextContainer>
                        <SkeletonDisplayText size="small" />
                        <SkeletonBodyText />
                      </TextContainer>
                    </LegacyCard>

                    <BundlesPreview
                      bundle_type_id="6"
                      modalSize="large"
                      data={data}
                      products={selectedProducts}
                      offerProducts={selectedProductsOffers}
                    />
                  </BlockStack>
                </Card>
              </BlockStack>
            </Layout.Section>
          </Layout>

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

export default Frequently