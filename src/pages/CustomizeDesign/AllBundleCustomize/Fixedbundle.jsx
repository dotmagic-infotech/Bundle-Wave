// React Imports
import { useContext, useEffect, useState } from "react";

// Shopify Component
import { Collapsible, Icon, RangeSlider, Text, Card, Grid, Divider, Select, ButtonGroup, Button } from "@shopify/polaris";
import { AdjustIcon, ButtonIcon, CaretDownIcon, CaretUpIcon, ColorIcon, ResetIcon, TextAlignCenterIcon, TextGrammarIcon, TextUnderlineIcon, VariantIcon } from "@shopify/polaris-icons";

// Custom Component
import ColorPickerPopover from "../../../components/ColorPicker/ColorPickerPopover";
import { useFetchWithToken } from "../../../components/FetchDataAPIs/FetchWithToken";
import { ShopifyContext } from "../../../components/ShopifyProvider/ShopifyProvider";
import VariantItems from "../../../components/VariantItems/VariantItems";

function Fixedbundle() {

  // Hooks
  const fetchWithToken = useFetchWithToken();
  const { shopName } = useContext(ShopifyContext);

  // State
  const [openIndex, setOpenIndex] = useState(null);
  const [selection, setSelection] = useState("selected");
  const [data, setData] = useState({
    selectDisplay: {
      type: "product_page",
    },
    title_setting: {
      titleSize: 30,
      titleWeight: 600,
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
      text_color: "#000000",
      border_color: "#7a26bf",
      unselected_background_color: "#FFFFFF",
      unselected_text_color: "#000000",
      unselected_border_color: "#000000",
    },
    button: {
      buttonColor: "#7a26bf",
      textColor: "#ffffff",
      height: 10,
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
      // console.error("Failed to fetch bundle details:", error);
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
            value={data.variants.type}
            onChange={(value) => {
              handleChangeValue("variants", "type", value);
              if (value === "color_swatch") {
                setSelection("selected");
              }
            }}
          />
          {data?.variants?.type === "color_swatch" &&
            <>
              <hr style={{ margin: "13px 0px", borderTop: "1px solid #DDDDDD" }} />
              <ButtonGroup variant="segmented" fullWidth>
                {["Selected", "Not Selected"].map((label, index) => {
                  const value = label.toLowerCase();
                  const isActive = selection === value;

                  return (
                    <Button
                      key={index}
                      variant={isActive ? "primary" : "secondary"}
                      pressed={isActive}
                      onClick={() => setSelection(value)}
                    >
                      {label}
                    </Button>
                  );
                })}
              </ButtonGroup>
            </>
          }
          {(data?.variants?.type === "color_swatch" && selection === "selected") && (
            <div style={{ marginTop: "10px" }}>
              <ColorPickerPopover
                lable="Background Color"
                color={data.variants.background_color}
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
                color={data.variants.border_color}
                onChange={(color) =>
                  handleChangeValue("variants", "border_color", color)
                }
              />
            </div>
          )}
          {(data?.variants?.type === "color_swatch" && selection === "not selected") && (
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
        type: data.selectDisplay.type
      },
      title_setting: {
        titleSize: data.title_setting.titleSize,
        titleWeight: data.title_setting.titleWeight,
        alignment: data.title_setting.alignment,
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
        text_color: data.variants.text_color,
        border_color: data.variants.border_color,
        unselected_background_color: data.variants?.unselected_background_color,
        unselected_text_color: data.variants.unselected_text_color,
        unselected_border_color: data.variants?.unselected_border_color
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
      image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-interlinked-earrings.jpg?v=1758263766",
      price: "$30.00",
      variant: [{
        color: ["#b76e79", "#c0c0c0", "#ffd700"],
        size: ["3-5mm", "6-8mm", "9-12mm"]
      }],
    },
    {
      name: "Rose Gold Drop Earrings",
      image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-wire-bloom-earrings_afcace12-edfb-4c82-aba0-11462409947f.jpg?v=1758263758",
      price: "$42.00",
    },
    {
      name: "18k Dangling Pendant Earrings",
      image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-gold-dangling-pendant-earrings_17e71027-81d8-4a49-a455-2e5c205963ee.jpg?v=1758263763",
      price: "$15.00",
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
            <div style={{ display: "flex", justifyContent: "end", padding: "0px 10px 10px", borderBottom: "1px solid black", margin: "0px -16px 10px -16px" }}>
              <ButtonGroup>
                <Button variant="primary" onClick={handleSubmit}>Save</Button>
              </ButtonGroup>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {data?.selectDisplay?.type === "product_page" ? (
                <div style={{ display: "flex", gap: "15px" }}>
                  <div style={{ maxWidth: "400px" }}>
                    <img
                      src="https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-interlinked-earrings.jpg?v=1758263766"
                      width="100%"
                    />
                    <div style={{ display: "flex", gap: "0.2rem" }}>
                      <img
                        src="https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-interlinked-earrings.jpg?v=1758263766"
                        width="80px"
                        height="80px"
                      />
                      <img
                        src="https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-wire-bloom-earrings_afcace12-edfb-4c82-aba0-11462409947f.jpg?v=1758263758"
                        width="80px"
                        height="80px"
                      />
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "400px", }}>
                    <p style={{ fontSize: "25px", fontWeight: "700", lineHeight: "normal" }}>Elegant Earrings Bundle</p>
                    <div style={{ display: "flex", justifyContent: "space-between", }}>
                      <p style={{ fontSize: "20px", fontWeight: "500" }}>Total Price</p>
                      <div style={{ display: "flex", alignItems: 'center', gap: "10px" }}>
                        <p style={{ fontSize: "20px", fontWeight: "600" }}>$57.50</p>
                        <p style={{ fontSize: "20px", fontWeight: "600", textDecoration: "line-through" }}>$72.00</p>
                      </div>
                    </div>
                    <Divider borderColor="border-hover" />
                    <div style={{ backgroundColor: "white", width: "100%", height: "auto" }}>
                      <div>
                        {products.map((_, index, arr) => (
                          <div key={index}>
                            <div style={{ display: "flex", gap: "10px" }}>
                              <img src={_?.image} width="70px" height="70px" />
                              <div>
                                <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight }}>{_?.name}</p>
                                <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, marginTop: "10px", }}>{_?.price}</p>
                              </div>
                            </div>

                            <VariantItems variantType={data?.variants?.type} variant={_?.variant} data={data} />

                            <div style={{ margin: "10px 0px" }}> <Divider borderColor="border-hover" /></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <button style={{ backgroundColor: `${data.button.buttonColor}`, border: "none", color: `${data.button.textColor}`, fontSize: "18px", cursor: "pointer", width: `${data?.button?.width}%`, padding: `${data?.button?.height}px 5px`, }}>
                        Add bundle to cart | Save 20%
                      </button>
                    </div>
                    <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight }}>✨ Elevate your style with our elegant earring collection – from timeless gold hoops for everyday wear, to minimalist sterling silver studs for a classic touch, and sparkling rose gold drop earrings perfect for special occasions. Designed for comfort, crafted with quality materials, and made to suit every outfit.</p>
                  </div>
                </div>
              ) : data?.selectDisplay?.type === "included_product_page" ? (
                <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
                  <div style={{ border: `${data.border.borderWidth}px solid ${data.border.color}`, padding: "12px", borderRadius: `${data.border.borderRadius}px`, display: "flex", flexDirection: "column", backgroundColor: data?.background?.background_type === "colored" ? data.background.background_color : "transparent", color: data.title.fontColor, }}>
                    <p style={{
                      fontSize: `${data?.title_setting?.titleSize}px`, fontWeight: data?.title_setting?.titleWeight, lineHeight: "normal", marginBottom: "1rem", textAlign:
                        data.title_setting.alignment === "left"
                          ? "start"
                          : data.title_setting.alignment === "center"
                            ? "center"
                            : "end"
                    }}>
                      Elegant Earrings Bundle
                    </p>

                    {products.map((_, index, arr) => (
                      <div key={index}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <img src={_?.image} width="70px" height="70px" />
                          <div>
                            <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight }}>{_?.name}</p>
                            <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, marginTop: "10px", }}>{_?.price}</p>
                          </div>
                        </div>

                        <VariantItems variantType={data?.variants?.type} variant={_?.variant} data={data} />

                        <div style={{ margin: "15px -12px" }}>
                          <Divider />
                        </div>
                      </div>
                    ))}

                    <button style={{ backgroundColor: `${data.button.buttonColor}`, border: "none", color: data.button.textColor, fontSize: `${data.title.fontSize}px`, cursor: "pointer", width: `${data?.button?.width}%`, padding: `${data?.button?.height}px 5px`, }}>
                      Add bundle to cart | Save 20%
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </Card>
        </div>
      </Grid.Cell>
    </Grid >
  );
}

export default Fixedbundle;
