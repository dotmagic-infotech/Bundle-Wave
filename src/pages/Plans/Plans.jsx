// React Imports
import { useContext, useEffect, useState } from "react";

// Shopify Imports
import {
  Page, Button, Card, Grid, Box, InlineGrid, Icon, LegacyCard, DataTable, useBreakpoints, SkeletonBodyText, SkeletonDisplayText, InlineStack, Text, Collapsible, Divider, SkeletonThumbnail, SkeletonTabs, Modal, Badge,
  List,
} from "@shopify/polaris";

// Shopify Icons
import { CheckCircleIcon, ChevronDownIcon, ChevronUpIcon, StarFilledIcon, XCircleIcon } from "@shopify/polaris-icons";

// Third Party Imports
import Confetti from 'react-confetti'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from "swiper/modules";
import 'swiper/css';

// Custom Comonent
import { useApiRequest } from "../../components/FetchDataAPIs/index"
import { ShopifyContext } from "../../components/ShopifyProvider/ShopifyProvider";
import { useWindowSize } from "react-use";
import { useFetchWithToken } from "../../components/FetchDataAPIs/FetchWithToken";
import { MetaContext } from "../../components/MetaDataContext/MetaDataProvider";

const Plans = () => {
  // Hooks
  const apiRequest = useApiRequest();
  const fetchWithToken = useFetchWithToken();
  const { shopName } = useContext(ShopifyContext);
  const { width, height } = useWindowSize();
  const { setIsSubscriptionActive } = useContext(MetaContext);

  // State
  const [planData, setPlanData] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState([]);
  const [planFeatures, setPlanFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(null);
  const [selectedViewPlan, setSelectedViewPlan] = useState("Monthly");
  const [showSwitchPlanModal, setShowSwitchPlanModal] = useState(false);
  const [pendingPlanId, setPendingPlanId] = useState(null);
  const [cancelPlanPopup, setCancelPlanPopup] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const handleCancelPlanPopup = () => {
    setCancelPlanPopup(true);
  }

  const toggleOpen = (id) => {
    setOpen(prev => (prev === id ? null : id));
  };

  const params = new URLSearchParams(window.location.search);
  const chargeId = params.get('charge_id');

  const fetchPlans = async () => {
    try {
      const url = `https://test-app.dotmagicinfotech.in/api/plans?shop=${shopName}`;
      const { status, data } = await apiRequest(url, 'GET');

      if (status) {
        setPlanData(data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const fetchSelectedPlans = async () => {
    try {
      const url = `https://test-app.dotmagicinfotech.in/api/selected_plan?shop=${shopName}`;
      const { status, data } = await apiRequest(url, 'GET');

      if (status) {
        setSelectedPlan(data);
        if (data?.planTime === "Life Time") {
          setSelectedViewPlan("Monthly");
        } else {
          setSelectedViewPlan(data?.planTime || "Monthly");
        }
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const fetchPlansFeatures = async () => {
    try {
      const url = `https://test-app.dotmagicinfotech.in/api/plan_features?shop=${shopName}`;
      const { status, data } = await apiRequest(url, 'GET');

      if (status) {
        setPlanFeatures(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const confirmSubscription = async () => {
    if (chargeId) {
      const url = `https://test-app.dotmagicinfotech.in/api/confirm_subscription?charge_id=${chargeId}&shop=${shopName}`;
      const result = await fetchWithToken({
        url: url,
        method: 'GET',
      });

      if (result.status) {
        fetchSelectedPlans();
        setShowCongrats(true);
        setIsSubscriptionActive(true);
      }
    }
  };

  const handleConfettiComplete = () => {
    setTimeout(() => {
      setShowModal(false);
    }, 500);
  };

  useEffect(() => {
    confirmSubscription();
    fetchPlans();
    fetchSelectedPlans();
    fetchPlansFeatures();
  }, []);

  const handleSelectPlan = async (id) => {
    try {
      shopify.loading(true);
      const url = `https://test-app.dotmagicinfotech.in/api/subscribe?plan_type=${selectedViewPlan}&plan_id=${id}&shop=${shopName}`;
      const { status, data } = await apiRequest(url, 'GET');

      if (status) {
        if (id === "1") {
          await handleCancelPlan(id);
        } else {
          setTimeout(() => {
            window.top.location.href = data.confirmationURL;
          }, 1000);
        }
      }
      shopify.loading(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      shopify.loading(false);
    }
  }

  const handleCancelPlan = async (id) => {
    setLoading(true);
    try {
      const url = `https://test-app.dotmagicinfotech.in/api/unsubscribe?id=${id}&shop=${shopName}`;
      const { status } = await apiRequest(url, 'GET');

      if (status) {
        shopify.toast.show("Plan cancelled successfully");
        fetchPlans();
        fetchSelectedPlans();
      } else {
        shopify.toast.show("Failed to cancel plan");
      }
    } catch (error) {
      shopify.toast.show("Something went wrong while cancelling the plan");
    } finally {
      setCancelPlanPopup(false);
      setLoading(false);
    }
  };

  const testimonials = [
    {
      name: "Virat Kohli",
      rating: 5,
      review:
        "Very impressed with the bundle wave app. We had been looking for a long time for an app that allowed the individual SKUs to pull into our inventory management system.",
    },
    {
      name: "Narendra Modi",
      rating: 4,
      review:
        "This app is a game-changer! It has helped streamline our processes and improve efficiency in a way we never imagined. Very impressed with the bundle wave app.",
    },
    {
      name: "Elon Musk",
      rating: 2,
      review:
        "Amazing experience using this app! The ease of customization and efficiency in tracking inventory is fantastic.",
    },
  ];

  const onPlanButtonClick = (planId) => {
    if (selectedPlan?.id && selectedPlan.id !== planId) {
      setPendingPlanId(planId);
      setShowSwitchPlanModal(true);
    } else {
      planId === selectedPlan?.id ? handleCancelPlanPopup() : handleSelectPlan(planId);
    }
  };

  const { lgDown } = useBreakpoints();
  const fixedFirstColumns = lgDown ? 2 : 0;

  const rows = Array.isArray(planFeatures)
    ? planFeatures.map((row, index) => [
      <p key={`label-${index}`}>{row.feature_name}</p>,
      <div key={`free-${index}`}>
        <Icon source={row.free === "1" ? CheckCircleIcon : XCircleIcon} tone={row.free === "1" ? "success" : "critical"} />
      </div>,
      <div key={`basic-${index}`}>
        <Icon source={row.growth === "1" ? CheckCircleIcon : XCircleIcon} tone={row.growth === "1" ? "success" : "critical"} />
      </div>,
      <div key={`pro-${index}`}>
        <Icon source={row.unlimited === "1" ? CheckCircleIcon : XCircleIcon} tone={row.unlimited === "1" ? "success" : "critical"} />
      </div>,
    ])
    : [];

  return (
    <>
      {showModal && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={700}
          gravity={0.3}
          tweenDuration={3000}
          onConfettiComplete={handleConfettiComplete}
        />
      )}

      <Page title="Current Plans">
        <Grid>
          {/* Left Column */}
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 4, xl: 4 }}>
            <div style={{ backgroundColor: "rgba(255, 255, 255, 1)", borderRadius: "10px", overflow: "hidden", height: "260px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", }}>
              <Box background={selectedPlan?.title ? "bg-fill-success" : "bg-fill-critical-active"} padding="300">
                <InlineStack gap="200">
                  <p style={{ fontSize: "1rem", fontWeight: "500", color: "white" }}>
                    {selectedPlan?.title ? selectedPlan?.title : "No Active"} Plan
                  </p>
                  {selectedPlan?.planTime &&
                    <p style={{ backgroundColor: "white", borderRadius: "10px", padding: "0px 10px", fontWeight: "500" }}>{selectedPlan?.planTime}</p>
                  }
                </InlineStack>
              </Box>

              <Box padding="200">
                <List>
                  {selectedPlan?.features && selectedPlan.features.length > 0 ? (
                    selectedPlan.features.map((feature, i) => (
                      <List.Item key={i}>
                        <Text variant="bodySm" fontWeight="medium">
                          {feature}
                        </Text>
                      </List.Item>
                    ))
                  ) : (
                    <List.Item>
                      <Text variant="bodySm" fontWeight="medium">
                        No features available
                      </Text>
                    </List.Item>
                  )}
                </List>
              </Box>
            </div>
          </Grid.Cell>

          {/* Right Column */}
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 8, xl: 8 }}>
            <div style={{ backgroundColor: "rgba(255, 255, 255, 1)", borderRadius: "10px", overflow: "hidden", height: "260px", padding: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", }}>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "10px", height: "100%", }}>
                <Box>
                  <Text as="h2" variant="headingMd" fontWeight="bold">
                    Reminder to cancel your subscription
                  </Text>
                  <p style={{ marginTop: "10px" }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam id nibh turpis. Vivamus in ullamcorper risus, non pharetra ligula. Proin cursus gravida diam eu porttitor. Morbi aliquam nunc fermentum nisl sagittis, at fermentum massa fermentum. Etiam et tortor sem. Donec mollis ex dolor, eget ullamcorper nisi ornare ac. Cras porttitor enim faucibus mauris tincidunt, a lobortis augue fermentum. Nulla ut gravida erat.
                  </p>
                </Box>

                <Box>
                  <hr style={{ margin: "10px -15px" }} />
                  <Text variant="bodyMd">
                    {selectedPlan?.trialDaysLeft === "Life Time"
                      ? "Life Time free trial"
                      : selectedPlan?.trialDaysLeft
                        ? `${selectedPlan.trialDaysLeft} day free trial`
                        : `${selectedPlan?.trialHoursLeft === 0 ? "" : `${selectedPlan?.trialHoursLeft}hr`} ${selectedPlan?.trialMinutesLeft === 0 ? "" : `${selectedPlan?.trialMinutesLeft}m`} Free trial left`}
                  </Text>

                  <Text variant="bodyMd" fontWeight="medium">
                    ${selectedPlan?.price}/
                    {selectedPlan?.planTime === "Yearly" ? "yr" : "mo"}{" "}
                    {selectedPlan?.title === "Free" ? "for" : "From"}{" "}
                    {selectedPlan?.createdAt
                      ?.split(" ")
                      .slice(0, 3)
                      .join(" ")}
                  </Text>
                </Box>
              </div>
            </div>
          </Grid.Cell>
        </Grid>
      </Page>

      {/* Subscription plans */}
      <Page
        title="Subscription plans"
        primaryAction={
          <div style={{ display: "flex", gap: "5px", backgroundColor: "#e1e1e1", padding: "5px", borderRadius: "6px", fontSize: "13px", transition: "background-color 0.3s ease" }}>
            <div
              onClick={() => setSelectedViewPlan("Monthly")}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "8px 8px",
                borderRadius: "6px",
                backgroundColor: selectedViewPlan === "Monthly" ? "#ffffff" : "transparent",
                color: selectedViewPlan === "Monthly" ? "#000" : "#333",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            >
              Monthly
            </div>
            <div
              onClick={() => setSelectedViewPlan("Yearly")}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "8px 8px",
                borderRadius: "6px",
                backgroundColor: selectedViewPlan === "Yearly" ? "#ffffff" : "transparent",
                color: selectedViewPlan === "Yearly" ? "#000" : "#333",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            >
              Yearly
              <span style={{ marginLeft: "6px", backgroundColor: "#b9f8ac", border: "1px solid #64c1aa", borderRadius: "4px", color: "#008060", fontSize: "11px", padding: "2px 4px" }}>
                Up to {planData[1]?.yearOfferDiscount}% OFF
              </span>
            </div>
          </div>
        }>
        <div style={{ margin: "1.5rem" }}></div>
        {loading ?
          <Grid>
            {[...Array(3)].map((_, index) => (
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }} key={index}>
                <div style={{
                  backgroundColor: "rgba(255, 255, 255, 1)", borderRadius: "10px", padding: "1rem",
                  border: "1px solid #ddd",
                  backgroundClip: "padding-box",
                  position: "relative"
                }}>
                  <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <SkeletonThumbnail size="extraSmall" />
                        <SkeletonTabs count={1} />
                      </div>
                      <div style={{ display: "flex", alignItems: "start" }}>
                        <SkeletonTabs count={1} />
                      </div>
                    </div>
                    <div style={{ margin: "-11px", padding: "0px 110px 0px 0px" }}>
                      <SkeletonTabs count={1} fitted />
                    </div>
                    <div style={{ margin: "20px 0px" }}>
                      <Divider />
                    </div>
                    <div>
                      <SkeletonDisplayText size="medium" />
                      <div style={{ margin: "-11px" }}>
                        <SkeletonTabs count={1} />
                      </div>
                    </div>
                    <div style={{ margin: "-11px", padding: "0px 110px 0px 0px" }}>
                      <SkeletonTabs count={1} fitted />
                    </div>
                    <div>
                      <SkeletonBodyText lines={6} />
                    </div>
                    <InlineGrid gap={200}>
                      <div style={{ backgroundColor: "rgba(227, 227, 227, 1)", height: "28px", width: "100%", borderRadius: "5px" }}></div>
                    </InlineGrid>
                  </div>
                </div>
              </Grid.Cell>
            ))}
          </Grid>
          :
          <Grid>
            {planData.map((plan, index) => (
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }} key={index}>
                <div style={{
                  backgroundColor: "rgba(255, 255, 255, 1)", borderRadius: "10px", padding: "1rem",
                  border: "1px solid #ddd",
                  backgroundClip: "padding-box",
                  position: "relative",
                  height: "100%",
                }}>
                  <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "30px" }}>
                          <p style={{ color: "black", fontSize: "1.5rem", fontWeight: "500" }}>{plan.title}</p>
                          {plan.price !== "0" && selectedViewPlan === "Yearly" && (
                            <div style={{ color: "white", backgroundColor: "black", borderRadius: "10px", padding: "5px 10px", fontSize: "0.8rem", fontWeight: "500" }}>
                              Save {plan?.yearOfferDiscount}%
                            </div>
                          )}
                        </div>
                        <p style={{ fontWeight: '600', fontSize: "1rem", marginTop: "10px" }}>Upto $1200 <span style={{ fontWeight: "400" }}>generated</span></p>
                      </div>
                      <div style={{ margin: "15px 0px" }}>
                        <Divider />
                      </div>
                      <div>
                        <p style={{ fontSize: "2.5rem", fontWeight: "600" }}>${selectedViewPlan === "Yearly" ? plan.yearPrice : plan.price}</p>
                        <p style={{ fontSize: "0.8rem", marginTop: "10px" }}>per {selectedViewPlan === "Yearly" ? "year" : "month"}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: "14px", fontWeight: "600", display: "flex" }}>
                          ${selectedViewPlan === "Yearly" ? plan.price : plan.yearPrice}/
                          {selectedViewPlan === "Yearly" ? (
                            "month"
                          ) : (
                            <>
                              year
                              {plan.price !== "0" &&
                                <div style={{ marginLeft: "5px" }}>
                                  <Badge tone="success">Save {plan?.yearOfferDiscount}%</Badge>
                                </div>
                              }
                            </>
                          )}
                        </span>
                      </div>
                      <div style={{ backgroundColor: "#e1e1e1", padding: "5px 8px", textAlign: "center", margin: "0px -16px 0px -16px", fontWeight: 500 }}>
                        {plan?.freeTrial === "0" ?
                          "Life Time Free" : `Start Your ${plan?.freeTrial}-Day Free Trial`}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                        {plan.features.map((feature, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                            <div>
                              <Icon source={CheckCircleIcon} tone="success" />
                            </div>
                            <span style={{ color: "rgb(79 79 79)", fontSize: "0.8rem", fontWeight: "500" }}>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ marginTop: "20px" }}>
                      <Button fullWidth disabled={plan.title === "Free" ? true : false} variant={index === 1 ? "primary" : "secondary"} onClick={() => onPlanButtonClick(plan.id)} loading={loading}>
                        {plan.id === selectedPlan?.id ? `Cancel ${plan.title}` : `Select ${plan.title}`}
                      </Button>
                    </div>
                  </div>
                  {index === 1 &&
                    <div style={{ position: 'absolute', top: "-24px", right: "0px", padding: "4px", width: "100%", backgroundColor: "black", borderRadius: "10px 10px 0px 0px" }} >
                      <p style={{ fontWeight: "500", color: "white", textAlign: "center" }}>Most Popular</p>
                    </div>
                  }
                </div>
              </Grid.Cell>
            ))}
          </Grid>
        }
      </Page>

      <Page title="FAQs">
        <Card>
          <InlineStack align="space-between">
            <div style={{ width: "70%", display: 'flex', flexDirection: "column", gap: "0.5rem" }}>
              <Card padding={0}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", cursor: "pointer" }} onClick={() => toggleOpen("1")}>
                  <Text as="p" variant="headingMd" fontWeight="medium">What’s the best plan for high-priced bundles?</Text>
                  <div style={{ cursor: "pointer" }}>
                    <Icon
                      source={open === "1" ? ChevronUpIcon : ChevronDownIcon}
                      tone="interactive"
                    />
                  </div>
                </div>
                <Collapsible
                  open={open === "1"}
                  id="basic-collapsible"
                  transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                  expandOnPrint
                >
                  <div style={{ padding: "0px 10px 10px 10px" }}>
                    <Text as="p" variant="bodySm" >For businesses with high Average Order Value (AOV), tailored payment is key. We're here to help you grow with customized plans designed to fit your unique needs. Contact us to discuss how we can best support your business.</Text>
                    <div style={{ marginTop: "10px" }}>
                      <Button>Talk to us</Button>
                    </div>
                  </div>
                </Collapsible>
              </Card>
              <Card padding={0}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", cursor: "pointer" }} onClick={() => toggleOpen("2")}>
                  <Text as="p" variant="headingMd" fontWeight="medium">Can I use the app for free?</Text>
                  <div style={{ cursor: "pointer" }}>
                    <Icon source={open === "2" ? ChevronUpIcon : ChevronDownIcon} tone='interactive' />
                  </div>
                </div>
                <Collapsible
                  open={open === "2"}
                  id="basic-collapsible"
                  transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                  expandOnPrint
                >
                  <div style={{ padding: "0px 10px 10px 10px" }}>
                    <Text as="p" variant="bodySm" >You can test the app for free within the 14-day trial on all plans. Moreover, development stores and test stores can access the app for free without approving any charges.</Text>
                  </div>
                </Collapsible>
              </Card>
              <Card padding={0}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", cursor: "pointer" }} onClick={() => toggleOpen("3")}>
                  <Text as="p" variant="headingMd" fontWeight="medium">Does the subscription fee automatically adjust based on my bundle sales?</Text>
                  <div style={{ cursor: "pointer" }}>
                    <Icon source={open === "3" ? ChevronUpIcon : ChevronDownIcon} tone='interactive' />
                  </div>
                </div>
                <Collapsible
                  open={open === "3"}
                  id="basic-collapsible"
                  transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                  expandOnPrint
                >
                  <div style={{ padding: "0px 10px 10px 10px" }}>
                    <Text as="p" variant="bodySm" >The subscription fee remains constant unless you explicitly approve changes. If you anticipate a decrease in sales, you can downgrade your plan accordingly. Conversely, if your sales exceed your plan's limit, you'll receive an email notification and can approve the upgrade.</Text>
                  </div>
                </Collapsible>
              </Card>
              <Card padding={0}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", cursor: "pointer" }} onClick={() => toggleOpen("4")}>
                  <Text as="p" variant="headingMd" fontWeight="medium">What if I want to change or cancel my plan?</Text>
                  <div style={{ cursor: "pointer" }}>
                    <Icon source={open === "4" ? ChevronUpIcon : ChevronDownIcon} tone='interactive' />
                  </div>
                </div>
                <Collapsible
                  open={open === "4"}
                  id="basic-collapsible"
                  transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                  expandOnPrint
                >
                  <div style={{ padding: "0px 10px 10px 10px" }}>
                    <Text as="p" variant="bodySm" >You can thoroughly test the app during the 14-day trial and cancel without any charges. After that, downgrades are prorated, but cancellations are not. Contact support to explore refund options.</Text>
                  </div>
                </Collapsible>
              </Card>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Card padding={0}>
                <div style={{ width: "250px" }}>
                  <Swiper
                    spaceBetween={20}
                    slidesPerView={1}
                    autoplay={{
                      delay: 3000,
                      disableOnInteraction: false,
                    }}
                    loop={true}
                    modules={[Autoplay]}
                  >
                    {testimonials.map((testimonial, i) => (
                      <SwiperSlide key={i}>
                        <div style={{ padding: "10px", width: "250px" }}>
                          <p style={{ fontSize: "1rem", fontWeight: "600" }}>
                            {testimonial.name}
                          </p>
                          <div style={{ display: "flex", marginTop: "10px" }}>
                            {[...Array(testimonial?.rating)].map((_, i) => (
                              <div key={i}>
                                <Icon source={StarFilledIcon} tone="success" />
                              </div>
                            ))}
                          </div>
                          <p style={{
                            lineHeight: "1.4",
                            color: "gray",
                            marginTop: "10px",
                            display: "-webkit-box",
                            WebkitLineClamp: 5,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}>
                            {testimonial.review}
                          </p>
                          <p style={{ fontWeight: "600", marginTop: "10px", color: "#333" }}>
                            Thank you!
                          </p>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </Card>
            </div>
          </InlineStack>
        </Card>
      </Page>

      {/* Compare features by plan */}
      <div style={{ paddingBottom: "25px" }}>
        <Page title="Compare features by plan"
          subtitle="Easily compare fetures across all available plans."
        >
          <LegacyCard>
            <DataTable
              columnContentTypes={[
                'text',
                'text',
                'text',
                'text',
              ]}
              headings={[
                <div style={{ textAlign: "start", width: "100%", color: "black", fontWeight: "500", fontSize: "1rem" }}>Feature</div>,
                <div style={{ textAlign: "center", width: "100%", color: "black", fontWeight: "500", fontSize: "1rem" }}>Free</div>,
                <div style={{ textAlign: "center", width: "100%", color: "black", fontWeight: "500", fontSize: "1rem" }}>Growth</div>,
                <div style={{ textAlign: "center", width: "100%", color: "black", fontWeight: "500", fontSize: "1rem" }}>Unlimited</div>,
              ]}
              rows={loading
                ? [...Array(3)].map(() => [
                  <SkeletonBodyText lines={1} width="100%" />,
                  <SkeletonBodyText lines={1} width="60%" />,
                  <SkeletonBodyText lines={1} width="60%" />,
                  <SkeletonBodyText lines={1} width="60%" />,
                ])
                : rows
              }
              defaultSortDirection="descending"
              initialSortColumnIndex={4}
              stickyHeader
              fixedFirstColumns={fixedFirstColumns}
            />
          </LegacyCard>
        </Page>
      </div>

      <Modal
        open={showSwitchPlanModal}
        onClose={() => setShowSwitchPlanModal(false)}
        title="Switch Plan"
        primaryAction={{
          content: "Switch",
          onAction: () => {
            handleSelectPlan(pendingPlanId);
            setShowSwitchPlanModal(false);
          }
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setShowSwitchPlanModal(false)
          }
        ]}
      >
        <Modal.Section>
          <Text as="p">
            You're about to switch to a different subscription plan. Do you want to continue?
          </Text>
        </Modal.Section>
      </Modal>

      <Modal
        open={cancelPlanPopup}
        onClose={() => setCancelPlanPopup(false)}
        title="Cancel Plan"
        primaryAction={{
          content: 'Confirm Cancel Plan',
          destructive: true,
          loading: loading,
          onAction: () => {
            handleCancelPlan(selectedPlan?.id);
          },
        }}
        secondaryActions={[
          {
            content: 'Keep Plan',
            onAction: () => setCancelPlanPopup(false),
          },
        ]}
      >
        <Modal.Section>
          <Text as="p">
            Are you sure you want to cancel your <strong>{selectedPlan?.title} plan?</strong> <br />
            You’ll lose access to premium features immediately. <br />
            You can upgrade again at any time.
          </Text>
        </Modal.Section>
      </Modal>

      {/* CongratsModal Modal */}
      <Modal
        open={showCongrats}
        onClose={() => setShowCongrats(false)}
        title="🎉 Congratulations!"
        primaryAction={{
          content: "Awesome! 🎉",
          onAction: () => {
            setShowCongrats(false);
            setShowModal(true);
          }
        }}
      >
        <Modal.Section>
          <p>
            You’ve successfully purchased the{" "}
            <strong>{selectedPlan?.title || "your"} plan</strong>. Let’s get growing! 🚀
          </p>
        </Modal.Section>
      </Modal>
    </>
  );
}

export default Plans