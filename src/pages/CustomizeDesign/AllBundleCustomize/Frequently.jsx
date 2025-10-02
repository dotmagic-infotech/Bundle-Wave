// React Imports
import { useContext, useEffect, useState } from "react";

// Shopify Component
import { Collapsible, Icon, RangeSlider, Text, Card, Grid, Banner, Select, Button, ButtonGroup, Checkbox } from "@shopify/polaris";
import { AdjustIcon, ButtonIcon, CaretDownIcon, CaretUpIcon, ResetIcon, TextAlignCenterIcon, TextGrammarIcon, TextUnderlineIcon, VariantIcon } from "@shopify/polaris-icons";

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
    const [data, setData] = useState({
        selectDisplay: {
            type: "included_product_page",
        },
        tite_alignment: {
            alignment: "left"
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
            border_color: "#000000"
        },
        button: {
            width: 100,
            height: 45,
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
                        onChange={(value) =>
                            handleChangeValue("variants", "type", value)
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
            tite_alignment: {
                alignment: data.tite_alignment?.alignment
            },
            title: {
                fontColor: data.title?.fontColor,
                fontSize: data.title?.fontSize,
                fontWeight: data.title?.fontWeight,
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
                border_color: data.variants?.border_color
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
        { name: "Gold-Tone Dress Watch", image: 'https://cdn.shopify.com/s/files/1/0577/4242/6181/files/watch9.webp?v=1758272181', price: "$112.00"  },
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
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <Banner title="Preview uses sample content for layout demonstration. Your store's real data will appear after publishing." tone="warning"></Banner>
                        </div>
                        <div
                            style={{
                                display: "flex", justifyContent: "center", marginTop: "1rem", backgroundColor: data.selectDisplay.type === "pop_up" ? "rgba(117, 115, 115, 0.6)" : "transparent",
                                padding: data.selectDisplay.type === "pop_up" ? "55px" : ""
                            }}
                        >
                            {data.selectDisplay.type === "included_product_page" ? (
                                <div>
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <div style={{ maxWidth: "400px" }}>
                                            <img
                                                src="https://cdn.shopify.com/s/files/1/0577/4242/6181/files/watch4.webp?v=1758271387"
                                                width="100%"
                                                style={{ borderRadius: "10px", objectFit: "cover" }}
                                            />
                                            <div style={{ display: "flex", gap: "0.2rem" }}>
                                                <img
                                                    src="https://cdn.shopify.com/s/files/1/0577/4242/6181/files/watch5.jpg?v=1758271387"
                                                    width="60px"
                                                    height="60px"
                                                    style={{ borderRadius: "10px" }}
                                                />
                                                <img
                                                    src="https://cdn.shopify.com/s/files/1/0577/4242/6181/files/watch.webp?v=1758271387"
                                                    width="60px"
                                                    height="60px"
                                                    style={{ borderRadius: "10px" }}
                                                />
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "400px", }}>
                                            <p style={{ fontSize: "25px", fontWeight: "700", lineHeight: "normal" }}>Classic Leather Strap Watch</p>
                                            <div style={{ display: "flex", justifyContent: "space-between", }}>
                                                <p style={{ fontSize: "20px", fontWeight: "600" }}>Total Price</p>
                                                <p style={{ fontSize: "20px", fontWeight: "600" }}>$85.00</p>
                                            </div>
                                            <div style={{ display: "flex", gap: "10px" }}>
                                                {["Case Material", "Strap", "Dial Color", "Size"].map((_, index, arr) => (
                                                    <div key={index} style={{ border: `2px solid ${data?.border?.color}`, backgroundColor: index === 0 ? `${data?.button?.buttonColor}` : "transparent", color: index === 0 ? `${data?.button?.textColor}` : "black", padding: "5px 10px", borderRadius: "10px", cursor: "pointer" }}>
                                                        {_}
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "center" }}>
                                                <button style={{
                                                    backgroundColor: data.button.buttonColor, border: "none", color: data.button.textColor, fontSize: `${data.title.fontSize + 3}px`, fontWeight: "500", cursor: "pointer", borderRadius: "10px", width: `${data?.button?.width}%`, padding: `${data?.button?.height}px 5px`,
                                                }}>
                                                    Add to cart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <p style={{
                                            fontSize: `${16 + Number(data.title.fontSize ?? 0)}px`, fontWeight: "600", margin: '1.5rem 0px', color: data.title.fontColor,
                                            textAlign:
                                                data.tite_alignment.alignment === "left"
                                                    ? "start"
                                                    : data.tite_alignment.alignment === "center"
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
                                                        <VariantItems variantType={data?.variants?.type} variant={imgSrc?.variant} data={data} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", minWidth: "150px" }}>
                                                <div style={{ display: "flex", gap: '7px' }}>
                                                    <p style={{ fontSize: `${data?.title?.fontSize + 3}px`, fontWeight: "500" }}>Total: </p>
                                                    <div style={{ display: 'flex' }}>
                                                        <p style={{ fontWeight: "600", fontSize: `${data.title.fontSize + 3}px`, color: data.title.fontColor }}>$30.00</p>
                                                        <p style={{ fontWeight: "600", fontSize: `${data.title.fontSize + 3}px`, color: data.title.fontColor, opacity: 0.5, marginLeft: "3px", textDecoration: "line-through" }}>$35.00</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <button style={{
                                                        backgroundColor: data.button.buttonColor,
                                                        border: "none",
                                                        color: data.button.textColor,
                                                        fontSize: `${data.title.fontSize + 3}px`,
                                                        fontWeight: "500",
                                                        cursor: "pointer",
                                                        borderRadius: "10px",
                                                        padding: `${data?.button?.height}px 5px`,
                                                        width: `${data?.button?.width}%`
                                                    }}>Add selected to cart</button>
                                                </div>
                                            </div>
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
            </Grid.Cell >
        </Grid >
    );
}

export default Frequently;
