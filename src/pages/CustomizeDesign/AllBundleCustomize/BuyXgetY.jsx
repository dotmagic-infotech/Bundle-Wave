// React Imports
import { useContext, useEffect, useState } from "react";

// Shopify Component
import { Collapsible, Icon, RangeSlider, Text, Card, Grid, Banner, ButtonGroup, Button, Select, Divider } from "@shopify/polaris";
import { AdjustIcon, ButtonIcon, CaretDownIcon, CaretUpIcon, ColorIcon, ResetIcon, TextGrammarIcon, TextUnderlineIcon, VariantIcon } from "@shopify/polaris-icons";

// Custom Component
import ColorPickerPopover from "../../../components/ColorPicker/ColorPickerPopover";
import { useFetchWithToken } from "../../../components/FetchDataAPIs/FetchWithToken";
import { ShopifyContext } from "../../../components/ShopifyProvider/ShopifyProvider";
import VariantItems from "../../../components/VariantItems/VariantItems";

function BuyXgetY() {

  // Hooks
  const fetchWithToken = useFetchWithToken();
  const { shopName } = useContext(ShopifyContext);

  // State
  const [openIndex, setOpenIndex] = useState(null);
  const [data, setData] = useState({
    selectDisplay: {
      type: "main_product_page",
    },
    title: {
      fontColor: "#000000",
      fontSize: 14,
      fontWeight: 400,
    },
    background: {
      background_type: "transparent",
      background_color: "#FFFFFF",
    },
    border: {
      color: "#000000",
      borderWidth: 1,
      borderRadius: 10,
    },
    variants: {
      selection_mode: "selected",
      type: "color_swatch",
      background_color: "#FFFFFF",
      text_color: "#000000",
      border_color: "#7a26bf",
      unselected_background_color: "#FFFFFF",
      unselected_text_color: "#000000",
      unselected_border_color: "#000000",
    },
    button: {
      width: 100,
      height: 10,
      buttonColor: "#7a26bf",
      textColor: "#FFFFFF",
    },
  });

  const fetchCustomizeData = async () => {
    try {
      const data = await fetchWithToken({
        url: `https://bundle-wave-backend.xavierapps.com/api/get_customize?shop=${shopName}&path=buyXgetY`,
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
            label="Select Display"
            options={[
              { label: "Product page", value: "main_product_page" },
              { label: "Included Product Page", value: "include_product_page" },
            ]}
            value={data?.selectDisplay?.type}
            onChange={(value) =>
              handleChangeValue("selectDisplay", "type", value)
            }
          />
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
            value={data?.background?.background_type}
            onChange={(value) =>
              handleChangeValue("background", "background_type", value)
            }
          />
          {data?.background?.background_type === "colored" &&
            <>
              <hr style={{ margin: "13px 0px", borderTop: "1px solid #DDDDDD" }} />
              <ColorPickerPopover
                lable="Background Color"
                color={data?.background?.background_color}
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
            max={5}
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
            max={30}
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
      label: "Variant selector",
      icon: VariantIcon,
      content: (
        <>
          <Select
            label="Select Variant Type"
            options={[
              { label: "Color Swatch", value: "color_swatch" },
              { label: "Dropdown", value: "dropdown" },
            ]}
            value={data?.variants?.type}
            onChange={(value) => {
              handleChangeValue("variants", "type", value);
              if (value === "color_swatch") {
                handleChangeValue("variants", "selection_mode", "selected")
              }
            }}
          />
          {data?.variants?.type === "color_swatch" &&
            <>
              <hr style={{ margin: "13px 0px", borderTop: "1px solid #DDDDDD" }} />
              <ButtonGroup variant="segmented" fullWidth>
                {["Selected", "Not Selected"].map((label, index) => {
                  const value = label.toLowerCase();
                  const isActive = data?.variants?.selection_mode === value;

                  return (
                    <Button
                      key={index}
                      variant={isActive ? "primary" : "secondary"}
                      pressed={isActive}
                      onClick={() => handleChangeValue("variants", "selection_mode", value)}
                    >
                      {label}
                    </Button>
                  );
                })}
              </ButtonGroup>
            </>
          }
          {(data?.variants?.type === "color_swatch" && data?.variants?.selection_mode === "selected") && (
            <div style={{ marginTop: "10px" }}>
              <ColorPickerPopover
                lable="Background Color"
                color={data?.variants?.background_color}
                onChange={(color) =>
                  handleChangeValue("variants", "background_color", color)
                }
              />
              <hr style={{ margin: "13px 0px", borderTop: "1px solid #DDDDDD" }} />
              <ColorPickerPopover
                lable="Text Color"
                color={data.variants.text_color}
                onChange={(color) =>
                  handleChangeValue("variants", "text_color", color)
                }
              />
              <hr style={{ margin: "13px 0px", borderTop: "1px solid #DDDDDD" }} />
              <ColorPickerPopover
                lable="Border Color"
                color={data.variants?.border_color}
                onChange={(color) =>
                  handleChangeValue("variants", "border_color", color)
                }
              />
            </div>
          )}
          {(data?.variants?.type === "color_swatch" && data?.variants?.selection_mode === "not selected") && (
            <>
              <div style={{ marginTop: "10px" }}>
                <ColorPickerPopover
                  lable="Background Color"
                  color={data?.variants?.unselected_background_color}
                  onChange={(color) =>
                    handleChangeValue("variants", "unselected_background_color", color)
                  }
                />
                <hr style={{ margin: "13px 0px", borderTop: "1px solid #DDDDDD" }} />
                <ColorPickerPopover
                  lable="Text Color"
                  color={data.variants?.unselected_text_color}
                  onChange={(color) =>
                    handleChangeValue("variants", "unselected_text_color", color)
                  }
                />
                <hr style={{ margin: "13px 0px", borderTop: "1px solid #DDDDDD" }} />
                <ColorPickerPopover
                  lable="Border Color"
                  color={data.variants?.unselected_border_color}
                  onChange={(color) =>
                    handleChangeValue("variants", "unselected_border_color", color)
                  }
                />
              </div>
            </>
          )}
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
        type: data?.selectDisplay.type,
      },
      title: {
        fontColor: data.title.fontColor,
        fontSize: data.title.fontSize,
        fontWeight: data.title.fontWeight,
      },
      background: {
        background_type: data?.background?.background_type,
        background_color: data?.background?.background_color,
      },
      border: {
        color: data.border.color,
        borderWidth: data.border.borderWidth,
        borderRadius: 10,
      },
      variants: {
        type: data.variants.type,
        background_color: data.variants?.background_color,
        text_color: data.variants.text_color,
        border_color: data.variants?.border_color,
        unselected_background_color: data.variants?.unselected_background_color,
        unselected_text_color: data.variants.unselected_text_color,
        unselected_border_color: data.variants?.unselected_border_color
      },
      button: {
        width: data.button.width,
        height: data.button.height,
        buttonColor: data?.button?.buttonColor,
        textColor: data?.button?.textColor,
      },
    }

    const result = await fetchWithToken({
      url: `https://bundle-wave-backend.xavierapps.com/api/update_customize?path=buyXgetY&shop=${shopName}`,
      method: 'POST',
      body: passData,
      isFormData: false,
    });

    if (result.status) {
      shopify.toast.show(`Update Successful Customization Buy X Get Y`);
    } else {
      shopify.toast.show(`Failed to Update Customization Buy X Get Y`);
    }
  }

  const products = [
    {
      name: "18k Pedal Ring", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-rose-ring.jpg?v=1758263771", price: "$45.00",
      variant: [
        {
          color: ["#b76e79", "#c0c0c0", "#ffd700"],
          size: ["J 1/2", "L 1/2", "N 1/2"]
        }
      ],
    },
    { name: "18k Dangling Pendant Earrings", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-gold-dangling-pendant-earrings_17e71027-81d8-4a49-a455-2e5c205963ee.jpg?v=1758263763", price: "$22.00", color: ["#c0c0c0", "#ffd700"] },
  ];

  return (
    <Grid gap={100}>
      <Grid.Cell columnSpan={{ xs: 6, md: 6, lg: 4, xl: 4 }}>
        <Card padding={0}>
          <div
            style={{
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            {sections.map(({ label, content, icon }, index) => (
              <div key={index}>
                <div
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
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
                  <div style={{ cursor: "pointer" }}>
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
            <div style={{ display: "flex", justifyContent: "end", padding: "0px 10px 10px", borderBottom: "1px solid black", margin: "0px -16px 10px -16px" }}>
              <ButtonGroup>
                <Button>Cancel</Button>
                <Button variant="primary" onClick={handleSubmit}>Save</Button>
              </ButtonGroup>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Banner
                title="Preview uses sample content for layout demonstration. Your store's real data will appear after publishing."
                tone="warning"
              ></Banner>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1rem",
                backgroundColor: "transparent",
              }}
            >
              {data?.selectDisplay?.type === "main_product_page" ? (
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ maxWidth: "400px" }}>
                    <img src="https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-rose-ring.jpg?v=1758263771" width="100%" />
                    <div style={{ display: "flex", gap: "0.2rem" }}>
                      <img src="https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-rose-ring.jpg?v=1758263771" width="80px" height="80px" />
                      <img src="https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-gold-dangling-pendant-earrings_17e71027-81d8-4a49-a455-2e5c205963ee.jpg?v=1758263763" width="80px" height="80px" />
                      <img src="https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-bloom-pendant.jpg?v=1758263772" width="80px" height="80px" />
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "400px", }}>
                    <p style={{ fontSize: "25px", fontWeight: "700", lineHeight: "normal" }}>🎁 Buy 2 Earrings Bundle</p>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <p style={{ fontSize: "20px", fontWeight: "600" }}>Total Price</p>
                      <p style={{ fontSize: "20px", fontWeight: "600" }}>$67.00</p>
                    </div>
                    <Divider borderColor="border-hover" />
                    <div style={{ backgroundColor: "white", width: "100%", height: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div style={{ border: `${data?.border?.borderWidth}px solid ${data?.border?.color}`, padding: "10px", borderRadius: `${data?.border?.borderRadius}px` }}>
                        {products.map((_, index, arr) => (
                          <div key={index}>
                            <div style={{ display: "flex", gap: "10px" }}>
                              <img src={_?.image} width="60px" height="60px" />
                              <div>
                                <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, color: data.title.fontColor }}>{_?.name}</p>
                                <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, color: data.title.fontColor, marginTop: "10px", }}>{_?.price}</p>
                              </div>
                            </div>

                            <VariantItems variantType={data?.variants?.type} variant={_?.variant} data={data} />

                            {index !== arr.length - 1 && (
                              <div style={{ margin: "10px 0px" }}>
                                <Divider borderColor="border-hover" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div style={{ display: "flex", justifyContent: "center", margin: "-18px 0px" }}>
                        <button disabled style={{ backgroundColor: `${data?.button?.buttonColor}`, color: `${data?.button?.textColor}`, cursor: "pointer", width: "40px", height: "40px", borderRadius: "50%", padding: "8px 8px 16px", fontWeight: 500, fontSize: "33px", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1, }}>+</button>
                      </div>

                      <div style={{ border: `${data?.border?.borderWidth}px solid ${data?.border?.color}`, padding: "10px", borderRadius: `${data?.border?.borderRadius}px`, position: "relative" }}>
                        <div style={{ height: "110px", width: "110px", position: "absolute", overflow: "hidden", right: "-10px", top: "-10px" }}>
                          <div class="ribbon ribbon-top-right" style={{ "--ribbon-bgcolor": data?.button?.buttonColor, "--ribbon-color": data?.button?.textColor }}>
                            <span>FREE</span>
                          </div>
                        </div>
                        {[{
                          name: "18k Solid Bloom Earrings", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-wire-bloom-earrings_afcace12-edfb-4c82-aba0-11462409947f.jpg?v=1758263758", price: "$20.00"
                        }, { name: "18k Interlinked Earrings", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-interlinked-earrings.jpg?v=1758263766", price: "$22.00" }].map((_, index, arr) => (
                          <div key={index}>
                            <div style={{ display: "flex", gap: "10px" }}>
                              <img src={_?.image} width="60px" height="60px" />
                              <div>
                                <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, color: data.title.fontColor }}>{_?.name}</p>
                                <div style={{ display: "flex", gap: "5px" }}>
                                  <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight + 100, color: data.title.fontColor, marginTop: "10px", }}>Free</p>
                                  <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, color: data.title.fontColor, marginTop: "10px", textDecoration: "line-through" }}>{_?.price}</p>
                                </div>
                              </div>
                            </div>

                            <VariantItems variantType={data?.variants?.type} variant={_?.variant} data={data} />

                            {index !== arr.length - 1 && (
                              <div style={{ margin: "10px 0px" }}>
                                <Divider borderColor="border-hover" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <button style={{ backgroundColor: `${data.button.buttonColor}`, border: "none", color: `${data.button.textColor}`, fontSize: "15px", cursor: "pointer", width: `${data?.button?.width}%`, padding: `${data?.button?.height}px 5px`, }}>
                        Add to cart
                      </button>
                    </div>
                    <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, color: data.title.fontColor }}>✨ Choose any 2 earrings from our collection and get a special bundle deal! Buy X Get Y your favorites to create the perfect set.</p>
                  </div>
                </div>
              ) : data?.selectDisplay.type === "include_product_page" ? (
                <div style={{ display: "flex", flexDirection: "column", width: "50%", gap: "1rem", border: "1px solid black", padding: "12px", borderRadius: `8px`, background: data?.background?.background_type === "transparent" ? 'transparent' : data?.background?.background_color }}>
                  <p style={{ fontSize: "25px", fontWeight: "700", lineHeight: "normal", color: data.title.fontColor }}>🎁 Buy 2 Earrings Bundle</p>
                  <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ border: `${data?.border?.borderWidth}px solid ${data?.border?.color}`, padding: "10px", borderRadius: `${data?.border?.borderRadius}px` }}>
                      {products.map((_, index, arr) => (
                        <div key={index}>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <img src={_?.image} width="60px" height="60px" />
                            <div>
                              <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, color: data.title.fontColor }}>{_?.name}</p>
                              <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, color: data.title.fontColor, marginTop: "10px", }}>{_?.price}</p>
                            </div>
                          </div>

                          <VariantItems variantType={data?.variants?.type} variant={_?.variant} data={data} />

                          {index !== arr.length - 1 && (
                            <div style={{ margin: "10px 0px" }}>
                              <Divider />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div style={{ display: "flex", justifyContent: "center", margin: "-18px 0px" }}>
                      <button disabled style={{ backgroundColor: `${data?.button?.buttonColor}`, color: `${data?.button?.textColor}`, cursor: "pointer", width: "40px", height: "40px", borderRadius: "50%", padding: "8px 8px 16px", fontWeight: 500, fontSize: "33px", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1, border: "none" }}>+</button>
                    </div>

                    <div style={{ border: `${data?.border?.borderWidth}px solid ${data?.border?.color}`, padding: "10px", borderRadius: `${data?.border?.borderRadius}px`, position: "relative" }}>
                      <div style={{ height: "110px", width: "110px", position: "absolute", overflow: "hidden", right: "-10px", top: "-10px" }}>
                        <div class="ribbon ribbon-top-right" style={{ "--ribbon-bgcolor": data?.button?.buttonColor, "--ribbon-color": data?.button?.textColor }}>
                          <span>FREE</span>
                        </div>
                      </div>
                      {[{
                        name: "18k Solid Bloom Earrings", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-wire-bloom-earrings_afcace12-edfb-4c82-aba0-11462409947f.jpg?v=1758263758", price: "$20.00"
                      }, { name: "18k Interlinked Earrings", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-interlinked-earrings.jpg?v=1758263766", price: "$22.00" }].map((_, index, arr) => (
                        <div key={index}>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <img src={_?.image} width="60px" height="60px" />
                            <div>
                              <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, color: data.title.fontColor }}>{_?.name}</p>
                              <div style={{ display: "flex", gap: "5px" }}>
                                <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight + 100, color: data.title.fontColor, marginTop: "10px", }}>Free</p>
                                <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, color: data.title.fontColor, marginTop: "10px", textDecoration: "line-through" }}>{_?.price}</p>
                              </div>
                            </div>
                          </div>

                          <VariantItems variantType={data?.variants?.type} variant={_?.variant} data={data} />

                          {index !== arr.length - 1 && (
                            <div style={{ margin: "10px 0px" }}>
                              <Divider borderColor="border-hover" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <button style={{ backgroundColor: `${data.button.buttonColor}`, border: "none", color: `${data.button.textColor}`, fontSize: "15px", cursor: "pointer", width: `${data?.button?.width}%`, padding: `${data?.button?.height}px 5px`, }}>
                      Add to cart
                    </button>
                  </div>
                  <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, color: data.title.fontColor }}>✨ Choose any 2 earrings from our collection and get a special bundle deal! Buy X Get Y your favorites to create the perfect set.</p>
                </div>
              ) : null}
            </div>
          </Card>
        </div>
      </Grid.Cell>
    </Grid >
  );
}

export default BuyXgetY;
