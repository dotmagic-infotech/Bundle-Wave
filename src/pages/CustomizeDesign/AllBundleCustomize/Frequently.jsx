// React Imports
import { useContext, useEffect, useState } from "react";

// Shopify Component
import { Collapsible, Icon, RangeSlider, Text, Card, Grid, Select, Button, ButtonGroup, Checkbox, Divider } from "@shopify/polaris";
import { AdjustIcon, ButtonIcon, CaretDownIcon, CaretUpIcon, ColorIcon, ResetIcon, TextAlignCenterIcon, TextGrammarIcon, TextUnderlineIcon, VariantIcon } from "@shopify/polaris-icons";

// Custom Component
import ColorPickerPopover from "../../../components/ColorPicker/ColorPickerPopover";
import { useFetchWithToken } from "../../../components/FetchDataAPIs/FetchWithToken";
import { ShopifyContext } from "../../../components/ShopifyProvider/ShopifyProvider";
import VariantItems from "../../../components/VariantItems/VariantItems";

function Frequently() {

    // Hooks
    const fetchWithToken = useFetchWithToken();
    const { shopName } = useContext(ShopifyContext);

    // State
    const [openIndex, setOpenIndex] = useState(null);
    const [selection, setSelection] = useState("selected");
    const [data, setData] = useState({
        selectDisplay: {
            type: "included_product_page",
        },
        title_setting: {
            titleSize: 30,
            titleWeight: 600,
            alignment: "left"
        },
        background: {
            background_type: "transparent",
            background_color: "#FFFFFF",
            text_color: "#000000",
        },
        title: {
            fontColor: "#000000",
            fontSize: 14,
            fontWeight: 400,
        },
        border: {
            color: "#7a26bf",
            borderWidth: 2,
            borderRadius: 10,
        },
        variants: {
            type: "color_swatch",
            background_color: "#ffffff",
            text_color: "#000000",
            border_color: "#000000",
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
                url: `https://bundle-wave-backend.xavierapps.com/api/get_customize?shop=${shopName}&path=Frequently`,
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
                            { label: "Included products page", value: "included_product_page" },
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
                                color={data.background.background_color}
                                onChange={(color) => handleChangeValue("background", "background_color", color)}
                            />
                            <hr style={{ margin: "13px 0px", borderTop: "1px solid #DDDDDD" }} />
                            <ColorPickerPopover
                                lable="Text Color"
                                color={data?.background?.text_color}
                                onChange={(color) => handleChangeValue("background", "text_color", color)}
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
                type: data.selectDisplay?.type,
            },
            title_setting: {
                titleSize: data.title_setting?.titleSize,
                titleWeight: data.title_setting?.titleWeight,
                alignment: data.title_setting?.alignment,
            },
            title: {
                fontColor: data.title?.fontColor,
                fontSize: data.title?.fontSize,
                fontWeight: data.title?.fontWeight,
            },
            background: {
                background_type: data?.background?.background_type,
                background_color: data?.background?.background_color,
                text_color: data?.background?.text_color,
            },
            border: {
                color: data.border?.color,
                borderWidth: data.border?.borderWidth,
                borderRadius: data.border?.borderRadius,
            },
            variants: {
                type: data?.variants?.type,
                background_color: data.variants?.background_color,
                text_color: data.variants?.text_color,
                border_color: data.variants?.border_color,
                unselected_background_color: data.variants?.unselected_background_color,
                unselected_text_color: data.variants.unselected_text_color,
                unselected_border_color: data.variants?.unselected_border_color

            },
            button: {
                width: data.button.width,
                height: data.button.height,
                buttonColor: data.button?.buttonColor,
                textColor: data.button?.textColor,
            },
        }

        const result = await fetchWithToken({
            url: `https://bundle-wave-backend.xavierapps.com/api/update_customize?path=Frequently&shop=${shopName}`,
            method: 'POST',
            body: passData,
            isFormData: false,
        });

        if (result.status) {
            shopify.toast.show(`Update Successful Customization Frequently Bought Together`);
        } else {
            shopify.toast.show(`Failed to Update Customization Frequently Bought Together`);
        }
    }

    const product = [
        {
            name: "Minimalist Silver Mesh Watch", image: 'https://cdn.shopify.com/s/files/1/0577/4242/6181/files/watch10.jpg?v=1758272181', price: "$84.00",
            variant: [
                { color: ["#000000", "#8B4513", "#D2B48C"] }
            ],
        },
        { name: "Gold-Tone Dress Watch", image: 'https://cdn.shopify.com/s/files/1/0577/4242/6181/files/watch9.webp?v=1758272181', price: "$112.00" },
        { name: "Automatic Skeleton Watch", image: 'https://cdn.shopify.com/s/files/1/0577/4242/6181/files/watch2.webp?v=1758271387', price: "$156.00" }
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
                                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
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
                        <div
                            style={{
                                display: "flex", justifyContent: "center", marginTop: "1rem", backgroundColor: data.selectDisplay.type === "pop_up" ? "rgba(117, 115, 115, 0.6)" : "transparent",
                                padding: data.selectDisplay.type === "pop_up" ? "55px" : ""
                            }}
                        >
                            {data.selectDisplay.type === "included_product_page" ? (
                                <div style={{ width: "100%", display: "flex", flexDirection: "column", overflow: "auto", scrollbarWidth: "thin", margin: "1rem 0px" }}>
                                    <p style={{
                                        fontSize: `${data.title_setting.titleSize}px`, fontWeight: data.title_setting.titleWeight, marginBottom: '1.5rem', color: data.title.fontColor,
                                        textAlign:
                                            data.title_setting.alignment === "left"
                                                ? "start"
                                                : data.title_setting.alignment === "center"
                                                    ? "center"
                                                    : "end"
                                    }}>Frequently bought together</p>
                                    <div style={{ display: "flex", gap: "1.5rem" }}>
                                        <div style={{ display: "flex", gap: "30px" }}>
                                            {product.map((imgSrc, index, arr) => (
                                                <div key={index} style={{ width: "150px" }}>
                                                    <div style={{ flex: "0 0 auto" }}>
                                                        <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                                                            <img src={imgSrc?.image} width="150px" height="150px" style={{ borderRadius: data.border.borderRadius, border: `${data.border.borderWidth}px solid ${data.border.color}` }}
                                                            />
                                                            <div style={{ position: "absolute", top: "6px", right: "0px" }}>
                                                                <Checkbox checked={index === 0} />
                                                            </div>
                                                            {index !== arr.length - 1 && (
                                                                <p style={{ fontSize: "1.5rem", fontWeight: "bold", margin: "0px -10px", position: "absolute", right: "-13px", color: data.title.fontColor }}>+</p>
                                                            )}
                                                        </div>
                                                        <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, marginTop: "10px", color: data.title.fontColor }}>{imgSrc?.name}</p>
                                                        <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, marginTop: "5px", color: data.title.fontColor }}>{imgSrc?.price}</p>
                                                    </div>
                                                    <VariantItems variantType={data?.variants?.type} variant={imgSrc?.variant} data={data} defultSelect={false} />
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ background: data?.background?.background_type === "transparent" ? 'transparent' : data?.background?.background_color, color: data?.background?.background_type === "transparent" ? 'black' : data?.background?.text_color, borderRadius: "12px", padding: "24px", minWidth: "240px", height: "fit-content", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: "7px" }}>
                                            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                                                <span style={{ fontSize: "18px" }}>Total:</span>
                                                <div>
                                                    <span style={{ fontSize: "20px", fontWeight: "600" }}>$42.00</span>
                                                    <span style={{ fontSize: "14px", textDecoration: "line-through", marginLeft: "5px" }}>$84.00</span>
                                                </div>
                                            </div>
                                            <div style={{ fontSize: "13px" }}>Save 10% when buying together!</div>
                                            <button style={{ width: "100%", background: data.button.buttonColor, color: data.button.textColor, border: "none", padding: "10px 24px", fontSize: "15px", fontWeight: 500, cursor: "pointer", transition: "background 0.2s" }}>Add selected to cart</button>
                                            <div style={{ textAlign: "center", fontSize: "13px" }}>1 items selected</div>
                                        </div>
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

export default Frequently;
