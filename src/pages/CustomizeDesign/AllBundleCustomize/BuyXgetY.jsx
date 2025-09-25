// React Imports
import { useContext, useEffect, useState } from "react";

// Shopify Component
import { Collapsible, Icon, RangeSlider, Text, Card, Grid, Banner, ButtonGroup, Button, Select, Divider } from "@shopify/polaris";
import { AdjustIcon, ButtonIcon, CaretDownIcon, CaretUpIcon, ChevronDownIcon, ResetIcon, TextGrammarIcon, TextUnderlineIcon, VariantIcon, XIcon } from "@shopify/polaris-icons";

// Custom Component
import ColorPickerPopover from "../../../components/ColorPicker/ColorPickerPopover";
import { useFetchWithToken } from "../../../components/FetchDataAPIs/FetchWithToken";
import { ShopifyContext } from "../../../components/ShopifyProvider/ShopifyProvider";

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
      width: 100,
      height: 45,
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
              { label: "Main product page", value: "main_product_page" },
              { label: "Pop-up", value: "pop_up", },
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
            value={data?.variants?.type}
            onChange={(value) =>
              handleChangeValue("variants", "type", value)
            }
          />
          <hr style={{ margin: "13px 0px", borderTop: "1px solid #DDDDDD" }} />
          {data?.variants?.type === "dropdown" &&
            <>
              <ColorPickerPopover
                lable="Background Color"
                color={data?.variants?.background_color}
                onChange={(color) =>
                  handleChangeValue("variants", "background_color", color)
                }
              />
              <hr style={{ margin: "13px 0px", borderTop: "1px solid #DDDDDD" }} />
            </>
          }
          <ColorPickerPopover
            lable="Border Color"
            color={data.variants?.border_color}
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
        type: data?.selectDisplay.type,
      },
      title: {
        fontColor: data.title.fontColor,
        fontSize: data.title.fontSize,
        fontWeight: data.title.fontWeight,
      },
      border: {
        color: data.border.color,
        borderWidth: data.border.borderWidth,
        borderRadius: 10,
      },
      variants: {
        type: data.variants.type,
        background_color: data.variants?.background_color,
        border_color: data.variants?.border_color
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
    { name: "18k Pedal Ring", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-rose-ring.jpg?v=1758263771", price: "$45.00", color: ["#b76e79", "#c0c0c0", "#ffd700"], },
    { name: "18k Dangling Pendant Earrings", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-gold-dangling-pendant-earrings_17e71027-81d8-4a49-a455-2e5c205963ee.jpg?v=1758263763", price: "$22.00", color: ["#c0c0c0", "#ffd700"] },
    { name: "18k Bloom Pendant", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-bloom-pendant.jpg?v=1758263772", price: "$25.00", color: ["#b76e79", "#c0c0c0", "#ffd700"] }
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
                backgroundColor: data?.selectDisplay.type === "pop_up" ? "rgba(117, 115, 115, 0.6)" : "transparent",
                padding: data?.selectDisplay.type === "pop_up" ? "55px" : ""
              }}
            >
              {data?.selectDisplay?.type === "main_product_page" ? (
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ maxWidth: "400px" }}>
                    <img
                      src="https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-rose-ring.jpg?v=1758263771"
                      width="100%"
                      style={{ borderRadius: "10px", objectFit: "cover" }}
                    />
                    <div style={{ display: "flex", gap: "0.2rem" }}>
                      <img
                        src="https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-rose-ring.jpg?v=1758263771"
                        width="60px"
                        height="60px"
                        style={{ borderRadius: "10px" }}
                      />
                      <img
                        src="https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-gold-dangling-pendant-earrings_17e71027-81d8-4a49-a455-2e5c205963ee.jpg?v=1758263763"
                        width="60px"
                        height="60px"
                        style={{ borderRadius: "10px" }}
                      />
                      <img
                        src="https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-bloom-pendant.jpg?v=1758263772"
                        width="60px"
                        height="60px"
                        style={{ borderRadius: "10px" }}
                      />
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "400px", }}>
                    <p style={{ fontSize: "25px", fontWeight: "700", lineHeight: "normal", }}>🎁 Buy 2 Earrings Bundle</p>
                    <div style={{ display: "flex", justifyContent: "space-between", }}>
                      <p style={{ fontSize: "20px", fontWeight: "600" }}>Total Price</p>
                      <p style={{ fontSize: "20px", fontWeight: "600" }}>$92.00</p>
                    </div>
                    <Divider borderColor="border-hover" />
                    <div style={{ backgroundColor: "white", width: "100%", height: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div style={{ border: `${data?.border?.borderWidth}px solid ${data?.border?.color}`, padding: "10px", borderRadius: `${data?.border?.borderRadius}px` }}>
                        {products.map((_, index, arr) => (
                          <div key={index}>
                            <div style={{ display: "flex", gap: "10px" }}>
                              <img
                                src={_?.image}
                                width="60px"
                                height="60px"
                                style={{ borderRadius: "10px" }}
                              />
                              <div>
                                <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, color: data.title.fontColor }}>{_?.name}</p>
                                <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, color: data.title.fontColor, marginTop: "10px", }}>{_?.price}</p>
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

                      <div style={{ border: `${data?.border?.borderWidth}px solid ${data?.border?.color}`, padding: "10px", borderRadius: `${data?.border?.borderRadius}px`, overflow: "hidden" }}>
                        {[{ name: "18k Solid Bloom Earrings", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-wire-bloom-earrings_afcace12-edfb-4c82-aba0-11462409947f.jpg?v=1758263758", price: "$20.00", color: ["#c0c0c0"] }].map((_, index, arr) => (
                          <div key={index} style={{ position: "relative" }}>
                            <div style={{
                              position: "absolute",
                              top: "-3px",
                              right: "-32px",
                              width: "90px",
                              height: "23px",
                              transform: "rotate(38deg)",
                              backgroundColor: `${data?.button?.buttonColor}`,
                              color: `${data?.button?.textColor}`,
                              padding: "10px",
                              fontWeight: 600,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}>
                              Free
                            </div>
                            <div style={{ display: "flex", gap: "10px" }}>
                              <img
                                src={_?.image}
                                width="60px"
                                height="60px"
                                style={{ borderRadius: "10px" }}
                              />
                              <div>
                                <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, color: data.title.fontColor }}>{_?.name}</p>
                                <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, color: data.title.fontColor, marginTop: "10px", }}>{_?.price}</p>
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
                              <div style={{ margin: "10px 0px" }}>
                                <Divider borderColor="border-hover" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, color: data.title.fontColor }}>✨ Choose any 2 earrings from our collection and get a special bundle deal! Buy X Get Y your favorites to create the perfect set.</p>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <button style={{ backgroundColor: `${data.button.buttonColor}`, border: "none", color: `${data.button.textColor}`, fontSize: "15px", cursor: "pointer", borderRadius: "10px", padding: "8px", width: `${data?.button?.width}%`, height: `${data?.button?.height}px`, }}>
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              ) : data?.selectDisplay.type === "pop_up" ? (
                <div style={{ backgroundColor: "white", width: "500px", borderRadius: "10px", padding: "10px", position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "end", margin: "10px 0px", position: "absolute", top: "-45px", right: "0px" }}>
                    <Button icon={XIcon} variant='secondary'></Button>
                  </div>

                  <p style={{ fontSize: "25px", fontWeight: "700", lineHeight: "normal", marginBottom: "20px" }}>🎁 Buy 2 Earrings Bundle</p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", border: "1px solid black", borderRadius: "10px", padding: "18px 10px", position: "relative", marginTop: "10px" }}>
                    <div style={{ position: "absolute", top: "-10px", left: "16px", borderRadius: "20px", backgroundColor: "#d9e9ff", fontSize: "11px", fontWeight: 600, padding: "0px 10px", }}>Buy from these lists</div>
                    {[{ name: "18k Pedal Ring", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-rose-ring.jpg?v=1758263771", description: "Collections Description" },
                    { name: "18k Dangling Pendant Earrings", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-white-gold-dangling-pendant-earrings_17e71027-81d8-4a49-a455-2e5c205963ee.jpg?v=1758263763", description: "Product Description" }].map((v, i) => (
                      <div style={{ border: "1px solid gray", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "0.5rem", padding: "6px", cursor: "pointer" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <div style={{ display: "flex" }}>
                            <img src={v.image} width="60px" height="60px" style={{ objectFit: "fill", borderRadius: "10px" }} />
                            <div style={{ marginLeft: "10px" }}>
                              <p style={{ fontSize: `${data?.title?.fontSize + 3}px`, fontWeight: data?.title?.fontWeight, color: data?.title?.fontColor }}>{v.name}</p>
                              <p style={{ fontSize: `${data?.title?.fontSize}px`, fontWeight: data?.title?.fontWeight, color: data?.title?.fontColor, marginTop: "5px" }}>{v.description}</p>
                            </div>
                          </div>
                          <div>
                            <span>Selected: 0</span>
                            <button type="button" style={{ background: "none", border: "none", cursor: "pointer" }}>▼</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", margin: "6px 0px" }}>
                    <button disabled style={{ backgroundColor: `${data?.button?.buttonColor}`, color: `${data?.button?.textColor}`, cursor: "pointer", width: "40px", height: "40px", borderRadius: "50%", padding: "8px 8px 16px", fontWeight: 500, fontSize: "33px", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1, }}>+</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", border: "1px solid black", borderRadius: "10px", padding: "18px 10px", position: "relative", marginTop: "10px" }}>
                    <div style={{ position: "absolute", top: "-10px", left: "16px", borderRadius: "20px", backgroundColor: "#c2e7dd", fontSize: "11px", fontWeight: 600, padding: "0px 10px" }}>
                      Get Free on these lists
                    </div>
                    {[{ name: "18k Solid Bloom Earrings", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-bloom-pendant.jpg?v=1758263772", description: "Collections Description" },
                    { name: "18k Bloom Pendant", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-wire-bloom-earrings_afcace12-edfb-4c82-aba0-11462409947f.jpg?v=1758263758", description: "Product Description" }].map((v, i) => (
                      <div style={{ border: "1px solid gray", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "0.5rem", padding: "6px", cursor: "pointer", position: "relative" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <div style={{ display: "flex" }}>
                            <img src={v.image} width="60px" height="60px" style={{ objectFit: "fill", borderRadius: "10px" }} />
                            <div style={{ marginLeft: "10px" }}>
                              <p style={{ fontSize: `${data?.title?.fontSize + 3}px`, fontWeight: data?.title?.fontWeight, color: data?.title?.fontColor }}>{v.name}</p>
                              <p style={{ fontSize: `${data?.title?.fontSize}px`, fontWeight: data?.title?.fontWeight, color: data?.title?.fontColor, marginTop: "5px" }}>{v.description}</p>
                            </div>
                          </div>
                          <div>
                            <span>Selected: 0</span>
                            <button type="button" style={{ background: "none", border: "none", cursor: "pointer" }}>▼</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ margin: "10px -10px" }}>
                    <Divider borderColor="border-hover" />
                  </div>
                  <div style={{ backgroundColor: `#efefef`, display: "flex", justifyContent: "space-between", padding: "10px", borderRadius: "5px", width: "100%", marginBottom: '10px' }}>
                    <p style={{ fontWeight: "500", fontSize: `${data.title.fontSize}px`, color: data.title.fontColor }}>Total</p>
                    <p style={{ fontWeight: "500", fontSize: `${data.title.fontSize}px`, color: data.title.fontColor }}>$0.00</p>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <button style={{ backgroundColor: `${data?.button?.buttonColor}`, border: "none", color: `${data?.button?.textColor}`, fontSize: `${data.title.fontSize}px`, fontWeight: "500", cursor: "pointer", borderRadius: "10px", padding: "8px", width: `${data?.button?.width}%`, height: `${data?.button?.height}px` }}>
                      Add to cart
                    </button>
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
      </Grid.Cell >
    </Grid >
  );
}

export default BuyXgetY;
