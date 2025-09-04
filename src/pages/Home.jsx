// React Imports
import { useContext, useEffect, useState } from 'react'

// Shopify Imports
import { Page, Card, BlockStack, Text, InlineStack, Grid, Icon, Box, DataTable, useBreakpoints, Banner, Button, CalloutCard, Modal, Badge } from "@shopify/polaris"
import { ButtonIcon, ClipboardChecklistIcon, ExternalIcon, PlusIcon, PriceListIcon, ViewIcon } from '@shopify/polaris-icons';

// Third Party Imports
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'

// Custom Component
import { useFetchWithToken } from '../components/FetchDataAPIs/FetchWithToken';
import { ShopifyContext } from '../components/ShopifyProvider/ShopifyProvider';

const Home = () => {

  // Hooks
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const { shopName, currencySymbol } = useContext(ShopifyContext);
  const fetchWithToken = useFetchWithToken();

  // state
  const [welocomePopup, setWelocomePopup] = useState(true);
  const [showModal, setShowModal] = useState(true);
  const [homeData, setHomeData] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { lgDown } = useBreakpoints();
  const fixedFirstColumns = lgDown ? 2 : 0;

  const toggleDeleteModal = () => setDeleteModalOpen(prev => !prev);

  useEffect(() => {
    const hasSeen = localStorage.getItem("firstDownloadApp");

    if (hasSeen === "false") {
      setWelocomePopup(false);
      setShowModal(false);
      localStorage.setItem("firstDownloadApp", "false");
    }

    const fetchUserDashBoard = async () => {
      try {
        const data = await fetchWithToken({
          url: `https://bundle-wave-backend.xavierapps.com/api/user_dashboard?limit=5&shop=${shopName}`,
          method: 'GET',
        });

        setHomeData(data)
      } catch (error) {
        console.error("Failed to fetch bundle details:", error);
      }
    };

    fetchUserDashBoard();
  }, []);

  const redirectTheme = () => {
    const url = `https://${shopName}/admin/themes/current/editor?context=apps&activateAppId=d0627ca0-a5b7-4ed2-89b1-91187e230657/app-embed`;
    window.open(url, '_blank');
  }

  const handleConfettiComplete = () => {
    setTimeout(() => {
      setShowModal(false)
    }, 500);
  };

  const toggleClose = () => {
    setWelocomePopup(false);
    localStorage.setItem("firstDownloadApp", "false");
  }

  const handleClearMetaField = async () => {
    try {
      const data = await fetchWithToken({
        url: `https://bundle-wave-backend.xavierapps.com/webhooks/remove_all_data?shop=${shopName}`,
        method: 'GET',
      });
      if (data.status) {
        shopify.toast.show(`Successfully Removed App Data`);
        toggleDeleteModal();

      } else {
        shopify.toast.show(`Failed to Remove App Data`);
      }
    } catch (error) {
      console.error("Failed to fetch bundle details:", error);
    }
  };

  return (
    <>
      {showModal && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={700}
          gravity={0.2}
          tweenDuration={3000}
          onConfettiComplete={handleConfettiComplete}
        />
      )}

      <Page title="Home">
        <BlockStack gap={500}>
          <Banner
            title="Bundle Wave in not activated"
            tone="warning"
            onDismiss={() => { }}
          >
            <p>Bundle Wave theame extension needs to be activated in your theame to work properly. to activate the app, click the 'Activate' button below, and then click <strong>'Save'</strong> on the following page.</p>
            <div style={{ marginTop: "1rem" }}>
              <InlineStack gap={200}>
                <Button variant='primary' onClick={redirectTheme}>Activate</Button>
                <Button variant='secondary'>Learn more</Button>
              </InlineStack>
            </div>
          </Banner>

          <div style={{ marginTop: "0px" }}>
            <Banner
              title="How the Button Should Work"
              tone="info"
            >
              <p>
                <strong>A clear warning so the merchant understands:</strong><br />
                Clicking this button will permanently delete all bundles, discounts, settings, and shop data stored by this app. This action cannot be undone. After deleting, you may uninstall the app safely.
              </p>
              <div style={{ marginTop: "1rem" }}>
                <InlineStack gap={200}>
                  <Button variant='primary' onClick={toggleDeleteModal}>Delete app data</Button>
                </InlineStack>
              </div>
            </Banner>
          </div>

          <CalloutCard
            title="Need some ideas?"
            illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
            primaryAction={{ content: 'Show me bundle ideas', icon: ExternalIcon }}>
            <Text as='p' variant='headingMd' fontWeight='medium'>There's several ways to create bundles, we have some suggestions for you to get started.</Text>
            <Text as='p'>You are 42% more likely to increase conversions if you have at least 3 bundles.</Text>
          </CalloutCard>

          <Card>
            <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "20px 0px" }}>
              <img src='https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg' width="150px" />
              <div>
                <Text as='h2' fontWeight='bold' alignment='center'>Get started with bundles</Text>
                <Text as='h2' fontWeight='regular' alignment='center'>Welcome to Bundle Wave, get started by creating your 1st bundle.</Text>
              </div>
              <Button icon={PlusIcon} variant='primary' onClick={() => navigate('/bundlesList')}>Create Bundle</Button>
            </div>
          </Card>

          <Grid>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
              <Card>
                <InlineStack gap={200}>
                  <Box>
                    <Icon source={ViewIcon} />
                  </Box>
                  <BlockStack gap={100}>
                    <Text as='p' fontWeight='medium' variant='headingMd'>Bundle views</Text>
                    <Text as='p' fontWeight='medium' variant='headingSm'>{homeData?.total_views || 0}</Text>
                  </BlockStack>
                </InlineStack>
              </Card>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
              <Card>
                <InlineStack gap={200}>
                  <Box>
                    <Icon source={ButtonIcon} />
                  </Box>
                  <BlockStack gap={100}>
                    <Text as='p' fontWeight='medium' variant='headingMd'>Bundle clicks</Text>
                    <Text as='p' fontWeight='medium' variant='headingSm'>10</Text>
                  </BlockStack>
                </InlineStack>
              </Card>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
              <Card>
                <InlineStack gap={200}>
                  <Box>
                    <Icon source={PriceListIcon} />
                  </Box>
                  <BlockStack gap={100}>
                    <Text as='p' fontWeight='medium' variant='headingMd'>Total sales value</Text>
                    <Text as='p' fontWeight='medium' variant='headingSm'>{currencySymbol}{homeData?.bundle_sales_value || 0}</Text>
                  </BlockStack>
                </InlineStack>
              </Card>
            </Grid.Cell>
          </Grid>
        </BlockStack>
      </Page>

      <Page title="Recent bundles">
        <div style={{ marginBottom: "1rem" }}>
          <DataTable
            columnContentTypes={[
              'text',
              'text',
              'text',
              'text',
            ]}
            headings={[
              <div style={{ fontWeight: "500" }}>Bundled items</div>,
              <div style={{ fontWeight: "500" }}>Name</div>,
              <div style={{ fontWeight: "500" }}>Status</div>,
              <div style={{ fontWeight: "500" }}>Discount</div>,
            ]}
            footerContent={`Showing ${homeData?.bundle_details?.length} of 5 results`}
            defaultSortDirection="descending"
            initialSortColumnIndex={4}
            stickyHeader
            fixedFirstColumns={fixedFirstColumns}
            verticalAlign='middle'
            rows={(homeData?.bundle_details || []).map(({ media, bundle_name, status, discount_option_id, discount_value, bundle_type_id, discount_options }) => [
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                {Array.isArray(media) && media.slice(0, 2).map((imgSrc, index) => (
                  <img key={index} src={imgSrc?.url} width="40px" height="40px" alt="Bundle Item" style={{
                    borderRadius: "50%", objectFit: "cover", marginRight: index < media.slice(0, 2).length - 1 ? "-25px" : "0",
                  }} />
                ))}

                {Array.isArray(media) && media.length > 2 && (
                  <div style={{
                    width: '40px', zIndex: 1, height: "40px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid gray", fontWeight: "600", backgroundColor: "#f6f6f7", marginRight: "0", marginLeft: "-25px",
                  }}>
                    +{media.length - 2}
                  </div>
                )}

                {!Array.isArray(media) && (
                  <img src={bundleItem} width="40px" height="40px" alt="Bundle Item" style={{ borderRadius: "50%", objectFit: "cover" }} />
                )}
              </div>,
              <div style={{ height: "100%", display: "flex", alignItems: "center" }}>{bundle_name}</div>,
              <div style={{ height: "100%", display: "flex", alignItems: "center" }}>
                {status === "Published" ? (
                  <Badge tone="success">{status}</Badge>
                ) : status === "Draft" ? (
                  <Badge tone="info">{status}</Badge>
                ) : (
                  <Badge tone="critical">{status}</Badge>
                )}
              </div>,
              <div style={{ height: "100%", display: "flex", alignItems: "center" }}>
                {discount_option_id === "1"
                  ? `${discount_value}% OFF`
                  : discount_option_id === "2"
                    ? `$${discount_value} OFF`
                    : discount_option_id === "3"
                      ? `Set Price $${discount_value}`
                      : bundle_type_id === "4"
                        ? `${discount_options?.length} option`
                        : "No Discounts"}
              </div>,
            ])}
          />
        </div>
      </Page>

      <Modal
        size='fullScreen'
        instant
        open={welocomePopup}
        onClose={toggleClose}
        title="Welcome to Bundle Wave"
      >
        <Modal.Section>
          <InlineStack align='space-between'>
            <BlockStack gap={300}>
              <Text as='p' variant='headingMd' fontWeight='medium'>Follow the steps below to get started</Text>
              <Text as='span'>0 of 3 tasks complate</Text>
            </BlockStack>
            <img src='https://img.freepik.com/free-vector/sticker-empty-box-opened-white-background_1308-68243.jpg?t=st=1743747523~exp=1743751123~hmac=7ff88ce8116093a8bcddd37877c71df147bce47715a09105b41018c03f610603&w=996' width="100px" height="75px" />
          </InlineStack>

          <Box paddingBlock="200">
            <InlineStack gap={100} blockAlign='center' align='start'>
              <Text as='p' variant='headingMd' fontWeight='medium'>Enable the Bundle Wave theme app extension in your theame.</Text>
            </InlineStack>
          </Box>
          <BlockStack gap={300}>
            <div style={{ display: 'flex', gap: "1rem", alignItems: "center" }}>
              <div>
                <Icon source={ClipboardChecklistIcon} />
              </div>
              <div style={{ backgroundColor: "#f3f3f3", borderRadius: "10px", padding: "1rem" }}>
                <Box padding="300">
                  <Text as='p' variant='headingMd' fontWeight='regular'>1. Click enable below to go theme app page</Text>
                  <Text as='p' variant='headingMd' fontWeight='regular'>2. Make sure the 'Bundle Wave Script' is enable (left side)</Text>
                  <Text as='p' variant='headingMd' fontWeight='regular'>3. Save the theme settings by clicking 'Save'. (Make sure you click 'Save')</Text>
                  <Text as='p' variant='headingMd' fontWeight='regular'>4. Click 'Verify' below to confirm it's done.</Text>
                </Box>
                <Box paddingBlockStart="100">
                  <InlineStack gap={100}>
                    <Button variant='primary'>Enable</Button>
                    <Button variant='secondary'>Verify</Button>
                  </InlineStack>
                </Box>
              </div>
            </div>
            <div style={{ display: 'flex', gap: "1rem", alignItems: "center" }}>
              <div>
                <Icon source={ClipboardChecklistIcon} />
              </div>
              <Text as='p' variant='headingMd' fontWeight='regular'>Create your first bundle</Text>
              <Button variant='secondary' onClick={() => navigate("/bundlesList/fixed_bundle")}>Create Bundle</Button>
            </div>
            <div style={{ display: 'flex', gap: "1rem", alignItems: "center" }}>
              <div>
                <Icon source={ClipboardChecklistIcon} />
              </div>
              <Text as='p' variant='headingMd' fontWeight='regular'>Customize the look of your bundles accordingly to your store's theme</Text>
              <Button variant='secondary' onClick={() => navigate("/customization")}>Customize</Button >
            </div>
            <Text as='p' variant='headingMd' fontWeight='regular'>
              Thank you for trying our app ;). If you have any questions or need help you can{' '}
              <span style={{ color: "blue" }}>talk to us via Live Chat</span> or via the email support@react.bundle.</Text>
          </BlockStack>
        </Modal.Section>
      </Modal>

      <Modal
        open={deleteModalOpen}
        onClose={toggleDeleteModal}
        title="Are you sure you want to delete App data?"
        // size='small'
        primaryAction={{
          content: "Delete",
          destructive: true,
          onAction: () => {
            handleClearMetaField();
          },
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: toggleDeleteModal,
          },
        ]}
      >
        <Modal.Section>
          This action cannot be undone. Deleting the App Data will remove it permanently from your store.
        </Modal.Section>
      </Modal>
    </>
  )
}

export default Home