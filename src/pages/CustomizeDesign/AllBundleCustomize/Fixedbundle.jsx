// React Imports
import { useContext, useEffect, useState } from "react";

// Shopify Component
import { Collapsible, Icon, RangeSlider, Text, Card, Grid, Banner, Divider, Select, ButtonGroup, Button } from "@shopify/polaris";
import { AdjustIcon, ButtonIcon, CaretDownIcon, CaretUpIcon, ChevronDownIcon, ColorIcon, PlusIcon, ResetIcon, TextAlignCenterIcon, TextGrammarIcon, TextUnderlineIcon, VariantIcon } from "@shopify/polaris-icons";

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
      background_color: "#ffffff",
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
      background_color: "#ffffff",
      border_color: "#000000"
    },
    button: {
      buttonColor: "#000000",
      textColor: "#ffffff",
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
              { label: "Bundles Page", value: "bundles_page" },
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
          <ColorPickerPopover
            lable="Background Color"
            color={data.variants.background_color}
            onChange={(color) =>
              handleChangeValue("variants", "background_color", color)
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
        background_color: data.variants.background_color,
        border_color: data.variants.border_color
      },
      button: {
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
              }}
            >
              {data.selectDisplay.type === "product_page" ? (
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ maxWidth: "400px" }}>
                    <img
                      src="https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-wire-bloom-earrings_afcace12-edfb-4c82-aba0-11462409947f.jpg?v=1758263758"
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
                        src="https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-diamond-earrings_5e7739a0-261d-4788-96c9-ef77214aa70e.jpg?v=1758263764"
                        width="60px"
                        height="60px"
                        style={{ borderRadius: "10px" }}
                      />
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "400px", }}>
                    <p style={{ fontSize: "25px", fontWeight: "700" }}>Bundle Title</p>
                    <div style={{ display: "flex", justifyContent: "space-between", }}>
                      <p style={{ fontSize: "20px", fontWeight: "600" }}>Total Price</p>
                      <p style={{ fontSize: "20px", fontWeight: "600" }}>$156.00</p>
                    </div>
                    <Divider />
                    <div style={{ backgroundColor: "white", width: "100%", height: "auto", padding: "10px", }}>
                      <div>
                        {Array.from({ length: 2 }).map((_, index, arr) => (
                          <div key={index}>
                            <div style={{ display: "flex", gap: "10px" }}>
                              <img
                                src="https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-infinite-link-earrings---2_197e4e51-6b44-4e54-9244-d3666bc5b514.jpg?v=1758263763"
                                width="80px"
                                height="80px"
                                style={{ borderRadius: "10px" }}
                              />
                              <div>
                                <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight }}>Product #1</p>
                                <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, marginTop: "10px", }}>$10.00</p>
                              </div>
                            </div>
                            <div
                              style={{
                                backgroundColor: `${data?.variants.background_color}`, border: `1px solid ${data.variants.border_color}`, display: "flex", justifyContent: "space-between", padding: "5px", borderRadius: "5px", width: "100%", marginTop: "10px",
                              }}
                            >
                              <p style={{ fontWeight: "500" }}>
                                Size / Color / Type
                              </p>
                              <div>
                                <Icon source={ChevronDownIcon} />
                              </div>
                            </div>
                            {index !== arr.length - 1 && (
                              <div style={{ margin: "10px 0px" }}><Divider /></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <button style={{ backgroundColor: `${data.button.buttonColor}`, border: "none", color: `${data.button.textColor}`, fontSize: "15px", cursor: "pointer", borderRadius: "10px", padding: "8px", width: "100%", }}>
                      Add to cart
                    </button>
                  </div>
                </div>
              ) : data.selectDisplay.type === "included_product_page" ? (
                <div style={{ display: "flex", flexDirection: "column", width: "50%", }}>
                  <div style={{ border: `${data.border.borderWidth}px solid ${data.border.color}`, padding: "10px", borderRadius: `${data.border.borderRadius}px`, display: "flex", flexDirection: "column", gap: "1.5rem", backgroundColor: data?.background?.background_type === "colored" ? data.background.background_color : "transparent", color: data.title.fontColor, }}>
                    <p style={{
                      fontSize: `${16 + Number(data.title.fontSize ?? 0)}px`, fontWeight: "600", textAlign:
                        data.tite_alignment.alignment === "left"
                          ? "start"
                          : data.tite_alignment.alignment === "center"
                            ? "center"
                            : "end"
                    }}>
                      Fixed bundle
                    </p>
                    {Array.from({ length: 2 }).map((_, index, arr) => (
                      <div key={index}>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <img
                            src="https://cdn.shopify.com/s/files/1/0839/1399/8619/files/Perfume_-_3.jpg?v=1756097546"
                            width="80px"
                            height="80px"
                            style={{ borderRadius: "10px" }}
                          />
                          <div>
                            <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight }}>Product #1</p>
                            <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, marginTop: "10px", }}>$10.00</p>
                          </div>
                        </div>
                        <div style={{ backgroundColor: `${data.variants.background_color}`, border: `1px solid ${data.variants.border_color}`, display: "flex", justifyContent: "space-between", padding: "5px", borderRadius: "5px", width: "100%", marginTop: "10px", }}>
                          <p style={{ fontWeight: "500" }}>Size / Color / Type</p>
                          <div>
                            <Icon source={ChevronDownIcon} />
                          </div>
                        </div>
                        {index !== arr.length - 1 && (
                          <div style={{ marginTop: "25px" }}>
                            <Divider />
                          </div>
                        )}
                      </div>
                    ))}

                    <div style={{ backgroundColor: `#efefef`, display: "flex", justifyContent: "space-between", padding: "10px", borderRadius: "5px", width: "100%", }}>
                      <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, }}
                      >Total</p>
                      <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, }}>$0.00</p>
                    </div>
                    <div>
                      <button style={{ backgroundColor: `${data.button.buttonColor}`, border: "none", color: data.button.textColor, fontSize: `${data.title.fontSize}px`, cursor: "pointer", borderRadius: "10px", padding: "8px", width: "100%", }}>
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              ) : data.selectDisplay.type === "bundles_page" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  <div>
                    <p style={{ fontSize: "20px", fontWeight: "600", color: data.title.fontColor, marginBottom: "15px", }}>
                      Fixed bundle
                    </p>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {Array.from({ length: 2 }).map((_, index, arr) => (
                        <div key={index} style={{ display: "flex" }}>
                          <div
                            style={{ display: "flex", flexDirection: "column", gap: "10px", border: `${data.border.borderWidth}px solid ${data.border.color}`, padding: "10px", borderRadius: `${data.border.borderRadius}px` }}
                          >
                            <img
                              src="https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ="
                              width="100%"
                              height="140px"
                              style={{ borderRadius: "10px" }}
                            />
                            <div>
                              <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight }}> Product #1</p>
                              <p style={{ fontSize: `${data.title.fontSize}px`, marginTop: "10px", fontWeight: data.title.fontWeight }}> $10.00</p>
                            </div>
                            <div
                              style={{ backgroundColor: `${data.variants.background_color}`, border: `1px solid ${data.variants.border_color}`, display: "flex", justifyContent: "space-between", padding: "5px", borderRadius: "5px", width: "100%", marginTop: "10px" }}>
                              <p style={{ fontWeight: "500" }}>Size / Color / Type </p>
                              <div>
                                <Icon source={ChevronDownIcon} />
                              </div>
                            </div>
                          </div>
                          {index !== arr.length - 1 && (
                            <div style={{ margin: "0px 10px", display: "flex" }}>
                              <Icon source={PlusIcon} />
                            </div>
                          )}
                        </div>
                      ))}
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "260px", marginLeft: "1rem", }}>
                        <div style={{ display: "flex", justifyContent: "space-between", backgroundColor: `${data.button.buttonColor}80`, opacity: "0.6", padding: "10px", borderRadius: "10px" }}>
                          <p style={{ fontSize: "15px", fontWeight: "600", color: data.title.fontColor, }}>Total</p>
                          <p style={{ fontSize: "15px", fontWeight: "600", color: data.title.fontColor, }}>$5.89</p>
                        </div>
                        <button style={{ backgroundColor: `${data.button.buttonColor}`, border: "none", color: `${data.button.textColor}`, fontSize: "15px", cursor: "pointer", borderRadius: "10px", padding: "8px", width: "100%", }}>
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                  <Divider />
                  <div>
                    <div style={{ padding: "10px", backgroundColor: "black", width: "100px", borderRadius: "10px", color: "white", marginBottom: "15px", fontSize: "18px", }}>
                      Save 10%
                    </div>
                    <p style={{ fontSize: "20px", fontWeight: "600", color: data.title.fontColor, marginBottom: "5px", }}>
                      Mix and Match - Sectioned List
                    </p>
                    <p style={{ fontSize: "16px", fontWeight: "500", color: data.title.fontColor, marginBottom: "15px", }}>
                      A bundle with collection items
                    </p>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {Array.from({ length: 2 }).map((_, index, arr) => (
                        <div key={index} style={{ display: "flex" }}>
                          <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", gap: "10px", border: `${data.border.borderWidth}px solid ${data.border.color}`, padding: "10px 50px 20px 50px", borderRadius: `${data.border.borderRadius}px`, }}>
                            <div style={{ display: "flex", alignItems: "center", position: "relative", }}>
                              {Array.from({ length: 3 }).map((_, index) => (
                                <div
                                  key={index}
                                  style={{
                                    width: "30px", height: "30px", overflow: "hidden", left: index === 0 ? "0px" : "20px", position: index === 0 ? "static" : "absolute",
                                  }}>
                                  <img
                                    src="https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ="
                                    style={{ borderRadius: "50%", backgroundColor: "#f6f6f7", width: "100%", height: "100%", objectFit: "cover" }}
                                  />
                                </div>
                              ))}
                            </div>
                            <div>
                              <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight }}>Collection #{index + 1}</p>
                            </div>
                          </div>
                          {index !== arr.length - 1 && (
                            <div style={{ margin: "0px 10px", display: "flex" }}>
                              <Icon source={PlusIcon} />
                            </div>
                          )}
                        </div>
                      ))}
                      <div style={{ marginLeft: "1rem", width: "260px" }}>
                        <button style={{ backgroundColor: `${data.button.buttonColor}`, border: "none", color: `${`${data.button.textColor}`}`, fontSize: "15px", cursor: "pointer", borderRadius: "10px", padding: "8px", width: "100%", }}>
                          Go To Bundle Builder
                        </button>
                      </div>
                    </div>
                  </div>
                  <Divider />
                  <div>
                    <p style={{ fontSize: "20px", fontWeight: "600", color: data.title.fontColor, marginBottom: "20px", }}>
                      Mix and match - Buy X Get Y
                    </p>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", }}>
                      <div style={{ display: "flex", position: "relative", flexDirection: "column", gap: "10px", border: `${data.border.borderWidth}px solid ${data.border.color}`, padding: "15px", borderRadius: `${data.border.borderRadius}px`, width: "250px", }}>
                        <div style={{ position: "absolute", top: "-11px", left: "11px", backgroundColor: "#b9b9ff", borderRadius: "20px", padding: "0px 5px", fontSize: "12px", }}>
                          Buy from these lists
                        </div>
                        <div style={{ display: "flex", alignItems: "center", position: "relative", }}>
                          {Array.from({ length: 3 }).map((_, index) => (
                            <div
                              key={index}
                              style={{
                                width: "60px", height: "60px", overflow: "hidden", left: index === 0 ? "0px" : "30px", position: index === 0 ? "static" : "absolute",
                              }}
                            >
                              <img
                                src="https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ="
                                style={{ borderRadius: "50%", backgroundColor: "#f6f6f7", width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            </div>
                          ))}
                        </div>
                        <div>
                          <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight }}>
                            Collection #1
                          </p>
                        </div>
                        <Divider />
                        <div style={{ position: "absolute", top: "-11px", left: "11px", backgroundColor: "#b9b9ff", borderRadius: "20px", padding: "0px 5px", fontSize: "12px", }}
                        >
                          Buy from these lists
                        </div>
                        <div style={{ display: "flex", alignItems: "center", position: "relative", }}>
                          {Array.from({ length: 3 }).map((_, index) => (
                            <div
                              key={index}
                              style={{ width: "60px", height: "60px", overflow: "hidden", left: index === 0 ? "0px" : "30px", position: index === 0 ? "static" : "absolute" }}
                            >
                              <img
                                src="https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ="
                                style={{ borderRadius: "50%", backgroundColor: "#f6f6f7", width: "100%", height: "100%", objectFit: "cover", }}
                              />
                            </div>
                          ))}
                        </div>
                        <div>
                          <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight }}>
                            Collection #1
                          </p>
                        </div>
                      </div>
                      <div style={{ display: "flex" }}>
                        <Icon source={PlusIcon} />
                      </div>
                      <div style={{ position: "relative" }}>
                        <div style={{ position: "absolute", top: "-11px", left: "11px", backgroundColor: "#b2efb2", borderRadius: "20px", padding: "0px 5px", fontSize: "12px", }}>
                          Get 10% on these lists
                        </div>
                        <div style={{ display: "flex", overflow: "hidden", flexDirection: "column", gap: "10px", border: `${data.border.borderWidth}px solid ${data.border.color}`, padding: "15px", borderRadius: `${data.border.borderRadius}px`, width: "250px", height: "auto", }}>
                          <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                            {Array.from({ length: 3 }).map((_, index) => (
                              <div
                                key={index}
                                style={{
                                  width: "60px", height: "60px", overflow: "hidden", left: index === 0 ? "0px" : "30px", position: index === 0 ? "static" : "absolute",
                                }}
                              >
                                <img
                                  src="https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ="
                                  style={{ borderRadius: "50%", backgroundColor: "#f6f6f7", width: "100%", height: "100%", objectFit: "cover" }}
                                />
                              </div>
                            ))}
                            <div style={{ position: "absolute", top: "-9px", right: "-33px", width: "95px", height: "23px", transform: "rotate(36deg)", backgroundColor: "red", color: "white", padding: "10px", fontWeight: "500", display: "flex", justifyContent: "center", alignItems: "center", }}>
                              10% OFF
                            </div>
                          </div>
                          <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight }}>
                            Collection #1
                          </p>
                        </div>
                      </div>
                      <button style={{ backgroundColor: `${data.button.buttonColor}`, border: "none", color: `${data.button.textColor}`, fontSize: "15px", cursor: "pointer", borderRadius: "10px", padding: "8px", }}>
                        View Offer Details
                      </button>
                    </div>
                  </div>
                </div>
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
      </Grid.Cell>
    </Grid >
  );
}

export default Fixedbundle;
