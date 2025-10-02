// React Imports
import { useContext, useEffect, useState } from "react";

// Shopify Component
import { Collapsible, Icon, RangeSlider, Text, Card, Grid, Banner, Select, Divider, InlineStack, Button, ButtonGroup, Badge } from "@shopify/polaris";
import { AdjustIcon, AppsFilledIcon, ButtonIcon, CaretDownIcon, CaretUpIcon, ChevronRightIcon, ColorIcon, DiscountIcon, ResetIcon, TextAlignCenterIcon, TextGrammarIcon, TextUnderlineIcon } from "@shopify/polaris-icons";

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
      applied_background_color: "#7a26bf",
      applied_fontColor: "#FFFFFF",
      unapplied_background_color: "#efefef",
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
      background_color: "#7a26bf",
      fontColor: "#ffffff"
    },
    button: {
      width: 100,
      height: 45,
      buttonColor: "#000000",
      textColor: "#ffffff",
    },
  });

  const fetchCustomizeData = async () => {
    try {
      const data = await fetchWithToken({
        url: `https://bundle-wave-backend.xavierapps.com/api/get_customize?shop=${shopName}&path=mixAndMatch`,
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
        width: data.button.width,
        height: data.button.height,
        buttonColor: data.button.buttonColor,
        textColor: data.button.textColor,
      },
    }

    const result = await fetchWithToken({
      url: `https://bundle-wave-backend.xavierapps.com/api/update_customize?path=mixAndMatch&shop=${shopName}`,
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
                        fontSize: `${10 + Number(data.title.fontSize ?? 0)}px`, fontWeight: "600", color: data.title.fontColor, textAlign:
                          data.title_alignment.alignment === "left"
                            ? "start"
                            : data.title_alignment.alignment === "center"
                              ? "center"
                              : "end"
                      }}>Mix and match - Product List</p>
                      <p style={{
                        fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight,
                        color: data.title.fontColor, textAlign:
                          data.title_alignment.alignment === "left"
                            ? "start"
                            : data.title_alignment.alignment === "center"
                              ? "center"
                              : "end"
                      }}>✨ Buy more, save more! Pick your favorite earrings and create a custom set while enjoying bigger discounts for multiple pairs.</p>
                      <div style={{ display: "flex", gap: "0.5rem", marginTop: "10px" }}>
                        <div style={{ backgroundColor: data.discount_options.applied_background_color, color: data.discount_options.applied_fontColor, borderRadius: "10px", display: "flex", flexDirection: "column", gap: "0.5rem", padding: "15px", width: "50%" }}>
                          <p style={{ fontWeight: "500", fontSize: '1.2rem', textAlign: "center" }}>2</p>
                          <p style={{ fontWeight: "500", fontSize: '1.2rem', textAlign: "center" }}>10% OFF</p>
                        </div>
                        <div style={{ backgroundColor: data.discount_options.unapplied_background_color, color: data.discount_options.unapplied_fontColor, borderRadius: "10px", display: "flex", flexDirection: "column", gap: "0.5rem", padding: "15px", width: "50%" }}>
                          <p style={{ fontWeight: "500", fontSize: '1.2rem', textAlign: "center" }}>3+</p>
                          <p style={{ fontWeight: "500", fontSize: '1.2rem', textAlign: "center" }}>10% OFF</p>
                        </div>
                      </div>
                      <div style={{ margin: "10px -20px" }}>
                        <Divider borderColor="border-hover" />
                      </div>
                      <div style={{ display: "flex", flexDirection: 'column', maxHeight: '400px', overflowY: "auto" }}>
                        {[{ name: "18k Fluid Lines Necklace", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-gold-fluid-lines-necklace.jpg?v=1758263767", price: "$45.00", oPrice: "$47.00" }, {
                          name: "18k Dangling Pendant Earrings", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-infinite-link-earrings---2_197e4e51-6b44-4e54-9244-d3666bc5b514.jpg?v=1758263763", price: "$22.00", oPrice: "25.00"
                        }, { name: "18k Dangling Obsidian Earrings", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-gold-limelight-sequin-motif-earrings.jpg?v=1758263767", price: "$25.00", oPrice: "$27.00" }].map((_, index) => (
                          <div key={index}>
                            <div style={{ borderRadius: `${data.border.borderRadius}px`, backgroundColor: data?.background?.background_type === "colored" ? BackGroundColor : "transparent" }}>
                              <div style={{ display: "flex", alignItems: "start", }}>
                                <img src={_?.image} style={{ width: "70px", height: "70px", objectFit: "fill", borderRadius: "8px" }} />
                                <div style={{ marginLeft: "10px", display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
                                  <p style={{ fontSize: `${data.title.fontSize}px`, color: data.title.fontColor, fontWeight: 600 }}>{_?.name}</p>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                    <div style={{ display: 'flex' }}>
                                      <p style={{ fontWeight: "600", fontSize: `${data.title.fontSize}px`, color: data.title.fontColor }}>+ {_?.price}</p>
                                      <p style={{ fontWeight: "600", fontSize: `${data.title.fontSize}px`, color: data.title.fontColor, opacity: 0.5, marginLeft: "3px", textDecoration: "line-through" }}>{_?.oPrice}</p>
                                    </div>
                                    <button style={{ backgroundColor: data.button.buttonColor, border: "none", color: data.button.textColor, fontSize: "15px", cursor: "pointer", borderRadius: "8px", padding: "5px 15px" }}>
                                      {index === 0 ? "Added" : "Add"}
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
                        <Divider borderColor="border-hover" />
                      </div>
                      <div style={{ backgroundColor: `#efefef`, display: "flex", justifyContent: "space-between", padding: "10px", borderRadius: "5px", width: "100%" }}>
                        <p style={{ fontWeight: "500", fontSize: `${data.title.fontSize}px`, color: data.title.fontColor }}>Total</p>
                        <p style={{ fontWeight: "500", fontSize: `${data.title.fontSize}px`, color: data.title.fontColor }}>$45.00</p>
                      </div>
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <button style={{
                          backgroundColor: `${data?.button?.buttonColor}`, border: "none", color: `${data?.button?.textColor}`, fontSize: `${data.title.fontSize}px`, fontWeight: "500", cursor: "pointer", borderRadius: "10px", width: `${data?.button?.width}%`, padding: `${data?.button?.height}px 5px`,
                        }}>Add to cart</button>
                      </div>
                    </div>
                    :
                    <div style={{
                      width: "500px", padding: "20px", border: `${data.border.borderWidth}px solid ${data.border.color}`, borderRadius: `${data.border.borderRadius}px`,
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
                        fontSize: '25px', fontWeight: "700", marginTop: '20px', marginBottom: "10px", color: data.title.fontColor, lineHeight: "normal", textAlign:
                          data.title_alignment.alignment === "left"
                            ? "start"
                            : data.title_alignment.alignment === "center"
                              ? "center"
                              : "end"
                      }}>Mix & Match - Earrings Collection</p>
                      <p style={{
                        fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight,
                        color: data.title.fontColor, textAlign:
                          data.title_alignment.alignment === "left"
                            ? "start"
                            : data.title_alignment.alignment === "center"
                              ? "center"
                              : "end"
                      }}>✨ Pick any 2 earrings from our curated collection and create your perfect mix & match set.<br />
                        If you want, I can also insert this directly into your React bundle component so it shows under the main title. Do you want me to do that?</p>
                      <div style={{ margin: "10px 0px" }}>
                        <Divider borderColor="border-hover" />
                      </div>
                      <InlineStack align='space-between' blockAlign='start'>
                        <p style={{ color: data.title.fontColor, fontSize: data.title.fontSize, fontWeight: "500" }}>Diamond Stud Earrings</p>
                        <div style={{ display: "flex", alignItems: "center", position: "relative", marginRight: "27px" }}>
                          {[{ image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-interlinked-earrings.jpg?v=1758263766" }, { image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-wire-bloom-earrings_afcace12-edfb-4c82-aba0-11462409947f.jpg?v=1758263758" }].map((_, index) => (
                            <div key={index} style={{
                              width: "40px", height: "40px", overflow: "hidden", left: index === 0 ? "0px" : "30px",
                              position: index === 0 ? "static" : "absolute"
                            }}>
                              <img src={_?.image} style={{ borderRadius: "50%", backgroundColor: "#f6f6f7", width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                          ))}
                        </div>
                      </InlineStack>
                      <div style={{ margin: "10px 0px", position: "relative" }}>
                        <Divider borderColor="border-hover" />
                        <div style={{
                          backgroundColor: `${data?.button?.buttonColor}`, border: "none", color: `${data?.button?.textColor}`, borderRadius: "50%", padding: "10px", width: "40px", height: "40px", display: 'flex', justifyContent: "center", alignItems: "center", left: "50%",
                          position: "absolute", transform: "translateX(-50%)", top: "-22px"
                        }}><p style={{ fontSize: "2rem", fontWeight: "600", marginBottom: "5px" }}>+</p></div>
                      </div>
                      <InlineStack align='space-between' blockAlign='start'>
                        <p style={{ color: data.title.fontColor, fontSize: data.title.fontSize, fontWeight: "500" }}>Pearl Dangle Earrings</p>
                        <div style={{ display: "flex", alignItems: "center", position: "relative", marginRight: "27px" }}>
                          {[{ image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-solid-bloom-earrings.jpg?v=1758263770" }, { image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-diamond-earrings_5e7739a0-261d-4788-96c9-ef77214aa70e.jpg?v=1758263764" }].map((_, index) => (
                            <div key={index} style={{
                              width: "40px", height: "40px", overflow: "hidden", left: index === 0 ? "0px" : "30px",
                              position: index === 0 ? "static" : "absolute"
                            }}>
                              <img src={_?.image} style={{ borderRadius: "50%", backgroundColor: "#f6f6f7", width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                          ))}
                        </div>
                      </InlineStack>
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <button style={{
                          backgroundColor: `${data?.button?.buttonColor}`, border: "none", color: `${data?.button?.textColor}`, fontSize: `${data.title.fontSize}px`, fontWeight: "500", cursor: "pointer", borderRadius: "10px", width: `${data?.button?.width}%`, padding: `${data?.button?.height}px 5px`, marginTop: "20px"
                        }}>Go to Bundle Builder</button>
                      </div>
                    </div>
                  }
                </>
              ) : data.selectDisplay.type === "product_page" ? (
                <>
                  {data.selectDisplay.structure === "tiered_discount" ?
                    <div style={{ display: "flex", gap: "1rem", padding: "40px", width: "100%" }}>
                      <div style={{ maxWidth: "400px" }}>
                        <img src='https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-gold-fluid-lines-necklace.jpg?v=1758263767' width="100%" style={{ borderRadius: "10px", objectFit: "cover" }} />
                        <div style={{ display: "flex", gap: "0.2rem" }}>
                          <img src='https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-infinite-link-earrings---2_197e4e51-6b44-4e54-9244-d3666bc5b514.jpg?v=1758263763' width="60px" height="60px" style={{ borderRadius: "10px" }} />
                          <img src='https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-gold-limelight-sequin-motif-earrings.jpg?v=1758263767' width="60px" height="60px" style={{ borderRadius: "10px" }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: "1rem", width: "50%" }}>
                        <p style={{ fontSize: '25px', fontWeight: "700", lineHeight: "normal" }}>Mix & Match Tiered Discount</p>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <p style={{ fontSize: '20px', fontWeight: "600" }}>Total Price</p>
                          <p style={{ fontSize: '20px', fontWeight: "600" }}>$92.00</p>
                        </div>
                        <Divider borderColor="border-hover" />
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
                            <div style={{ border: `${data.border.borderWidth}px solid ${data.border.color}`, padding: "10px", borderRadius: `${data.border.borderRadius}px` }}>
                              {[{ name: "18k Fluid Lines Necklace", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-gold-fluid-lines-necklace.jpg?v=1758263767", price: "$45.00" }, {
                                name: "18k Dangling Pendant Earrings", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-infinite-link-earrings---2_197e4e51-6b44-4e54-9244-d3666bc5b514.jpg?v=1758263763", price: "$22.00"
                              }, { name: "18k Dangling Obsidian Earrings", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-gold-limelight-sequin-motif-earrings.jpg?v=1758263767", price: "$25.00" }].map((_, index) => (
                                <div key={index}>
                                  <div style={{ display: "flex", alignItems: "center", }}>
                                    <img src={_?.image}
                                      style={{ width: "65px", height: "65px", objectFit: "fill", borderRadius: "10px" }}
                                    />
                                    <div style={{ marginLeft: "10px", display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
                                      <p style={{ fontSize: `${data.title.fontSize}px`, color: data.title.fontColor, fontWeight: data.title.fontWeight }}>{_?.name}</p>
                                      <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                        <p style={{ fontWeight: data.title.fontWeight, fontSize: `${data.title.fontSize}px`, color: data.title.fontColor }}>+ {_?.price}</p>
                                        <button style={{
                                          backgroundColor: data.button.buttonColor,
                                          border: "none",
                                          color: data.button.textColor,
                                          fontSize: "15px",
                                          cursor: "pointer",
                                          borderRadius: "8px",
                                          padding: "5px 15px",
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
                            <div style={{ backgroundColor: `#efefef`, display: "flex", justifyContent: "space-between", padding: "10px", borderRadius: "5px", width: "100%" }}>
                              <p style={{ fontWeight: "500", fontSize: `${data.title.fontSize}px`, color: data.title.fontColor }}>$0.00</p>
                              <p style={{ fontWeight: "500", fontSize: `${data.title.fontSize}px`, color: data.title.fontColor }}>No items added</p>
                            </div>
                          </div>
                          <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, marginTop: "10px" }}>✨ Buy more, save more! Pick your favorite earrings and create a custom set while enjoying bigger discounts for multiple pairs.</p>
                          <div style={{ display: "flex", justifyContent: "center" }}>
                            <button style={{
                              marginTop: "10px", backgroundColor: `${data.button.buttonColor}`, border: "none", color: `${data.button.textColor}`, fontSize: "15px", cursor: "pointer", borderRadius: "10px", width: `${data?.button?.width}%`, padding: `${data?.button?.height}px 5px`,
                            }}>Add to cart</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    :
                    <div style={{ display: "flex", justifyContent: "center", gap: "1rem", width: "100%" }}>
                      <div style={{ maxWidth: "400px" }}>
                        <img src='https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-interlinked-earrings.jpg?v=1758263766' width="100%" style={{ borderRadius: "10px", objectFit: "cover" }} />
                        <div style={{ display: "flex", gap: "0.2rem" }}>
                          <img src='https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-interlinked-earrings.jpg?v=1758263766' width="60px" height="60px" style={{ borderRadius: "10px" }} />
                          <img src='https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-wire-bloom-earrings_afcace12-edfb-4c82-aba0-11462409947f.jpg?v=1758263758' width="60px" height="60px" style={{ borderRadius: "10px" }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: "1rem", width: "400px" }}>
                        <p style={{ fontSize: '25px', fontWeight: "700", lineHeight: "normal", }}>Mix & Match - Earrings Collection</p>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <p style={{ fontSize: '20px', fontWeight: "600" }}>Total Price</p>
                          <p style={{ fontSize: '20px', fontWeight: "600" }}>$72.00</p>
                        </div>
                        <Divider borderColor="border-hover" />
                        <div style={{ backgroundColor: "white", width: "100%", height: "auto" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: '0.5rem' }}>
                            <div style={{ border: "1px solid black", padding: "10px", borderRadius: "10px" }}>
                              {[{ name: "Sterling Silver Stud Earrings", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-interlinked-earrings.jpg?v=1758263766", price: "$30.00" }, { name: "Rose Gold Drop Earrings", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-wire-bloom-earrings_afcace12-edfb-4c82-aba0-11462409947f.jpg?v=1758263758", price: "$42.00" }].map((_, index, arr) => (
                                <div key={index}>
                                  <div style={{ display: "flex", alignItems: "center", }}>
                                    <div>
                                      <Icon source={ChevronRightIcon} />
                                    </div>
                                    <img src={_?.image} width="60px" height="60px"
                                      style={{
                                        marginLeft: "10px", objectFit: "fill", borderRadius: "10px"
                                      }}
                                    />
                                    <div style={{ marginLeft: "10px", display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
                                      <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data?.title?.fontWeight, color: data.title.fontColor }}>{_?.name}</p>
                                      <p style={{ fontWeight: data?.title?.fontWeight, fontSize: `${data.title.fontSize}px`, color: data.title.fontColor }}>+ {_?.price}</p>
                                    </div>
                                  </div>
                                  {index !== arr.length - 1 && (
                                    <div style={{ margin: "10px -10px" }}>
                                      <Divider borderColor="border-hover" />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                            <div style={{ backgroundColor: `#efefef`, display: "flex", justifyContent: "space-between", padding: "10px", borderRadius: "5px", width: "100%" }}>
                              <p style={{ fontWeight: "500", fontSize: `${data.title.fontSize}px`, color: data.title.fontColor }}>$30.00</p>
                              <p style={{ fontWeight: "500", fontSize: `${data.title.fontSize}px`, color: data.title.fontColor }}>1 items added</p>
                            </div>
                          </div>
                        </div>
                        <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight }}>✨ Pick any 2 earrings from our curated collection and create your perfect mix & match set.<br />
                          If you want, I can also insert this directly into your React bundle component so it shows under the main title. Do you want me to do that?</p>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <button style={{
                            backgroundColor: `${data?.button?.buttonColor}`, border: "none", color: `${data?.button?.textColor}`, fontSize: "15px", cursor: "pointer", borderRadius: "10px", width: `${data?.button?.width}%`, padding: `${data?.button?.height}px 5px`,
                          }}>Add to cart</button>
                        </div>
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
