// React Imports
import { useContext, useEffect, useState } from 'react'

// Third Party Imports
import { useNavigate } from 'react-router-dom';
import { SaveBar, useAppBridge } from '@shopify/app-bridge-react';

// Shopify Imports
import { Card, Page, Grid, Button, Text, Box, Image, BlockStack, SkeletonBodyText, TextContainer, SkeletonThumbnail, InlineStack, Tooltip } from "@shopify/polaris";
import { CircleChevronRightIcon, LockIcon, QuestionCircleIcon } from '@shopify/polaris-icons';
import { useFetchWithToken } from '../../components/FetchDataAPIs/FetchWithToken';
import { ShopifyContext } from '../../components/ShopifyProvider/ShopifyProvider';

const BundleList = () => {

  // Hooks
  const navigate = useNavigate();
  const shopify = useAppBridge();
  const fetchWithToken = useFetchWithToken();
  const { shopName } = useContext(ShopifyContext);

  // State
  const [bundleData, setBundleData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    shopify.saveBar.hide("save");

    const fetchData = async () => {
      try {
        const data = await fetchWithToken({
          url: `https://bundle-wave-backend.xavierapps.com/api/bundle-types?shop=${shopName}`,
          method: 'GET',
        });
        setBundleData(data);
      } catch (error) {
        console.error("Error fetching bundles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const checkUrl = (id) => {
    const bundle = bundleData?.bundle_list.find((bundle) => bundle.id.toString() === id.toString());
    if (!bundle) return "/bundlesList/fixed_bundle";

    return bundle.url.startsWith("/") ? bundle.url : `/bundlesList/${bundle.url}`;
  };

  const handleNavigation = (id, enable) => {
    if (enable === "0") {
      shopify.toast.show(`You're currently on the ${bundleData?.plan_name} Plan.`);

      return;
    }

    const url = checkUrl(id);
    navigate(url);
  };

  const bundleCase = [
    { title: "Buy a fixed set of products together", bundleType: "Fixed bundle", redirectURL: "/bundlesList/fixed_bundle" },
    { title: "Buy product(s) X, get product(s) Y discounted or free", bundleType: "Fixed bundle", redirectURL: "/bundlesList/fixed_bundle" },
    { title: "Buy one, get one", bundleType: "Fixed bundle", redirectURL: "/bundlesList/fixed_bundle" },
    { title: "Build your own bundle: select 3-5 products from a range of various options, get 20% discount", bundleType: "Mix and match", redirectURL: "/bundlesList/mix-match" },
    { title: "Build your own bundle: select 3 products from collection A, and 1 product from collection B", bundleType: "Mix and match", redirectURL: "/bundlesList/mix-match" },
    { title: "Select your gift: buy 3 products from collection A, get your free gift from collection B", bundleType: "Mix and match", redirectURL: "/bundlesList/mix-match" },
    { title: "Buy more, save more: buy 1 at regular price, 2 with 10% OFF, 3+ with 20% OFF", bundleType: "Volume discount", redirectURL: "/bundlesList/volume_bundle" },
    { title: "Quantity breaks: buy 1x6 pack with 20% OFF, 2x6 pack with 25% OFF, and 3x6 pack with 30% OFF", bundleType: "Volume discount", redirectURL: "/bundlesList/volume_bundle" },
    { title: "Buy AI-recommended products that are frequently bought together (Amazon-like offer)", bundleType: "Frequently bought together", redirectURL: "/bundlesList/frequently_bundle" },
    { title: "Choose any 2 complementary products of a specific product with discount", bundleType: "Add-on", redirectURL: "/bundlesList/addons_bundle" },
  ]

  return (
    <>
      <Page
        title="Bundles Page"
        subtitle="A customer will choose products from the list and get a discount from the separate page."
        backAction={{ onAction: () => navigate("/bundles") }}
      >
        <SaveBar id="save"></SaveBar>
        <Box>
          {loading ? (
            <Grid columns={{ xl: 2, xs: 1, lg: 2, md: 2, sm: 1 }}>
              {Array.from({ length: 6 }).map((_, index) => (
                <Grid.Cell key={index}>
                  <Card padding={"500"}>
                    <TextContainer>
                      <BlockStack inlineAlign="center" gap={"400"}>
                        <SkeletonThumbnail size="large" />
                      </BlockStack>
                      <div style={{ marginTop: "3rem" }}>
                        <SkeletonBodyText lines={5} />
                      </div>
                      <Button disabled fullWidth>
                        Loading...
                      </Button>
                    </TextContainer>
                  </Card>
                </Grid.Cell>
              ))}
            </Grid>
          ) : (
            <Grid columns={{ xl: 2, xs: 1, lg: 2, md: 2, sm: 1 }}>
              {bundleData?.bundle_list.map((bundle, index) => (
                <Grid.Cell key={index}>
                  <Card padding={"500"}>
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                      height: "100%",
                      gap: "10px",
                      textAlign: "left",
                    }}>
                      <div style={{ width: "100%", display: "flex", justifyContent: 'end' }}>
                        <Tooltip
                          width='350'
                          content={
                            <Image
                              src="https://cdn.shopify.com/s/files/1/0839/1399/8619/files/Screenshot_2025-04-07_103731.png?v=1744002472"
                              alt="img hover"
                              width="350"
                              height="450"
                              source=""
                            />
                          }
                        >
                          <Button icon={QuestionCircleIcon} variant='monochromePlain'></Button>
                        </Tooltip>
                      </div>
                      <Box padding={"100"}>
                        <BlockStack inlineAlign="center" gap={"400"}>
                          <Image
                            src={bundle.img_src}
                            alt={bundle.title}
                            width="350px"
                            height="200px"
                          />
                        </BlockStack>
                      </Box>
                      <Box padding={"100"}>
                        <BlockStack inlineAlign="center" gap={"300"}>
                          <div style={{
                            backgroundColor: "#f4f4f4",
                            border: "1px solid #e7e7e7",
                            borderRadius: "8px",
                            color: "#1b1b1b",
                            fontSize: ".9rem",
                            fontWeight: 500,
                            lineHeight: "1.1rem",
                            marginTop: "16px",
                            padding: ".3rem 1rem",
                          }}>{bundle.title}</div>
                          <Text as={"p"} alignment='center' variant="bodyMd" children={bundle.description}></Text>
                          <Button icon={bundle.enable === "1" ? "" : LockIcon} fullWidth variant="primary" size='large'
                            onClick={() => handleNavigation(bundle.id, bundle.enable)}
                          >
                            {bundle.enable === "1" ? "Create a Bundle" : ""}
                          </Button>
                        </BlockStack>
                      </Box>
                    </div>
                  </Card>
                </Grid.Cell>
              ))}
            </Grid>
          )}
        </Box>
      </Page >

      <Page title="Need help finding the right bundle?">
        <div style={{ marginBottom: "15px" }}>
          <Card>
            <Box paddingBlockEnd="400">
              <BlockStack gap={300}>
                {bundleCase.length > 0 && bundleCase.map((v, index) => (
                  <div key={index} style={{ padding: '10px', backgroundColor: "#e7e7e7", borderRadius: "10px" }} onClick={() => navigate(v?.redirectURL)}>
                    <InlineStack align='space-between'>
                      <Text as='p' variant='bodyMd' fontWeight='regular'>{v?.title}</Text>
                      <InlineStack align='center' gap={200}>
                        <Text>{v.bundleType}</Text>
                        <Button icon={CircleChevronRightIcon} variant='monochromePlain'></Button>
                      </InlineStack>
                    </InlineStack>
                  </div>
                ))}
              </BlockStack>
            </Box>
          </Card>
        </div>
      </Page>
    </>
  );
}

export default BundleList