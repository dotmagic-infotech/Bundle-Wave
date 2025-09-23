// React Imports
import { useContext, useEffect, useState } from "react";

// Shopify Component
import { Collapsible, Icon, RangeSlider, Text, Card, Grid, Banner, Divider, Select, ButtonGroup, Button } from "@shopify/polaris";
import { AdjustIcon, ButtonIcon, CaretDownIcon, CaretUpIcon, ChevronDownIcon, ColorIcon, ResetIcon, TextAlignCenterIcon, TextGrammarIcon, TextUnderlineIcon, VariantIcon } from "@shopify/polaris-icons";

// Custom Component
import ColorPickerPopover from "../../../components/ColorPicker/ColorPickerPopover";
import { useFetchWithToken } from "../../../components/FetchDataAPIs/FetchWithToken";
import { ShopifyContext } from "../../../components/ShopifyProvider/ShopifyProvider";

function Fixedbundle() {

  // Hooks
  const fetchWithToken = useFetchWithToken();
  const { shopName } = useContext(ShopifyContext);

  // State
  const [openIndex, setOpenIndex] = useState(null);
  const [data, setData] = useState({
    selectDisplay: {
      type: "product_page",
    },
    tite_alignment: {
      alignment: "left"
    },
    background: {
      background_type: "transparent",
      background_color: "#FFFFFF",
    },
    title: {
      fontColor: "#000000",
      fontSize: 14,
      fontWeight: 400,
    },
    border: {
      color: "#000000",
      borderWidth: 1,
      borderRadius: 10,
    },
    variants: {
      type: "color_swatch",
      background_color: "#FFFFFF",
      border_color: "#7a26bf"
    },
    button: {
      buttonColor: "#7a26bf",
      textColor: "#ffffff",
      height: 45,
      width: 100,
    },
  });

  const fetchCustomizeData = async () => {
    try {
      const data = await fetchWithToken({
        url: `https://bundle-wave-backend.xavierapps.com/api/get_customize?shop=${shopName}&path=fixed`,
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
              const isActive = data.tite_alignment.alignment === value;

              return (
                <Button
                  key={index}
                  variant={isActive ? "primary" : "secondary"}
                  pressed={isActive}
                  onClick={() => handleChangeValue("tite_alignment", "alignment", value)}
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
      label: "Variant and quantity selector",
      icon: VariantIcon,
      content: (
        <>
          <Select
            label="Select Variant Type"
            options={[
              { label: "Color Swatch", value: "color_swatch" },
              { label: "Dropdown", value: "dropdown" },
            ]}
            value={data.variants.type}
            onChange={(value) =>
              handleChangeValue("variants", "type", value)
            }
          />
          <hr style={{ margin: "13px 0px", borderTop: "1px solid #DDDDDD" }} />
          {data?.variants?.type === "dropdown" &&
            <>
              <ColorPickerPopover
                lable="Background Color"
                color={data.variants.background_color}
                onChange={(color) =>
                  handleChangeValue("variants", "background_color", color)
                }
              />
              <hr style={{ margin: "13px 0px", borderTop: "1px solid #DDDDDD" }} />
            </>
          }
          <ColorPickerPopover
            lable="Border Color"
            color={data.variants.border_color}
            onChange={(color) =>
              handleChangeValue("variants", "border_color", color)
            }
          />
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
        type: data.selectDisplay.type
      },
      tite_alignment: {
        alignment: data.tite_alignment.alignment
      },
      background: {
        background_type: data.background.background_type,
        background_color: data.background.background_color
      },
      title: {
        fontColor: data.title.fontColor,
        fontSize: data.title.fontSize,
        fontWeight: data.title.fontWeight
      },
      border: {
        color: data.border.color,
        borderWidth: data.border.borderWidth,
        borderRadius: data.border.borderRadius
      },
      variants: {
        type: data.variants.type,
        background_color: data.variants.background_color,
        border_color: data.variants.border_color
      },
      button: {
        width: data.button.width,
        height: data.button.height,
        buttonColor: data.button.buttonColor,
        textColor: data.button.textColor
      }
    }

    const result = await fetchWithToken({
      url: `https://bundle-wave-backend.xavierapps.com/api/update_customize?path=fixed&shop=${shopName}`,
      method: 'POST',
      body: passData,
      isFormData: false,
    });

    if (result.status) {
      shopify.toast.show(`Update Successful Customization Fixed Bundle`);
    } else {
      shopify.toast.show(`Failed to Update Customization Fixed Bundle`);
    }
  }

  const products = [
    {
      name: "Sterling Silver Stud Earrings",
      image:
        "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-interlinked-earrings.jpg?v=1758263766",
      price: "$30.00",
      color: ["#b76e79", "#c0c0c0", "#ffd700"],
    },
    {
      name: "Rose Gold Drop Earrings",
      image:
        "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-wire-bloom-earrings_afcace12-edfb-4c82-aba0-11462409947f.jpg?v=1758263758",
      price: "$42.00",
      color: ["#c0c0c0", "#ffd700"],
    },
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
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "25px" }}>
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
              }}
            >
              {data?.selectDisplay?.type === "product_page" ? (
                <div style={{ display: "flex", gap: "15px" }}>
                  <div style={{ maxWidth: "400px" }}>
                    <img
                      src="https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-interlinked-earrings.jpg?v=1758263766"
                      width="100%"
                      style={{ borderRadius: "10px", objectFit: "cover" }}
                    />
                    <div style={{ display: "flex", gap: "0.2rem" }}>
                      <img
                        src="https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-interlinked-earrings.jpg?v=1758263766"
                        width="60px"
                        height="60px"
                        style={{ borderRadius: "10px" }}
                      />
                      <img
                        src="https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-wire-bloom-earrings_afcace12-edfb-4c82-aba0-11462409947f.jpg?v=1758263758"
                        width="60px"
                        height="60px"
                        style={{ borderRadius: "10px" }}
                      />
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "400px", }}>
                    <p style={{ fontSize: "25px", fontWeight: "700", lineHeight: "normal" }}>Elegant Earrings Bundle</p>
                    <div style={{ display: "flex", justifyContent: "space-between", }}>
                      <p style={{ fontSize: "20px", fontWeight: "500" }}>Total Price</p>
                      <p style={{ fontSize: "20px", fontWeight: "600" }}>$72.00</p>
                    </div>
                    <Divider borderColor="border-hover" />
                    <div style={{ backgroundColor: "white", width: "100%", height: "auto" }}>
                      <div>
                        {products.map((_, index, arr) => (
                          <div key={index}>
                            <div style={{ display: "flex", gap: "10px" }}>
                              <img
                                src={_?.image}
                                width="70px"
                                height="70px"
                                style={{ borderRadius: "10px" }}
                              />
                              <div>
                                <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight }}>{_?.name}</p>
                                <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, marginTop: "10px", }}>{_?.price}</p>
                              </div>
                            </div>
                            {data?.variants?.type === "dropdown" ? (
                              <div
                                style={{
                                  backgroundColor: `${data?.variants.background_color}`, border: `1px solid ${data.variants.border_color}`, display: "flex", justifyContent: "space-between", padding: "5px", borderRadius: "5px", width: "100%", marginTop: "10px",
                                }}
                              >
                                <p style={{ fontWeight: "500" }}>Select Variant</p>
                                <div><Icon source={ChevronDownIcon} /></div>
                              </div>
                            ) : (
                              <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                                {_?.color.map((v, i) => (
                                  <div key={i} style={{ border: i === 0 ? `2px solid ${data?.variants?.border_color}` : `2px solid ${v}`, padding: "2px", borderRadius: "50%", }}>
                                    <div
                                      style={{
                                        width: "20px",
                                        height: "20px",
                                        borderRadius: "50%",
                                        backgroundColor: v,
                                        cursor: "pointer",
                                      }}
                                      title={v}
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                            {index !== arr.length - 1 && (
                              <div style={{ margin: "10px 0px" }}> <Divider borderColor="border-hover" /></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight }}>✨ Elevate your style with our elegant earring collection – from timeless gold hoops for everyday wear, to minimalist sterling silver studs for a classic touch, and sparkling rose gold drop earrings perfect for special occasions. Designed for comfort, crafted with quality materials, and made to suit every outfit.</p>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <button style={{ backgroundColor: `${data.button.buttonColor}`, border: "none", color: `${data.button.textColor}`, fontSize: `${data.title.fontSize + 2}px`, cursor: "pointer", borderRadius: "10px", padding: "8px", width: `${data?.button?.width}%`, height: `${data?.button?.height}px`, }}>
                        Add bundle to cart | Save 20%
                      </button>
                    </div>
                  </div>
                </div>
              ) : data?.selectDisplay?.type === "included_product_page" ? (
                <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
                  <div style={{ border: `${data.border.borderWidth}px solid ${data.border.color}`, padding: "12px", borderRadius: `${data.border.borderRadius}px`, display: "flex", flexDirection: "column", gap: "1rem", backgroundColor: data?.background?.background_type === "colored" ? data.background.background_color : "transparent", color: data.title.fontColor, }}>
                    <p style={{
                      fontSize: "25px", fontWeight: "700", lineHeight: "normal", textAlign:
                        data.tite_alignment.alignment === "left"
                          ? "start"
                          : data.tite_alignment.alignment === "center"
                            ? "center"
                            : "end"
                    }}>
                      Elegant Earrings Bundle
                    </p>

                    <div style={{ marginTop: "10px" }}>
                      {products.map((_, index, arr) => (
                        <div key={index}>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <img
                              src={_?.image}
                              width="70px"
                              height="70px"
                              style={{ borderRadius: "10px" }}
                            />
                            <div>
                              <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight }}>{_?.name}</p>
                              <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, marginTop: "10px", }}>{_?.price}</p>
                            </div>
                          </div>
                          {data?.variants?.type === "dropdown" ? (
                            <div
                              style={{
                                backgroundColor: `${data?.variants.background_color}`, border: `1px solid ${data.variants.border_color}`, display: "flex", justifyContent: "space-between", padding: "5px", borderRadius: "5px", width: "100%", marginTop: "10px",
                              }}
                            >
                              <p style={{ fontWeight: "500" }}>Select Variant</p>
                              <div><Icon source={ChevronDownIcon} /></div>
                            </div>
                          ) : (
                            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                              {_?.color.map((v, i) => (
                                <div key={i} style={{ border: i === 0 ? `2px solid ${data?.variants?.border_color}` : `2px solid ${v}`, padding: "2px", borderRadius: "50%", }}>
                                  <div
                                    style={{
                                      width: "20px",
                                      height: "20px",
                                      borderRadius: "50%",
                                      backgroundColor: v,
                                      cursor: "pointer",
                                    }}
                                    title={v}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                          {index !== arr.length - 1 && (
                            <div style={{ marginTop: "15px" }}>
                              <Divider />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div style={{ backgroundColor: `#efefef`, display: "flex", justifyContent: "space-between", padding: "10px", borderRadius: "5px", width: "100%", }}>
                      <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, }}
                      >Total</p>
                      <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, }}>$72.00</p>
                    </div>
                    <button style={{ backgroundColor: `${data.button.buttonColor}`, border: "none", color: data.button.textColor, fontSize: `${data.title.fontSize + 2}px`, cursor: "pointer", borderRadius: "10px", padding: "8px", width: `${data?.button?.width}%`, height: `${data?.button?.height}px`, }}>
                      Add bundle to cart | Save 20%
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
            <div style={{ display: "flex", justifyContent: "end", padding: "10px 10px 0px", borderTop: "1px solid black", margin: "25px -16px 0px -16px" }}>
              <ButtonGroup>
                <Button>Cancel</Button>
                <Button variant="primary" onClick={handleSubmit}>Save</Button>
              </ButtonGroup>
            </div>
          </Card>
        </div>
      </Grid.Cell>
    </Grid >
  );
}

export default Fixedbundle;
