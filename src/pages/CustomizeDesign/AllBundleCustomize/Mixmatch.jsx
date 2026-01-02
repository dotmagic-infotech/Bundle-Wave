// React Imports
import { useMemo, useState } from "react";

// Shopify Component
import { Collapsible, Icon, RangeSlider, Text, Card, Grid, Select, Divider, InlineStack, Button, ButtonGroup, Badge, Box, BlockStack } from "@shopify/polaris";
import { AdjustIcon, AppsFilledIcon, ButtonIcon, CaretDownIcon, CaretUpIcon, ChevronRightIcon, ColorIcon, DiscountIcon, ResetIcon, TextAlignCenterIcon, TextGrammarIcon, TextUnderlineIcon } from "@shopify/polaris-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Custom Component
import ColorPickerPopover from "../../../components/ColorPicker/ColorPickerPopover";
import { useFetchWithToken } from "../../../components/FetchDataAPIs/FetchWithToken";

const defaultData = {
  selectDisplay: { structure: "single_discount", type: "product_page" },
  discount_options: { applied_background_color: "#7a26bf", applied_fontColor: "#FFFFFF", unapplied_background_color: "#efefef", unapplied_fontColor: "#000000" },
  title_setting: { titleSize: 30, titleWeight: 600, alignment: "left" },
  background: { background_type: "transparent", background_color: "#ffffff" },
  title: { fontColor: "#000000", fontSize: 14, fontWeight: 400 },
  border: { color: "#000000", borderWidth: 2, borderRadius: 10 },
  badge_selectore: { alignment: "left", background_color: "#7a26bf", fontColor: "#ffffff" },
  button: { width: 100, height: 10, buttonColor: "#000000", textColor: "#ffffff", radius: 0 },
};

function Mixmatch() {

  // Hooks
  const fetchWithToken = useFetchWithToken();
  const queryClient = useQueryClient();

  // State
  const [openIndex, setOpenIndex] = useState(null);
  const [localData, setLocalData] = useState(null);

  const fetchCustomize = async () => {
    return await fetchWithToken({
      url: `https://bundle-wave-backend.xavierapps.com/api/get_customize?path=mixAndMatch`,
      method: "GET",
    });
  };

  const { data: apiData, isLoading, refetch } = useQuery({
    queryKey: ["customize", "mixAndMatch"],
    queryFn: fetchCustomize,
    staleTime: 0,
  });

  const data = useMemo(() => {
    return {
      ...defaultData,
      ...(apiData || {}),
      ...(localData || {}),
    };
  }, [apiData, localData]);

  const handleChangeValue = (section, key, value) => {
    setLocalData(prev => ({
      ...(prev ?? {}),
      [section]: {
        ...(prev?.[section] ?? data[section]),
        [key]: value,
      },
    }));
  };

  const updateCustomizeMutation = useMutation({
    mutationFn: async (payload) => {
      return await fetchWithToken({
        url: `https://bundle-wave-backend.xavierapps.com/api/update_customize?path=mixAndMatch`,
        method: "POST",
        body: payload,
        isFormData: false,
      });
    },
    onSuccess: (result) => {
      if (result?.status) {
        queryClient.invalidateQueries(["customize", "mixAndMatch"]);
        shopify.toast.show("Update Successful Customization Mix and Match Bundle");
        setLocalData(null);
      } else {
        shopify.toast.show("Failed to Update Customization Mix and Match Bundle");
      }
    },
    onError: () => {
      shopify.toast.show("Something went wrong");
    },
  });

  const handleSubmit = async () => {
    const passData = {
      selectDisplay: {
        structure: data.selectDisplay.structure,
        type: data.selectDisplay.type,
      },
      discount_options: {
        applied_background_color: data.discount_options.applied_background_color,
        applied_fontColor: data.discount_options.applied_fontColor,
        unapplied_background_color: data.discount_options.unapplied_background_color,
        unapplied_fontColor: data.discount_options.unapplied_fontColor,
      },
      title_setting: {
        alignment: data.title_setting.alignment,
        titleSize: data.title_setting.titleSize,
        titleWeight: data.title_setting.titleWeight,
      },
      background: {
        background_type: data.background.background_type,
        background_color: data.background.background_color,
      },
      title: {
        fontColor: data.title.fontColor,
        fontSize: data.title.fontSize,
        fontWeight: data.title.fontWeight,
      },
      border: {
        color: data.border.color,
        borderWidth: data.border.borderWidth,
        borderRadius: data.border.borderRadius,
      },
      badge_selectore: {
        alignment: data.badge_selectore.alignment,
        background_color: data.badge_selectore.background_color,
        fontColor: data.badge_selectore.fontColor
      },
      button: {
        width: data.button.width,
        height: data.button.height,
        radius: data.button.radius,
        buttonColor: data.button.buttonColor,
        textColor: data.button.textColor,
      },
    }

    updateCustomizeMutation.mutate(passData);
  }

  const handleUndo = () => {
    setLocalData(null);
    refetch();
  };

  const sections = [
    {
      label: "View Bundle",
      icon: AdjustIcon,
      content: (
        <>
          <Select
            label="Select Structure"
            options={[
              { label: "Single Discount", value: "single_discount" },
              { label: "Tiered Discount", value: "tiered_discount" },
            ]}
            value={data.selectDisplay.structure}
            onChange={(value) =>
              handleChangeValue("selectDisplay", "structure", value)
            }
          />
          <hr style={{ margin: "13px 0px", borderTop: "1px solid #DDDDDD" }} />
          <Select
            label="Select Display"
            options={[
              { label: "Product Page", value: "product_page" },
              {
                label: "Included Product Page",
                value: "included_product_page",
              },
            ]}
            value={data.selectDisplay.type}
            onChange={(value) =>
              handleChangeValue("selectDisplay", "type", value)
            }
          />
        </>
      ),
    },
    {
      label: "Title settings",
      icon: TextAlignCenterIcon,
      content: (
        <>
          <RangeSlider
            label="Font Size"
            min={10}
            max={40}
            value={data.title_setting?.titleSize}
            onChange={(value) => handleChangeValue("title_setting", "titleSize", value)}
            output
          />
          <hr style={{ margin: "13px 0px", borderTop: "1px solid #DDDDDD" }} />
          <RangeSlider
            label="Font Weight"
            min={100}
            max={900}
            step={100}
            value={data.title_setting?.titleWeight}
            onChange={(value) =>
              handleChangeValue("title_setting", "titleWeight", value)
            }
            output
          />
          <hr style={{ margin: "13px 0px", borderTop: "1px solid #DDDDDD" }} />
          <ButtonGroup variant="segmented" fullWidth>
            {["Left", "Center", "Right"].map((label, index) => {
              const value = label.toLowerCase();
              const isActive = data.title_setting.alignment === value;

              return (
                <Button
                  key={index}
                  variant={isActive ? "primary" : "secondary"}
                  pressed={isActive}
                  onClick={() => handleChangeValue("title_setting", "alignment", value)}
                >
                  {label}
                </Button>
              );
            })}
          </ButtonGroup>
        </>
      ),
    },
    {
      label: "Background (Included Product Page)",
      icon: ColorIcon,
      content: (
        <>
          <Select
            label="Select Background Type"
            options={[
              { label: "Transparent", value: "transparent" },
              { label: "Colored", value: "colored" },
            ]}
            value={data.background.background_type}
            onChange={(value) =>
              handleChangeValue("background", "background_type", value)
            }
          />
          {data.background.background_type === "colored" &&
            <>
              <hr style={{ margin: "13px 0px", borderTop: "1px solid #DDDDDD" }} />
              <ColorPickerPopover
                lable="Background Color"
                color={data.background.background_color}
                onChange={(color) => handleChangeValue("background", "background_color", color)}
              />
            </>
          }
        </>
      ),
    },
    {
      label: "Font settings",
      icon: TextGrammarIcon,
      content: (
        <>
          <ColorPickerPopover
            lable="Font color"
            color={data.title.fontColor}
            onChange={(color) => handleChangeValue("title", "fontColor", color)}
          />
          <hr style={{ margin: "13px 0px", borderTop: "1px solid #DDDDDD" }} />
          <RangeSlider
            label="Font Size"
            min={10}
            max={30}
            value={data.title.fontSize}
            onChange={(value) => handleChangeValue("title", "fontSize", value)}
            output
          />
          <hr style={{ margin: "13px 0px", borderTop: "1px solid #DDDDDD" }} />
          <RangeSlider
            label="Font Weight"
            min={100}
            max={900}
            step={100}
            value={data.title.fontWeight}
            onChange={(value) =>
              handleChangeValue("title", "fontWeight", value)
            }
            output
          />
        </>
      ),
    },
    {
      label: "Border",
      icon: TextUnderlineIcon,
      content: (
        <>
          <ColorPickerPopover
            lable="Border color"
            color={data.border.color}
            onChange={(color) => handleChangeValue("border", "color", color)}
          />
          <hr style={{ margin: "13px 0px", borderTop: "1px solid #DDDDDD" }} />
          <RangeSlider
            label="Border Width"
            min={1}
            max={10}
            value={data.border.borderWidth}
            onChange={(value) =>
              handleChangeValue("border", "borderWidth", value)
            }
            output
          />
          <hr style={{ margin: "13px 0px", borderTop: "1px solid #DDDDDD" }} />
          <RangeSlider
            label="Border Radius"
            min={1}
            max={50}
            value={data.border.borderRadius}
            onChange={(value) =>
              handleChangeValue("border", "borderRadius", value)
            }
            output
          />
        </>
      ),
    },
    {
      label: "Bedge selector",
      bedge: "Single Discount",
      icon: AppsFilledIcon,
      content: (
        <>
          <ButtonGroup variant="segmented" fullWidth>
            {["Left", "Center", "Right"].map((label, index) => {
              const value = label.toLowerCase();
              const isActive = data.badge_selectore.alignment === value;

              return (
                <Button
                  key={index}
                  variant={isActive ? "primary" : "secondary"}
                  pressed={isActive}
                  onClick={() => handleChangeValue("badge_selectore", "alignment", value)}
                >
                  {label}
                </Button>
              );
            })}
          </ButtonGroup>
          <hr style={{ margin: "13px 0px", borderTop: "1px solid #DDDDDD" }} />
          <ColorPickerPopover
            lable="Badge Color"
            color={data.badge_selectore.background_color}
            onChange={(color) =>
              handleChangeValue("badge_selectore", "background_color", color)
            }
          />
          <hr style={{ margin: "13px 0px", borderTop: "1px solid #DDDDDD" }} />
          <ColorPickerPopover
            lable="Badge Font Color"
            color={data.badge_selectore.fontColor}
            onChange={(color) =>
              handleChangeValue("badge_selectore", "fontColor", color)
            }
          />
        </>
      ),
    },
    {
      label: "Discount options",
      bedge: "Tiered Discount",
      icon: DiscountIcon,
      content: (
        <>
          <div>
            <Text as="h5" variant="headingMd">Applied options</Text>
            <ColorPickerPopover
              lable="Background color"
              color={data.discount_options.applied_background_color}
              onChange={(color) => handleChangeValue("discount_options", "applied_background_color", color)}
            />
            <ColorPickerPopover
              lable="Font color"
              color={data.discount_options.applied_fontColor}
              onChange={(color) => handleChangeValue("discount_options", "applied_fontColor", color)}
            />
          </div>
          <hr style={{ margin: "13px 0px", borderTop: "1px solid #DDDDDD" }} />
          <div style={{ marginTop: "10px" }}>
            <Text as="h5" variant="headingMd">Unapplied options</Text>
            <ColorPickerPopover
              lable="Background color"
              color={data.discount_options.unapplied_background_color}
              onChange={(color) => handleChangeValue("discount_options", "unapplied_background_color", color)}
            />
            <ColorPickerPopover
              lable="Font color"
              color={data.discount_options.unapplied_fontColor}
              onChange={(color) => handleChangeValue("discount_options", "unapplied_fontColor", color)}
            />
          </div>
        </>
      ),
    },
    {
      label: "Button",
      icon: ButtonIcon,
      content: (
        <>
          <RangeSlider
            label="Button Width"
            min={10}
            max={100}
            value={data?.button?.width}
            onChange={(value) =>
              handleChangeValue("button", "width", value)
            }
            output
          />
          <hr style={{ margin: "13px 0px", borderTop: "1px solid #DDDDDD" }} />
          <RangeSlider
            label="Button Height"
            min={10}
            max={100}
            value={data?.button?.height}
            onChange={(value) =>
              handleChangeValue("button", "height", value)
            }
            output
          />
          <hr style={{ margin: "13px 0px", borderTop: "1px solid #DDDDDD" }} />
          <RangeSlider
            label="Button Radius"
            min={0}
            max={30}
            value={data?.button?.radius}
            onChange={(value) =>
              handleChangeValue("button", "radius", value)
            }
            output
          />
          <hr style={{ margin: "13px 0px", borderTop: "1px solid #DDDDDD" }} />
          <ColorPickerPopover
            lable="Button color"
            color={data.button.buttonColor}
            onChange={(color) =>
              handleChangeValue("button", "buttonColor", color)
            }
          />
          <hr style={{ margin: "13px 0px", borderTop: "1px solid #DDDDDD" }} />
          <ColorPickerPopover
            lable="Text Color"
            color={data.button.textColor}
            onChange={(color) =>
              handleChangeValue("button", "textColor", color)
            }
          />
        </>
      ),
    },
  ];

  return (
    <Box style={{ marginBottom: "1rem" }}>
      <Grid gap={100}>
        <Grid.Cell columnSpan={{ xs: 6, md: 6, lg: 4, xl: 4 }}>
          <Card padding={"200"}>
            <BlockStack gap="100">
              {sections.map(({ label, content, icon }, index) => (
                <Box key={index}>
                  <Box
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      padding: "8px",
                      backgroundColor: openIndex === index ? "#EBEBEB" : "transparent",
                      borderRadius: "10px 10px 0px 0px",
                    }}
                  >
                    <Box style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                      <InlineStack gap="100" align="center">
                        <Icon source={icon} />
                        <Text as="h6" fontWeight="medium">
                          {label}
                        </Text>
                      </InlineStack>
                      <Box>
                        <Icon source={openIndex === index ? CaretUpIcon : CaretDownIcon} />
                      </Box>
                    </Box>
                  </Box>

                  <Collapsible
                    open={openIndex === index}
                    transition={{
                      duration: "500ms",
                      timingFunction: "ease-in-out",
                    }}
                    expandOnPrint
                  >
                    <Box style={{ padding: "12px 18px", border: "1px solid #EBEBEB", borderRadius: "0 0 10px 10px" }}>
                      {content}
                    </Box>
                  </Collapsible>
                </Box>
              ))}
              <Box className="bw_reset_btn">
                <Text as="h6" fontWeight="medium">
                  Undo
                </Text>
                <Box onClick={handleUndo}>
                  <Icon source={ResetIcon} />
                </Box>
              </Box>
            </BlockStack>
          </Card>
        </Grid.Cell>

        <Grid.Cell columnSpan={{ xs: 6, md: 6, lg: 8, xl: 8 }}>
          <Card padding={0}>
            <Box padding="300" borderBlockEndWidth="050" borderColor="border">
              <InlineStack align="end">
                <ButtonGroup>
                  <Button variant="primary" onClick={handleSubmit} loading={isLoading}>Save</Button>
                </ButtonGroup>
              </InlineStack>
            </Box>
            <Box style={{ display: "flex", justifyContent: "center", width: "100%", padding: "1rem" }}>
              {data.selectDisplay.type === "included_product_page" ? (
                <>
                  {data.selectDisplay.structure === "tiered_discount" ?
                    <Box style={{
                      border: `${data.border.borderWidth}px solid ${data.border.color}`, padding: "12px", borderRadius: `${data.border.borderRadius}px`, display: "flex", gap: "10px", flexDirection: "column", backgroundColor: data?.background?.background_type === "colored" ? data.background.background_color : "transparent", color: data.title.fontColor, flex: "1 1 320px", maxWidth: "500px", width: "100%"
                    }}>
                      <Text as="p" variant="headingLg" alignment={data.title_setting.alignment === "left" ? "start" : data.title_setting.alignment === "center" ? "center" : "end"}>
                        <p style={{ fontSize: `${data?.title_setting?.titleSize}px`, fontWeight: data?.title_setting?.titleWeight, lineHeight: "normal" }}>
                          Mix and match - Product List
                        </p>
                      </Text>

                      <Text as="p" variant="headingLg">
                        <span style={{
                          fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, lineHeight: "normal"
                        }}>
                          ✨ Buy more, save more! Pick your favorite earrings and create a custom set while enjoying bigger discounts for multiple pairs.
                        </span>
                      </Text>

                      <InlineStack gap="200" paddingBlockStart="200">
                        {[{ qty: "2", label: "10% OFF", applied: true }, { qty: "3+", label: "10% OFF", applied: false }].map((item, index) => {
                          const isApplied = item.applied;

                          return (
                            <Box
                              key={index}
                              style={{
                                backgroundColor: isApplied ? data.discount_options.applied_background_color : data.discount_options.unapplied_background_color,
                                color: isApplied ? data.discount_options.applied_fontColor : data.discount_options.unapplied_fontColor,
                                borderRadius: "10px",
                                padding: "15px",
                                flex: "1 1 0",
                              }}
                            >
                              <BlockStack gap="100" inlineAlignment="center">
                                <Text as="p" fontWeight="medium" variant="headingLg" alignment="center">
                                  {item.qty}
                                </Text>
                                <Text as="p" fontWeight="bold" variant="headingLg" alignment="center">
                                  {item.label}
                                </Text>
                              </BlockStack>
                            </Box>
                          );
                        })}
                      </InlineStack>

                      <Box style={{ margin: "0px -12px" }}>
                        <Divider borderColor="border-hover" />
                      </Box>

                      <BlockStack gap="300">
                        {[{ name: "18k Fluid Lines Necklace", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-gold-fluid-lines-necklace.jpg?v=1758263767", price: "$45.00", oPrice: "$47.00" }, { name: "18k Dangling Pendant Earrings", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-infinite-link-earrings---2_197e4e51-6b44-4e54-9244-d3666bc5b514.jpg?v=1758263763", price: "$22.00", oPrice: "25.00" }, { name: "18k Dangling Obsidian Earrings", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-gold-limelight-sequin-motif-earrings.jpg?v=1758263767", price: "$25.00", oPrice: "$27.00" }].map((_, index) => (
                          <BlockStack key={index} gap="300">
                            <InlineStack gap="300" align="start" wrap={false}>
                              <img src={_.image} width="70" height="70" style={{ flexShrink: 0 }} />
                              <Box style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
                                <Text as="p" variant="headingLg">
                                  <span style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, lineHeight: "normal" }}>
                                    {_?.name}
                                  </span>
                                </Text>

                                <InlineStack align="space-between">
                                  <Text as="p" variant="headingLg">
                                    <span style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, lineHeight: "normal" }}>
                                      {_?.price}
                                    </span>
                                  </Text>

                                  {index === 2 ? (
                                    <button style={{
                                      backgroundColor: data.button.buttonColor, border: "none", color: data.button.textColor, cursor: "pointer", borderRadius: "0.5rem", padding: "6px 1rem",
                                    }}>
                                      Add
                                    </button>
                                  ) : (
                                    <Box style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", backgroundColor: data.button.buttonColor, borderRadius: "0.5rem", padding: "6px" }}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={data?.button?.textColor} stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path></svg>

                                      <p style={{ fontWeight: "500", fontSize: "15px", margin: 0, lineHeight: "1", color: data.button.textColor }}>1</p>

                                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={data?.button?.textColor} stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                                    </Box>
                                  )}
                                </InlineStack>
                              </Box>
                            </InlineStack>
                            {index < 2 &&
                              <Divider borderColor="border-hover" />
                            }
                          </BlockStack>
                        ))}
                      </BlockStack>

                      <Box style={{ margin: "0px -12px" }}>
                        <Divider borderColor="border-hover" />
                      </Box>

                      <Box
                        padding="300"
                        borderRadius="200"
                        background="bg-surface-secondary"
                      >
                        <InlineStack align="space-between">
                          <Text as="p" fontWeight="medium" variant="bodyMd">
                            <span style={{ fontSize: `${data.title.fontSize}px`, color: data.title.fontColor }}>
                              $67.00
                            </span>
                          </Text>
                          <Text as="p" fontWeight="medium" variant="bodyMd">
                            <span style={{ fontSize: `${data.title.fontSize}px`, color: data.title.fontColor }}>
                              2 items added
                            </span>
                          </Text>
                        </InlineStack>
                      </Box>

                      <InlineStack align="center">
                        <button style={{
                          backgroundColor: `${data?.button?.buttonColor}`, border: "none", color: `${data?.button?.textColor}`, fontSize: "18px", fontWeight: "400", cursor: "pointer", width: `${data?.button?.width}%`, padding: `${data?.button?.height}px 5px`, borderRadius: `${data.button.radius}px`
                        }}>Add to cart</button>
                      </InlineStack>
                    </Box>
                    :
                    <Box style={{
                      width: "500px", padding: "20px", border: `${data.border.borderWidth}px solid ${data.border.color}`, borderRadius: `${data.border.borderRadius}px`, color: data.title.fontColor, backgroundColor: data.background.background_type === "colored" ? data.background.background_color : "transparent", display: "flex", flexDirection: "column", gap: '0.7rem', position: "relative"
                    }}>
                      <Box style={{
                        position: "absolute", top: "-10px",
                        left: data.badge_selectore.alignment === "left" ? "30px" : data.badge_selectore.alignment === "center" ? "50%" : "auto",
                        right: data.badge_selectore.alignment === "right" ? "30px" : "auto",
                        transform: data.badge_selectore.alignment === "center" ? "translateX(-50%)" : "none",
                        width: "130px",
                        height: "50px",
                        overflow: "hidden",
                      }}>
                        <Box
                          className="badge-ribbon badge-ribbon-top-right"
                          style={{
                            "--ribbon-bgcolor": data.badge_selectore.background_color,
                            "--ribbon-color": data.badge_selectore.fontColor,
                          }}
                        >
                          <Text as="span">Save 10%</Text>
                        </Box>
                      </Box>

                      <Text as="h3" alignment={data.title_setting.alignment === "left" ? "start" : data.title_setting.alignment === "center" ? "center" : "end"}>
                        <span style={{ fontSize: `${data.title_setting.titleSize}px`, fontWeight: data.title_setting.titleWeight, lineHeight: "normal" }}>
                          Mix & Match – Earrings Collection
                        </span>
                      </Text>

                      <Text as="h3" alignment={data.title_setting.alignment === "left" ? "start" : data.title_setting.alignment === "center" ? "center" : "end"}>
                        <span style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, lineHeight: "normal" }}>
                          ✨ Pick any 2 earrings from our curated collection and create your perfect mix & match set.<br />
                          If you want, I can also insert this directly into your React bundle component so it shows under the main title. Do you want me to do that?
                        </span>
                      </Text>

                      <Divider borderColor="border-hover" />

                      <InlineStack align='space-between' blockAlign='start'>
                        <BlockStack gap="100">
                          <Text as="p" fontWeight="medium">
                            <span style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight }}>
                              Diamond Stud Earrings
                            </span>
                          </Text>
                          <Text as="p">
                            <span
                              style={{ fontSize: `${data.title.fontSize - 2}px`, fontWeight: data.title.fontWeight, lineHeight: "1.4" }}
                            >
                              Elegant 18k diamond stud earrings Perfect<br /> for everyday luxury wear
                            </span>
                          </Text>
                        </BlockStack>

                        <InlineStack gap="100">
                          {["https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-interlinked-earrings.jpg?v=1758263766",
                            "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-wire-bloom-earrings_afcace12-edfb-4c82-aba0-11462409947f.jpg?v=1758263758",
                          ].map((img, i) => (
                            <Box
                              key={i}
                              style={{ width: "40px", height: "40px", marginLeft: i ? "-10px" : 0 }}
                            >
                              <img src={img} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", backgroundColor: "#f6f6f7" }} />
                            </Box>
                          ))}
                        </InlineStack>
                      </InlineStack>

                      <Box style={{ margin: "10px 0px", position: "relative" }}>
                        <Divider borderColor="border-hover" />

                        <Box style={{
                          backgroundColor: data?.button?.buttonColor, color: data?.button?.textColor, borderRadius: "50%", width: "40px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center", position: "absolute", left: "50%", top: "-20px", transform: "translateX(-50%)",
                        }}>
                          <span style={{ fontSize: "33px", fontWeight: 600, marginBottom: "7px" }}>+</span>
                        </Box>
                      </Box>

                      <InlineStack align='space-between' blockAlign='start'>
                        <BlockStack gap="100">
                          <Text as="p" fontWeight="medium">
                            <span style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight }}>
                              Pearl Dangle Earrings
                            </span>
                          </Text>
                          <Text as="p">
                            <span
                              style={{ fontSize: `${data.title.fontSize - 2}px`, fontWeight: data.title.fontWeight, lineHeight: "1.4" }}
                            >
                              Delicate pearl dangle earrings crafted in <br />18k rose gold
                              A refined statement for <br /> evenings and special occasions
                            </span>
                          </Text>
                        </BlockStack>

                        <InlineStack gap="100">
                          {["https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-solid-bloom-earrings.jpg?v=1758263770",
                            "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-diamond-earrings_5e7739a0-261d-4788-96c9-ef77214aa70e.jpg?v=1758263764",
                          ].map((img, i) => (
                            <Box
                              key={i}
                              style={{ width: "40px", height: "40px", marginLeft: i ? "-10px" : 0 }}
                            >
                              <img src={img} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", backgroundColor: "#f6f6f7" }} />
                            </Box>
                          ))}
                        </InlineStack>
                      </InlineStack>

                      <InlineStack align="center">
                        <button style={{
                          backgroundColor: `${data?.button?.buttonColor}`, border: "none", color: `${data?.button?.textColor}`, fontSize: `${data.title.fontSize}px`, fontWeight: "500", cursor: "pointer", width: `${data?.button?.width}%`, padding: `${data?.button?.height}px 5px`, borderRadius: `${data.button.radius}px`
                        }}>Go to Bundle Builder</button>
                      </InlineStack>
                    </Box>
                  }
                </>
              ) : data.selectDisplay.type === "product_page" ? (
                <>
                  {data.selectDisplay.structure === "tiered_discount" ?
                    <div style={{ display: "flex", justifyContent: "center", gap: "1rem", width: "100%" }}>
                      <div style={{ maxWidth: "400px" }}>
                        <img src='https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-gold-fluid-lines-necklace.jpg?v=1758263767' width="100%" />
                        <div style={{ display: "flex", gap: "0.2rem" }}>
                          <img src='https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-infinite-link-earrings---2_197e4e51-6b44-4e54-9244-d3666bc5b514.jpg?v=1758263763' width="80px" height="80px" />
                          <img src='https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-gold-limelight-sequin-motif-earrings.jpg?v=1758263767' width="80px" height="80px" />
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: "1rem", width: "50%", color: data.title.fontColor }}>
                        <p style={{ fontSize: '25px', fontWeight: "700", lineHeight: "normal" }}>Mix & Match Tiered Discount</p>
                        <div style={{ backgroundColor: "white", width: "100%", height: "auto" }}>
                          <div style={{
                            borderRadius: `${data.border.borderRadius}px`, display: "flex", flexDirection: "column", gap: '0.5rem'
                          }}>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <div style={{ backgroundColor: data.discount_options.applied_background_color, color: data.discount_options.applied_fontColor, borderRadius: "10px", display: "flex", flexDirection: "column", gap: "0.5rem", padding: "15px", width: "50%" }}>
                                <p style={{ fontWeight: "500", fontSize: '1.2rem', textAlign: "center" }}>2</p>
                                <p style={{ fontWeight: "500", fontSize: '1.2rem', textAlign: "center" }}>10% OFF</p>
                              </div>
                              <div style={{ backgroundColor: data.discount_options.unapplied_background_color, color: data.discount_options.unapplied_fontColor, borderRadius: "10px", display: "flex", flexDirection: "column", gap: "0.5rem", padding: "15px", width: "50%" }}>
                                <p style={{ fontWeight: "500", fontSize: '1.2rem', textAlign: "center" }}>3+</p>
                                <p style={{ fontWeight: "500", fontSize: '1.2rem', textAlign: "center" }}>30% OFF</p>
                              </div>
                            </div>
                            <div>
                              {[{ name: "18k Fluid Lines Necklace", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-gold-fluid-lines-necklace.jpg?v=1758263767", price: "$45.00" }, {
                                name: "18k Dangling Pendant Earrings", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-infinite-link-earrings---2_197e4e51-6b44-4e54-9244-d3666bc5b514.jpg?v=1758263763", price: "$22.00"
                              }, { name: "18k Dangling Obsidian Earrings", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-gold-limelight-sequin-motif-earrings.jpg?v=1758263767", price: "$25.00" }].map((_, index) => (
                                <div key={index}>
                                  <div style={{ display: "flex", alignItems: "center", }}>
                                    <img src={_?.image} style={{ width: "65px", height: "65px", objectFit: "fill" }} />
                                    <div style={{ marginLeft: "10px", display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
                                      <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight }}>{_?.name}</p>
                                      <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                        <p style={{ fontWeight: data.title.fontWeight, fontSize: `${data.title.fontSize}px` }}>{_?.price}</p>
                                        {index === 2 ? (
                                          <button style={{
                                            backgroundColor: data.button.buttonColor, border: "none", color: data.button.textColor, cursor: "pointer", borderRadius: "0.5rem", padding: "6px 1rem",
                                          }}>
                                            Add
                                          </button>
                                        ) : (
                                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", backgroundColor: data.button.buttonColor, borderRadius: "0.5rem", padding: "6px" }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={data?.button?.textColor} stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path></svg>

                                            <p style={{ fontWeight: "500", fontSize: "15px", margin: 0, lineHeight: "1", color: data.button.textColor }}>1</p>

                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={data?.button?.textColor} stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {index < 2 &&
                                    <hr style={{ margin: "10px 0px" }} />
                                  }
                                </div>
                              ))}
                            </div>
                            <div style={{ backgroundColor: `#efefef`, display: "flex", justifyContent: "space-between", padding: "10px", borderRadius: "5px", width: "100%" }}>
                              <p style={{ fontWeight: "500", fontSize: `${data.title.fontSize}px`, color: "black" }}>$67.00 - 20% OFF</p>
                              <p style={{ fontWeight: "500", fontSize: `${data.title.fontSize}px`, color: "black" }}>2 items added</p>
                            </div>
                          </div>
                          <div style={{ display: "flex", justifyContent: "center" }}>
                            <button style={{
                              marginTop: "10px", backgroundColor: `${data.button.buttonColor}`, border: "none", color: `${data.button.textColor}`, fontSize: "18px", fontWeight: "400", cursor: "pointer", width: `${data?.button?.width}%`, padding: `${data?.button?.height}px 5px`, borderRadius: `${data.button.radius}px`
                            }}>Add to cart</button>
                          </div>
                          <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, marginTop: "10px" }}>✨ Buy more, save more! Pick your favorite earrings and create a custom set while enjoying bigger discounts for multiple pairs.</p>
                        </div>
                      </div>
                    </div>
                    :
                    <div style={{ display: "flex", justifyContent: "center", gap: "1rem", width: "100%" }}>
                      <div style={{ maxWidth: "400px" }}>
                        <img src='https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-interlinked-earrings.jpg?v=1758263766' width="100%" />
                        <div style={{ display: "flex", gap: "0.2rem" }}>
                          <img src='https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-interlinked-earrings.jpg?v=1758263766' width="80px" height="80px" />
                          <img src='https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-wire-bloom-earrings_afcace12-edfb-4c82-aba0-11462409947f.jpg?v=1758263758' width="80px" height="80px" />
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: "1rem", width: "400px", color: data.title.fontColor }}>
                        <p style={{ fontSize: '25px', fontWeight: "700", lineHeight: "normal", }}>Mix & Match - Earrings Collection</p>
                        <div style={{ backgroundColor: "white", width: "100%", height: "auto" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: '0.5rem' }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderRadius: "10px" }}>
                              {[{ name: "Sterling Silver Stud Earrings", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-interlinked-earrings.jpg?v=1758263766", price: "$30.00" }, { name: "Rose Gold Drop Earrings", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-wire-bloom-earrings_afcace12-edfb-4c82-aba0-11462409947f.jpg?v=1758263758", price: "$42.00" }].map((_, index, arr) => (
                                <div key={index} style={{ border: `${data?.border?.borderWidth}px solid ${data?.border?.color}`, borderRadius: `${data?.border?.borderRadius}px`, padding: "5px" }}>
                                  <div style={{ display: "flex", alignItems: "center", }}>
                                    <div>
                                      <Icon source={ChevronRightIcon} />
                                    </div>
                                    <img src={_?.image} width="60px" height="60px" style={{ marginLeft: "10px", objectFit: "fill" }} />
                                    <div style={{ marginLeft: "10px", display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
                                      <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data?.title?.fontWeight }}>{_?.name}</p>
                                      <p style={{ fontWeight: data?.title?.fontWeight, fontSize: `${data.title.fontSize}px` }}>{_?.price}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div style={{ backgroundColor: `#efefef`, display: "flex", justifyContent: "space-between", padding: "10px", borderRadius: "5px", width: "100%" }}>
                              <p style={{ fontWeight: "500", fontSize: `${data.title.fontSize}px` }}>$30.00</p>
                              <p style={{ fontWeight: "500", fontSize: `${data.title.fontSize}px` }}>1 items added</p>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <button style={{
                            backgroundColor: `${data?.button?.buttonColor}`, border: "none", color: `${data?.button?.textColor}`, fontSize: "18px", fontWeight: "400", cursor: "pointer", width: `${data?.button?.width}%`, padding: `${data?.button?.height}px 5px`, borderRadius: `${data.button.radius}px`
                          }}>Add to cart | Save 20%</button>
                        </div>
                        <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight }}>✨ Pick any 2 earrings from our curated collection and create your perfect mix & match set.<br />
                          If you want, I can also insert this directly into your Bundle Wave component so it shows under the main title. Do you want me to do that?</p>
                      </div>
                    </div>
                  }
                </>
              ) : null}
            </Box>
          </Card>
        </Grid.Cell>
      </Grid>
    </Box>
  );
}

export default Mixmatch;
