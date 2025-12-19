// React Imports
import { useContext, useEffect, useState } from "react";

// Shopify Component
import { Collapsible, Icon, RangeSlider, Text, Card, Grid, Banner, Select, RadioButton, ButtonGroup, Button, Badge } from "@shopify/polaris";
import { AdjustIcon, ButtonIcon, CaretDownIcon, CaretUpIcon, ColorIcon, ResetIcon, TextAlignCenterIcon, TextGrammarIcon, TextUnderlineIcon, VariantIcon } from "@shopify/polaris-icons";

// Custom Component
import ColorPickerPopover from "../../../components/ColorPicker/ColorPickerPopover";
import { ShopifyContext } from "../../../components/ShopifyProvider/ShopifyProvider";
import { useFetchWithToken } from "../../../components/FetchDataAPIs/FetchWithToken";
import VariantItems from "../../../components/VariantItems/VariantItems";

function Volumediscount() {

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
        title: {
            fontColor: "#000000",
            fontSize: 12,
            fontWeight: 600,
        },
        background: {
            background_type: "transparent",
            background_color: "#FFFFFF",
        },
        border: {
            color: "#7a26bf",
            borderWidth: 2,
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
            width: 100,
            height: 10,
            buttonColor: "#7a26bf",
            textColor: "#ffffff",
        },
    });

    const fetchCustomizeData = async () => {
        try {
            const data = await fetchWithToken({
                url: `https://bundle-wave-backend.xavierapps.com/api/get_customize?shop=${shopName}&path=VolumeDiscount`,
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
                            { label: "Included Product Page", value: "included_product_page" },
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
                        max={20}
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
                    {(data?.variants?.type === "color_swatch" && data?.variants?.selection_mode === "not selected") && (
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
            tite_alignment: {
                alignment: data.tite_alignment.alignment
            },
            title: {
                fontColor: data.title.fontColor,
                fontSize: data.title.fontSize,
                fontWeight: data.title.fontWeight
            },
            background: {
                background_type: data?.background?.background_type,
                background_color: data?.background?.background_color,
            },
            border: {
                color: data.border.color,
                borderWidth: data.border.borderWidth,
                borderRadius: data.border.borderRadius
            },
            variants: {
                type: data?.variants?.type,
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
            url: `https://bundle-wave-backend.xavierapps.com/api/update_customize?path=VolumeDiscount&shop=${shopName}`,
            method: 'POST',
            body: passData,
            isFormData: false,
        });

        if (result.status) {
            shopify.toast.show(`Update Successful Customization Volume Discounts`);
        } else {
            shopify.toast.show(`Failed to Update Customization Volume Discounts`);
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
                                <div onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    style={{ display: "flex", justifyContent: "space-between", cursor: "pointer", padding: "8px", backgroundColor: openIndex === index ? "#EBEBEB" : "transparent", borderRadius: "10px 10px 0px 0px" }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "5px", }}>
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
                        <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem", }}>
                            {data.selectDisplay.type === "product_page" ? (
                                <div style={{ display: "flex", gap: "15px", margin: "12px 0px" }}>
                                    <div style={{ maxWidth: "400px" }}>
                                        <img src="https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-wire-bloom-earrings_afcace12-edfb-4c82-aba0-11462409947f.jpg?v=1758263758" width="100%" />
                                    </div>
                                    <div style={{ width: "400px" }}>
                                        <p style={{ fontSize: "25px", fontWeight: "600", color: data.title.fontColor, lineHeight: "normal" }}>Rose Gold Drop Earrings</p>
                                        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                                            {["Gold", "Rose Gold", "White Gold", "Silver"].map((_, index, arr) => (
                                                <div key={index} style={{ border: `1px solid ${data?.button?.buttonColor}`, padding: "5px 10px", borderRadius: "10px", cursor: "pointer", backgroundColor: index === 0 ? data?.button?.buttonColor : "", color: index === 0 ? data?.button?.textColor : "black" }}>
                                                    {_}
                                                </div>
                                            ))}
                                        </div>
                                        <p style={{
                                            margin: '10px 0px', fontSize: `${5 + Number(data.title.fontSize ?? 0)}px`, fontWeight: "500", color: data.title.fontColor, textAlign: data.tite_alignment.alignment === "left" ? "start"
                                                : data.tite_alignment.alignment === "center"
                                                    ? "center"
                                                    : "end"
                                        }}>Buy more, Save more</p>

                                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                            {[{ oPrice: "$42.00", price: "$38.00", discount: "20" }, { oPrice: "$59.00", price: "$84.00", discount: "30" }, { oPrice: "$126.00", price: "$63.00", discount: "50" }].map((_, index) => (
                                                <div key={index}>
                                                    <div style={{ border: `${data.border.borderWidth}px solid ${index === 0 ? data.border.color : "black"}`, borderRadius: `${data.border.borderRadius}px`, padding: "16px 12px", backgroundColor: "transparent", position: "relative" }}>
                                                        {index === 2 &&
                                                            <div style={{
                                                                width: "fit-content", backgroundColor: data?.button?.buttonColor, color: "white", padding: "1px 6px", borderRadius: "5px", position: "absolute", top: "-10px", right: "20px", fontWeight: 600, fontSize: "11px",
                                                            }}>Free Shipping</div>
                                                        }
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                                <RadioButton checked={index === 0} />
                                                                <p style={{ fontSize: `${5 + Number(data.title.fontSize ?? 0)}px`, fontWeight: data.title.fontWeight, color: data.title.fontColor, marginRight: "10px" }}>Buy {index + 1} items</p>
                                                                <Badge tone="new">Save {_?.discount}%</Badge>
                                                            </div>
                                                            <div style={{ marginLeft: "10px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                                                <p style={{ fontWeight: data.title.fontWeight, fontSize: `${data.title.fontSize + 3}px`, color: data.title.fontColor }}>{_?.price}</p>
                                                                <p style={{ fontWeight: data.title.fontWeight, fontSize: `${data.title.fontSize + 3}px`, color: data.title.fontColor, opacity: 0.5, marginLeft: "3px", textDecoration: "line-through" }}>{_?.oPrice}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                            <button style={{
                                                backgroundColor: `${data.button.buttonColor}`, border: "none", color: `${data.button.textColor}`, fontSize: "15px", cursor: "pointer", width: `${data?.button?.width}%`, padding: `${data?.button?.height}px 5px`, marginTop: "10px"
                                            }}>
                                                Add to cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : data?.selectDisplay.type === "included_product_page" ? (
                                <div style={{ display: "flex", flexDirection: "column", width: "50%", gap: "1rem", border: "1px solid black", padding: "12px", borderRadius: `8px`, background: data?.background?.background_type === "transparent" ? 'transparent' : data?.background?.background_color }}>
                                    <p style={{
                                        fontSize: `${5 + Number(data.title.fontSize ?? 0)}px`, fontWeight: "500", color: data.title.fontColor, textAlign: data.tite_alignment.alignment === "left" ? "start"
                                            : data.tite_alignment.alignment === "center"
                                                ? "center"
                                                : "end"
                                    }}>Buy more, Save more</p>

                                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                        {[{ oPrice: "$42.00", price: "$38.00", discount: "20", variant: [] }, {
                                            oPrice: "$59.00", price: "$84.00", discount: "30", variant: [{
                                                color: ["#C9A227", "#A75D67", "#F5F5F5", "#BFC1C2"]
                                            }],
                                        }, { oPrice: "$126.00", price: "$63.00", discount: "50", variant: [] }].map((offer, index) => (
                                            <div key={index}>
                                                <div style={{ border: `${data.border.borderWidth}px solid ${index === 1 ? data.border.color : "black"}`, borderRadius: `${data.border.borderRadius}px`, padding: "16px 12px", backgroundColor: "transparent", position: "relative" }}>
                                                    {index === 2 &&
                                                        <div style={{
                                                            width: "fit-content", backgroundColor: data?.button?.buttonColor, color: "white", padding: "1px 6px", borderRadius: "5px", position: "absolute", top: "-10px", right: "20px", fontWeight: 600, fontSize: "11px",
                                                        }}>Free Shipping</div>
                                                    }
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <div style={{ display: "flex", alignItems: "center" }}>
                                                            <input type="radio" checked={index === 1} style={{ accentColor: `${data.button.buttonColor}`, marginRight: "8px", width: "1rem", height: "1rem" }} />
                                                            <p style={{ fontSize: `${5 + Number(data.title.fontSize ?? 0)}px`, fontWeight: data.title.fontWeight, color: data.title.fontColor, marginRight: "10px" }}>Buy {index + 1} items</p>
                                                            <div style={{ backgroundColor: data?.button?.buttonColor, color: data?.button?.textColor, borderRadius: "10px", padding: "2px 8px" }}>Save {offer?.discount}%</div>
                                                        </div>
                                                        <div style={{ marginLeft: "10px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                                            <p style={{ fontWeight: data.title.fontWeight, fontSize: `${data.title.fontSize + 3}px`, color: data.title.fontColor }}>{offer?.price}</p>
                                                            <p style={{ fontWeight: data.title.fontWeight, fontSize: `${data.title.fontSize + 3}px`, color: data.title.fontColor, opacity: 0.5, marginLeft: "3px", textDecoration: "line-through" }}>{offer?.oPrice}</p>
                                                        </div>
                                                    </div>
                                                    {index === 1 &&
                                                        <VariantItems
                                                            variantType={data?.variants?.type}
                                                            variant={offer?.variant}
                                                            data={data}
                                                            defultSelect={false}
                                                        />
                                                    }
                                                    {index === 1 &&
                                                        <VariantItems
                                                            variantType={data?.variants?.type}
                                                            variant={offer?.variant}
                                                            data={data}
                                                            defultSelect={false}
                                                        />
                                                    }
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <button style={{
                                            backgroundColor: `${data.button.buttonColor}`, border: "none", color: `${data.button.textColor}`, fontSize: "15px", cursor: "pointer", width: `${data?.button?.width}%`, padding: `${data?.button?.height}px 5px`
                                        }}>
                                            Add to cart
                                        </button>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </Card>
                </div >
            </Grid.Cell >
        </Grid >
    );
}

export default Volumediscount;
