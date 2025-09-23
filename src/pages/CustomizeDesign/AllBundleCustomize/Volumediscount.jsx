// React Imports
import { useContext, useEffect, useState } from "react";

// Shopify Component
import { Collapsible, Icon, RangeSlider, Text, Card, Grid, Banner, Select, RadioButton, ButtonGroup, Button, Badge } from "@shopify/polaris";
import { AdjustIcon, ButtonIcon, CaretDownIcon, CaretUpIcon, ResetIcon, TextAlignCenterIcon, TextGrammarIcon, TextUnderlineIcon, VariantIcon, } from "@shopify/polaris-icons";

// Custom Component
import ColorPickerPopover from "../../../components/ColorPicker/ColorPickerPopover";
import { ShopifyContext } from "../../../components/ShopifyProvider/ShopifyProvider";
import { useFetchWithToken } from "../../../components/FetchDataAPIs/FetchWithToken";

function Volumediscount() {

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
            fontSize: 12,
            fontWeight: 600,
        },
        border: {
            color: "#7a26bf",
            borderWidth: 2,
            borderRadius: 10,
        },
        variants: {
            background_color: "#ffffff",
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
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <Banner
                                title="Preview uses sample content for layout demonstration. Your store's real data will appear after publishing."
                                tone="warning"
                            ></Banner>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem", }}>
                            {data.selectDisplay.type === "included_product_page" ? (
                                <div style={{ display: "flex", gap: "15px", margin: "12px 0px" }}>
                                    <div style={{ maxWidth: "400px" }}>
                                        <img
                                            src="https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-wire-bloom-earrings_afcace12-edfb-4c82-aba0-11462409947f.jpg?v=1758263758"
                                            width="100%"
                                            style={{ borderRadius: "10px", objectFit: "cover" }}
                                        />
                                    </div>
                                    <div style={{ width: "400px" }}>
                                        <p style={{
                                            fontSize: "25px", fontWeight: "600", color: data.title.fontColor, textAlign: data.tite_alignment.alignment === "left" ? "start"
                                                : data.tite_alignment.alignment === "center"
                                                    ? "center"
                                                    : "end"
                                        }}>Rose Gold Drop Earrings</p>
                                        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                                            {["Small", "Medium", "Large"].map((_, index, arr) => (
                                                <div key={index} style={{ border: `1px solid ${data?.button?.buttonColor}`, padding: "5px 10px", borderRadius: "10px", cursor: "pointer", backgroundColor: index === 0 ? data?.button?.buttonColor : "", color: index === 0 ? data?.button?.textColor : "black" }}>
                                                    {_}
                                                </div>
                                            ))}
                                        </div>
                                        <p style={{
                                            margin: '10px 0px', fontSize: `${5 + Number(data.title.fontSize ?? 0)}px`, fontWeight: "500", color: data.title.fontColor,
                                        }}>Buy more, Save more</p>

                                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                            {[{ oPrice: "$22.00", price: "$20.00", discount: "20" }, { oPrice: "$32.00", price: "$30.00", discount: "30" }, { oPrice: "$55.00", price: "$50.00", discount: "50" }].map((_, index) => (
                                                <div key={index}>
                                                    <div style={{ border: `${data.border.borderWidth}px solid ${index === 0 ? "red" : data.border.color}`, borderRadius: `${data.border.borderRadius}px`, padding: "16px 12px", backgroundColor: "transparent", position: "relative" }}>
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
                                                backgroundColor: `${data.button.buttonColor}`, border: "none", color: `${data.button.textColor}`, fontSize: "15px", cursor: "pointer", borderRadius: "10px", padding: "8px", width: `${data?.button?.width}%`, height: `${data?.button?.height}px`, marginTop: "10px"
                                            }}>
                                                Add to cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : null
                            }
                        </div >
                        <div style={{ display: "flex", justifyContent: "end", padding: "10px 10px 0px", borderTop: "1px solid black", margin: "10px -16px 0px -16px" }}>
                            <ButtonGroup>
                                <Button>Cancel</Button>
                                <Button variant="primary" onClick={handleSubmit}>Save</Button>
                            </ButtonGroup>
                        </div>
                    </Card >
                </div >
            </Grid.Cell >
        </Grid >
    );
}

export default Volumediscount;
