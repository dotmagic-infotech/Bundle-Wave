// React Imports
import { useContext, useEffect, useState } from "react";

// Shopify Component
import { Collapsible, Icon, RangeSlider, Text, Card, Grid, Banner, Select, Divider, InlineStack, Button, ButtonGroup, Badge } from "@shopify/polaris";
import { AdjustIcon, AppsFilledIcon, ButtonIcon, CaretDownIcon, CaretUpIcon, ChevronRightIcon, ColorIcon, DiscountIcon, ResetIcon, TextAlignCenterIcon, TextGrammarIcon, TextUnderlineIcon, VariantIcon } from "@shopify/polaris-icons";

// Custom Component
import ColorPickerPopover from "../../../components/ColorPicker/ColorPickerPopover";
import { useFetchWithToken } from "../../../components/FetchDataAPIs/FetchWithToken";
import { ShopifyContext } from "../../../components/ShopifyProvider/ShopifyProvider";

function Mixmatch() {

  // Hooks
  const fetchWithToken = useFetchWithToken();
  const { shopName } = useContext(ShopifyContext);

  // State
  const [openIndex, setOpenIndex] = useState(null);
  const [data, setData] = useState({
    selectDisplay: {
      structure: "single_discount",
      type: "product_page",
    },
    discount_options: {
      applied_background_color: "#459e7a",
      applied_fontColor: "#000000",
      unapplied_background_color: "#a44b4b",
      unapplied_fontColor: "#000000",
    },
    title_alignment: {
      alignment: "left"
    },
    background: {
      background_type: "transparent",
      background_color: "#ffffff",
    },
    title: {
      fontColor: "#000000",
      fontSize: 14,
      fontWeight: 400,
    },
    border: {
      color: "#000000",
      borderWidth: 2,
      borderRadius: 10,
    },
    badge_selectore: {
      alignment: "left",
      background_color: "#ff0000",
      fontColor: "#ffffff"
    },
    button: {
      buttonColor: "#000000",
      textColor: "#ffffff",
    },
  });

  const fetchCustomizeData = async () => {
    try {
      const data = await fetchWithToken({
        url: `https://test-app.dotmagicinfotech.in/api/get_customize?shop=${shopName}&path=mixAndMatch`,
        method: 'GET',
      });

      setData(data);
    } catch (error) {
      console.error("Failed to fetch bundle details:", error);
    }
  };

  useEffect(() => {
    fetchCustomizeData();
  }, []);

  const handleChangeValue = (section, key, value) => {
    setData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
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
      label: "Title alignment",
      icon: TextAlignCenterIcon,
      content: (
        <>
          <ButtonGroup variant="segmented" fullWidth>
            {["Left", "Center", "Right"].map((label, index) => {
              const value = label.toLowerCase();
              const isActive = data.title_alignment.alignment === value;

              return (
                <Button
                  key={index}
                  variant={isActive ? "primary" : "secondary"}
                  pressed={isActive}
                  onClick={() => handleChangeValue("title_alignment", "alignment", value)}
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
      label: "Background",
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
      label: "Title",
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
      title_alignment: {
        alignment: data.title_alignment.alignment
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
        buttonColor: data.button.buttonColor,
        textColor: data.button.textColor,
      },
    }

    const result = await fetchWithToken({
      url: `https://test-app.dotmagicinfotech.in/api/update_customize?path=mixAndMatch&shop=${shopName}`,
      method: 'POST',
      body: passData,
      isFormData: false,
    });

    if (result.status) {
      shopify.toast.show(`Update Successful Customization Mix and Match`);
    } else {
      shopify.toast.show(`Failed to Update Customization Mix and Match`);
    }
  }

  return (
    <Grid gap={100}>
      <Grid.Cell columnSpan={{ xs: 6, md: 6, lg: 4, xl: 4 }}>
        <Card padding={0}>
          <div style={{ padding: "8px", display: "flex", flexDirection: "column", gap: "5px" }}>
            {sections.map(({ label, content, icon, bedge }, index) => (
              <div key={index}>
                <div
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    padding: "8px",
                    backgroundColor:
                      openIndex === index ? "#EBEBEB" : "transparent",
                    borderRadius: "10px 10px 0px 0px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <Icon source={icon} />
                    <Text as="h6" fontWeight="medium">
                      {label}
                    </Text>
                  </div>
                  <div style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "1rem" }}>
                    {bedge &&
                      <Badge tone="new">{bedge}</Badge>
                    }
                    <Icon
                      source={openIndex === index ? CaretUpIcon : CaretDownIcon}
                    />
                  </div>
                </div>

                <Collapsible
                  open={openIndex === index}
                  transition={{
                    duration: "500ms",
                    timingFunction: "ease-in-out",
                  }}
                  expandOnPrint
                >
                  <div
                    style={{
                      padding: "12px 18px",
                      border: "1px solid #EBEBEB",
                      borderRadius: "0px 0px 10px 10px",
                    }}
                  >
                    {content}
                  </div>
                </Collapsible>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                cursor: "pointer",
                padding: "12px 20px 7px",
                margin: "0px -10px",
                borderTop: "1px solid #ebebeb"
              }}
              onClick={() => fetchCustomizeData()}
            >
              <Text as="h6" fontWeight="medium">
                Undo
              </Text>
              <div style={{ cursor: "pointer" }}>
                <Icon source={ResetIcon} />
              </div>
            </div>
          </div>
        </Card>
      </Grid.Cell>

      <Grid.Cell columnSpan={{ xs: 6, md: 6, lg: 8, xl: 8 }}>
        <div style={{ marginBottom: "1rem" }}>
          <Card>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Banner
                title="Preview uses sample content for layout demonstration. Your store's real data will appear after publishing."
                tone="warning"
              ></Banner>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem", }}>
              {data.selectDisplay.type === "included_product_page" ? (
                <>
                  {data.selectDisplay.structure === "tiered_discount" ?
                    <div style={{
                      width: "430px", padding: "20px", border: `${data.border.borderWidth}px solid ${data.border.color}`, borderRadius: `${data.border.borderRadius}px`,
                      backgroundColor: data?.background?.background_type === "colored" ? BackGroundColor : "transparent", display: "flex", flexDirection: "column", gap: '0.5rem'
                    }}>
                      <p style={{
                        marginTop: '10px', fontSize: `${10 + Number(data.title.fontSize ?? 0)}px`, fontWeight: "600", color: data.title.fontColor, textAlign:
                          data.title_alignment.alignment === "left"
                            ? "start"
                            : data.title_alignment.alignment === "center"
                              ? "center"
                              : "end"
                      }}>Mix and match - Product List</p>
                      <p style={{
                        color: data.title.fontColor, textAlign:
                          data.title_alignment.alignment === "left"
                            ? "start"
                            : data.title_alignment.alignment === "center"
                              ? "center"
                              : "end"
                      }}>A bundle with selectable products and discounts</p>
                      <div style={{ display: "flex", gap: "0.5rem", marginTop: "10px" }}>
                        <div style={{ backgroundColor: data.discount_options.applied_background_color, color: data.discount_options.applied_fontColor, borderRadius: "10px", opacity: "0.8", display: "flex", flexDirection: "column", gap: "0.5rem", padding: "15px", width: "50%" }}>
                          <p style={{ fontWeight: "500", fontSize: '1.2rem', textAlign: "center" }}>2</p>
                          <p style={{ fontWeight: "500", fontSize: '1.2rem', textAlign: "center" }}>10% OFF</p>
                        </div>
                        <div style={{ backgroundColor: data.discount_options.unapplied_background_color, color: data.discount_options.unapplied_fontColor, borderRadius: "10px", opacity: "0.8", display: "flex", flexDirection: "column", gap: "0.5rem", padding: "15px", width: "50%" }}>
                          <p style={{ fontWeight: "500", fontSize: '1.2rem', textAlign: "center" }}>3+</p>
                          <p style={{ fontWeight: "500", fontSize: '1.2rem', textAlign: "center" }}>10% OFF</p>
                        </div>
                      </div>
                      <div style={{ margin: "10px -20px" }}>
                        <Divider />
                      </div>
                      <div style={{ display: "flex", flexDirection: 'column', maxHeight: '400px', overflowY: "auto" }}>
                        {Array.from({ length: 3 }).map((_, index) => (
                          <div key={index}>
                            <div style={{ borderRadius: `${data.border.borderRadius}px`, backgroundColor: data?.background?.background_type === "colored" ? BackGroundColor : "transparent" }}>
                              <div style={{ display: "flex", alignItems: "start", }}>
                                <img src="https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ="
                                  style={{ width: "85px", height: "85px", objectFit: "fill", borderRadius: "8px" }}
                                />
                                <div style={{ marginLeft: "10px", display: "flex", flexDirection: "column", gap: "2.3rem", width: "100%" }}>
                                  <p style={{ fontSize: `${data.title.fontSize}px`, color: data.title.fontColor, fontWeight: 600 }}>Product #{index + 2}</p>
                                  <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                    <div style={{ display: 'flex' }}>
                                      <p style={{ fontWeight: "600", fontSize: `${data.title.fontSize}px`, color: data.title.fontColor }}>+ $20.00</p>
                                      <p style={{ fontWeight: "600", fontSize: `${data.title.fontSize}px`, color: data.title.fontColor, opacity: 0.5, marginLeft: "3px", textDecoration: "line-through" }}>$25.00</p>
                                    </div>
                                    <button style={{ backgroundColor: data.button.buttonColor, border: "none", color: data.button.textColor, fontSize: "15px", cursor: "pointer", borderRadius: "8px", padding: "2px 15px" }}>
                                      Add
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {index < 2 &&
                              <hr style={{ margin: "10px 0px" }} />
                            }
                          </div>
                        ))}
                      </div>
                      <div style={{ margin: "10px -20px" }}>
                        <Divider />
                      </div>
                      <div style={{ backgroundColor: `${data?.button?.buttonColor}50`, display: "flex", justifyContent: "space-between", padding: "10px", borderRadius: "5px", width: "100%" }}>
                        <p style={{ fontWeight: "500", fontSize: `${data.title.fontSize}px`, color: data.title.fontColor }}>Total</p>
                        <p style={{ fontWeight: "500", fontSize: `${data.title.fontSize}px`, color: data.title.fontColor }}>$0.00</p>
                      </div>
                      <button style={{
                        backgroundColor: `${data?.button?.buttonColor}`, border: "none", color: `${data?.button?.textColor}`, fontSize: `${data.title.fontSize}px`, fontWeight: "500", cursor: "pointer", borderRadius: "10px", padding: "12px", width: "100%", marginTop: "10px"
                      }}>Add to cart</button>
                      <p style={{ textAlign: "center" }}>
                        Powered by{" "}
                        <a style={{ color: `${data.button.buttonColor}`, textDecoration: "underline", cursor: "pointer", }}
                          href="https://dotmagicinfotech.com/"
                          target="_blank"
                        >
                          dotmagicinfotech
                        </a>
                      </p>
                    </div>
                    :
                    <div style={{
                      width: "430px", padding: "20px", border: `${data.border.borderWidth}px solid ${data.border.color}`, borderRadius: `${data.border.borderRadius}px`,
                      backgroundColor: data.background.background_type === "colored" ? data.background.background_color : "transparent", display: "flex", flexDirection: "column", gap: '0.2rem', position: "relative"
                    }}>
                      <div
                        style={{
                          width: "fit-content",
                          backgroundColor: data.badge_selectore.background_color,
                          color: data.badge_selectore.fontColor,
                          padding: "5px 8px",
                          borderRadius: "0px 0px 10px 10px",
                          position: "absolute",
                          top: "-1px",
                          left:
                            data.badge_selectore.alignment === "left"
                              ? "30px"
                              : data.badge_selectore.alignment === "center"
                                ? "50%"
                                : "unset",
                          right: data.badge_selectore.alignment === "right" ? "30px" : "unset",
                          transform:
                            data.badge_selectore.alignment === "center"
                              ? "translateX(-50%)"
                              : "none",
                          fontWeight: 600,
                        }}
                      >
                        Save 10%
                      </div>
                      <p style={{
                        marginTop: '20px', fontSize: `${10 + Number(data.title.fontSize ?? 0)}px`, fontWeight: "600", marginBottom: "10px", color: data.title.fontColor, textAlign:
                          data.title_alignment.alignment === "left"
                            ? "start"
                            : data.title_alignment.alignment === "center"
                              ? "center"
                              : "end"
                      }}>Mix and match - Product List</p>
                      <p style={{
                        color: data.title.fontColor, textAlign:
                          data.title_alignment.alignment === "left"
                            ? "start"
                            : data.title_alignment.alignment === "center"
                              ? "center"
                              : "end"
                      }}>A bundle with collection items</p>
                      <div style={{ margin: "10px 0px" }}>
                        <Divider />
                      </div>
                      <InlineStack align='space-between' blockAlign='start'>
                        <p style={{ color: data.title.fontColor, fontSize: data.title.fontSize, fontWeight: "500" }}>Collection #1</p>
                        <div style={{ display: "flex", alignItems: "center", position: "relative", marginRight: "27px" }}>
                          {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} style={{
                              width: "40px", height: "40px", overflow: "hidden", left: index === 0 ? "0px" : "30px",
                              position: index === 0 ? "static" : "absolute"
                            }}>
                              <img src="https://cdn.shopify.com/s/files/1/0839/1399/8619/files/ZenithElPrimeroChronomaster.jpg?v=1750136339" style={{ borderRadius: "50%", backgroundColor: "#f6f6f7", width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                          ))}
                        </div>
                      </InlineStack>
                      <div style={{ margin: "10px 0px", position: "relative" }}>
                        <Divider />
                        <div style={{
                          backgroundColor: `${data?.button?.buttonColor}`, border: "none", color: `${data?.button?.textColor}`, borderRadius: "50%", padding: "10px", width: "40px", height: "40px", display: 'flex', justifyContent: "center", alignItems: "center", left: "50%",
                          position: "absolute", transform: "translateX(-50%)", top: "-22px"
                        }}><p style={{ fontSize: "2rem", fontWeight: "600", marginBottom: "5px" }}>+</p></div>
                      </div>
                      <InlineStack align='space-between' blockAlign='start'>
                        <p style={{ color: data.title.fontColor, fontSize: data.title.fontSize, fontWeight: "500" }}>Collection #2</p>
                        <div style={{ display: "flex", alignItems: "center", position: "relative", marginRight: "27px" }}>
                          {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} style={{
                              width: "40px", height: "40px", overflow: "hidden", left: index === 0 ? "0px" : "30px",
                              position: index === 0 ? "static" : "absolute"
                            }}>
                              <img src="https://cdn.shopify.com/s/files/1/0839/1399/8619/files/71vRMHVXtiL._AC_SX679.jpg?v=1747905444" style={{ borderRadius: "50%", backgroundColor: "#f6f6f7", width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                          ))}
                        </div>
                      </InlineStack>
                      <button style={{
                        backgroundColor: `${data?.button?.buttonColor}`, border: "none", color: `${data?.button?.textColor}`, fontSize: `${data.title.fontSize}px`, fontWeight: "500", cursor: "pointer", borderRadius: "10px", padding: "12px", width: "100%", marginTop: "20px"
                      }}>Go to Bundle Builder</button>
                      <p style={{ textAlign: "center" }}>
                        Powered by{" "}
                        <a style={{ color: `${data.button.buttonColor}`, textDecoration: "underline", cursor: "pointer", }}
                          href="https://dotmagicinfotech.com/"
                          target="_blank"
                        >
                          dotmagicinfotech
                        </a>
                      </p>
                    </div>
                  }
                </>
              ) : data.selectDisplay.type === "product_page" ? (
                <>
                  {data.selectDisplay.structure === "tiered_discount" ?
                    <div style={{ display: "flex", gap: "1rem", backgroundColor: "#110f0f99", padding: "40px", width: "100%" }}>
                      <div style={{ width: "50%" }}>
                        <img src='https://cdn.shopify.com/s/files/1/0839/1399/8619/products/gift_card.png?v=1698129037' width="100%" height="350px" style={{ opacity: "0.5", borderRadius: "10px" }} />
                        <div style={{ display: "flex", gap: "0.2rem" }}>
                          <img src='https://cdn.shopify.com/s/files/1/0839/1399/8619/files/71vRMHVXtiL._AC_SX679.jpg?v=1747905444' width="60px" height="60px" style={{ opacity: "0.5", borderRadius: "10px" }} />
                          <img src='https://cdn.shopify.com/s/files/1/0839/1399/8619/files/ZenithElPrimeroChronomaster.jpg?v=1750136339' width="60px" height="60px" style={{ opacity: "0.5", borderRadius: "10px" }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: "1rem", width: "50%" }}>
                        <p style={{ fontSize: '25px', fontWeight: "700" }}>Bundle Title</p>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <p style={{ fontSize: '20px', fontWeight: "600" }}>Total Price</p>
                          <p style={{ fontSize: '20px', fontWeight: "600" }}>$156.00</p>
                        </div>
                        <Divider />
                        <div style={{ backgroundColor: "white", width: "100%", height: "auto", padding: '10px' }}>
                          <div style={{
                            borderRadius: `${data.border.borderRadius}px`, display: "flex", flexDirection: "column", gap: '0.5rem'
                          }}>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <div style={{ backgroundColor: data.discount_options.applied_background_color, color: data.discount_options.applied_fontColor, borderRadius: "10px", opacity: "0.8", display: "flex", flexDirection: "column", gap: "0.5rem", padding: "15px", width: "50%" }}>
                                <p style={{ fontWeight: "500", fontSize: '1.2rem', textAlign: "center" }}>2</p>
                                <p style={{ fontWeight: "500", fontSize: '1.2rem', textAlign: "center" }}>10% OFF</p>
                              </div>
                              <div style={{ backgroundColor: data.discount_options.unapplied_background_color, color: data.discount_options.unapplied_fontColor, borderRadius: "10px", opacity: "0.8", display: "flex", flexDirection: "column", gap: "0.5rem", padding: "15px", width: "50%" }}>
                                <p style={{ fontWeight: "500", fontSize: '1.2rem', textAlign: "center" }}>3+</p>
                                <p style={{ fontWeight: "500", fontSize: '1.2rem', textAlign: "center" }}>10% OFF</p>
                              </div>
                            </div>
                            <div style={{ border: `${data.border.borderWidth}px solid ${data.border.color}`, padding: "10px", borderRadius: `${data.border.borderRadius}px` }}>
                              {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index}>
                                  <div style={{ display: "flex", alignItems: "center", }}>
                                    <img src="https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ="
                                      style={{ width: "65px", height: "65px", objectFit: "fill" }}
                                    />
                                    <div style={{ marginLeft: "10px", display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
                                      <p style={{ fontSize: `${data.title.fontSize}px`, color: data.title.fontColor, fontWeight: data.title.fontWeight }}>Product #{index + 2}</p>
                                      <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                        <p style={{ fontWeight: data.title.fontWeight, fontSize: `${data.title.fontSize}px`, color: data.title.fontColor }}>+ $20.00</p>
                                        <button style={{
                                          backgroundColor: data.button.buttonColor,
                                          border: "none",
                                          color: data.button.textColor,
                                          fontSize: "15px",
                                          cursor: "pointer",
                                          borderRadius: "8px",
                                          padding: "2px 15px",
                                        }}>
                                          Add
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                  {index < 2 &&
                                    <hr style={{ margin: "10px 0px" }} />
                                  }
                                </div>
                              ))}
                            </div>
                            <div style={{ backgroundColor: `${data.button.buttonColor}50`, display: "flex", justifyContent: "space-between", padding: "10px", borderRadius: "5px", width: "100%" }}>
                              <p style={{ fontWeight: "500", fontSize: `${data.title.fontSize}px`, color: data.title.fontColor }}>$10.20</p>
                              <p style={{ fontWeight: "500", fontSize: `${data.title.fontSize}px`, color: data.title.fontColor }}>No items added</p>
                            </div>
                          </div>
                          <button style={{
                            marginTop: "10px",
                            backgroundColor: `${data.button.buttonColor}`,
                            border: "none",
                            color: `${data.button.textColor}`,
                            fontSize: "15px",
                            cursor: "pointer",
                            borderRadius: "10px",
                            padding: "8px",
                            width: "100%"
                          }}>Add to cart</button>
                        </div>
                      </div>
                    </div>
                    :
                    <div style={{ display: "flex", gap: "1rem", backgroundColor: "#110f0f99", padding: "40px", width: "100%" }}>
                      <div style={{ width: "50%" }}>
                        <img src='https://cdn.shopify.com/s/files/1/0839/1399/8619/products/gift_card.png?v=1698129037' width="100%" height="350px" style={{ opacity: "0.5", borderRadius: "10px" }} />
                        <div style={{ display: "flex", gap: "0.2rem" }}>
                          <img src='https://cdn.shopify.com/s/files/1/0839/1399/8619/files/71vRMHVXtiL._AC_SX679.jpg?v=1747905444' width="60px" height="60px" style={{ opacity: "0.5", borderRadius: "10px" }} />
                          <img src='https://cdn.shopify.com/s/files/1/0839/1399/8619/files/ZenithElPrimeroChronomaster.jpg?v=1750136339' width="60px" height="60px" style={{ opacity: "0.5", borderRadius: "10px" }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: "1rem", width: "50%" }}>
                        <p style={{ fontSize: '25px', fontWeight: "700" }}>Bundle Title</p>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <p style={{ fontSize: '20px', fontWeight: "600" }}>Total Price</p>
                          <p style={{ fontSize: '20px', fontWeight: "600" }}>$156.00</p>
                        </div>
                        <Divider />
                        <div style={{ backgroundColor: "white", width: "100%", height: "auto", padding: '10px' }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: '0.5rem' }}>
                            <div style={{ border: "1px solid black", padding: "10px", borderRadius: "10px" }}>
                              {Array.from({ length: 3 }).map((_, index, arr) => (
                                <div key={index}>
                                  <div style={{ display: "flex", alignItems: "center", }}>
                                    <div>
                                      <Icon source={ChevronRightIcon} />
                                    </div>
                                    <img src="https://cdn.shopify.com/s/files/1/0839/1399/8619/files/ElegantKanjivaramSilkSaree.jpg?v=1747916819" width="60px" height="60px"
                                      style={{
                                        marginLeft: "10px", objectFit: "fill", borderRadius: "10px"
                                      }}
                                    />
                                    <div style={{ marginLeft: "10px", display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
                                      <p style={{ fontSize: `${data.title.fontSize}px`, color: data.title.fontColor }}>Collection #{index + 2}</p>
                                      <p style={{ fontWeight: "600", fontSize: `${data.title.fontSize}px`, color: data.title.fontColor }}>+ $20.00</p>
                                    </div>
                                  </div>
                                  {index !== arr.length - 1 && (
                                    <div style={{ margin: "10px -10px" }}>
                                      <Divider />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                            <div style={{ backgroundColor: `#efefef`, display: "flex", justifyContent: "space-between", padding: "10px", borderRadius: "5px", width: "100%" }}>
                              <p style={{ fontWeight: "500", fontSize: `${data.title.fontSize}px`, color: data.title.fontColor }}>$10.20</p>
                              <p style={{ fontWeight: "500", fontSize: `${data.title.fontSize}px`, color: data.title.fontColor }}>No items added</p>
                            </div>
                          </div>
                        </div>
                        <button style={{
                          backgroundColor: "black",
                          border: "none",
                          color: "white",
                          fontSize: "15px",
                          cursor: "pointer",
                          borderRadius: "10px",
                          padding: "8px",
                          width: "100%"
                        }}>Add to cart</button>
                      </div>
                    </div>
                  }
                </>
              ) : null}
            </div>
            <div style={{ display: "flex", justifyContent: "end", padding: "10px 10px 0px", borderTop: "1px solid black", margin: "10px -16px 0px -16px" }}>
              <ButtonGroup>
                <Button>Cancel</Button>
                <Button variant="primary" onClick={handleSubmit}>Save</Button>
              </ButtonGroup>
            </div>
          </Card>
        </div>
      </Grid.Cell >
    </Grid >
  );
}

export default Mixmatch;
