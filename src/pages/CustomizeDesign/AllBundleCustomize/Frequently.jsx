// React Imports
import { useContext, useEffect, useState } from "react";

// Shopify Component
import { Collapsible, Icon, RangeSlider, Text, Card, Grid, Banner, Select, Button, ButtonGroup } from "@shopify/polaris";
import { AdjustIcon, ButtonIcon, CaretDownIcon, CaretUpIcon, ChevronDownIcon, ResetIcon, TextAlignCenterIcon, TextGrammarIcon, TextUnderlineIcon, VariantIcon, } from "@shopify/polaris-icons";

// Custom Component
import ColorPickerPopover from "../../../components/ColorPicker/ColorPickerPopover";
import { useFetchWithToken } from "../../../components/FetchDataAPIs/FetchWithToken";
import { ShopifyContext } from "../../../components/ShopifyProvider/ShopifyProvider";

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
            color: "#000000",
            borderWidth: 2,
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
                url: `https://test-app.dotmagicinfotech.in/api/get_customize?shop=${shopName}&path=Frequently`,
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
                type: data.selectDisplay.type,
            },
            tite_alignment: {
                alignment: data.tite_alignment.alignment
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
            variants: {
                background_color: data.variants.background_color,
                border_color: data.variants.border_color
            },
            button: {
                buttonColor: data.button.buttonColor,
                textColor: data.button.textColor,
            },
        }

        const result = await fetchWithToken({
            url: `https://test-app.dotmagicinfotech.in/api/update_customize?path=Frequently&shop=${shopName}`,
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
                                backgroundColor: data.selectDisplay.type === "pop_up" ? "rgba(117, 115, 115, 0.6)" : "transparent",
                                padding: data.selectDisplay.type === "pop_up" ? "55px" : ""
                            }}
                        >
                            {data.selectDisplay.type === "included_product_page" ? (
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <p style={{
                                        fontSize: `${16 + Number(data.title.fontSize ?? 0)}px`,
                                        fontWeight: "600",
                                        marginBottom: '1.5rem',
                                        color: data.title.fontColor,
                                        textAlign:
                                            data.tite_alignment.alignment === "left"
                                                ? "start"
                                                : data.tite_alignment.alignment === "center"
                                                    ? "center"
                                                    : "end"
                                    }}>Frequently bought together</p>
                                    <div style={{ display: "flex", gap: "1.5rem" }}>
                                        <div style={{ display: "flex", gap: "30px" }}>
                                            {[
                                                "https://cdn.shopify.com/s/files/1/0839/1399/8619/files/71vRMHVXtiL._AC_SX679.jpg?v=1747905444",
                                                "https://cdn.shopify.com/s/files/1/0839/1399/8619/files/ZenithElPrimeroChronomaster.jpg?v=1750136339"
                                            ].map((imgSrc, index, arr) => (
                                                <div key={index} style={{ width: "150px" }}>
                                                    <div style={{ flex: "0 0 auto" }}>
                                                        <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                                                            <img
                                                                src={imgSrc}
                                                                width="150px"
                                                                height="150px"
                                                                style={{ borderRadius: data.border.borderRadius, border: `${data.border.borderWidth}px solid ${data.border.color}` }}
                                                            />
                                                            {index !== arr.length - 1 && (
                                                                <p style={{ fontSize: "1.5rem", fontWeight: "bold", margin: "0px -10px", position: "absolute", right: "-13px", color: data.title.fontColor }}>+</p>
                                                            )}
                                                        </div>
                                                        <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, marginTop: "10px", color: data.title.fontColor }}>Product #1</p>
                                                        <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: data.title.fontWeight, marginTop: "5px", color: data.title.fontColor }}>$10.00</p>
                                                    </div>
                                                    <div style={{ backgroundColor: data.variants.background_color, border: `1px solid ${data.variants.border_color}`, display: "flex", justifyContent: "space-between", padding: "5px", borderRadius: "5px", width: "100%", marginTop: "10px" }}>
                                                        <p style={{ fontWeight: "500" }}>Select Variant</p>
                                                        <div>
                                                            <Icon source={ChevronDownIcon} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "150px" }}>
                                            <div style={{ display: "flex", gap: '20px', justifyContent: "center" }}>
                                                <p style={{ fontSize: `${data.title.fontSize}px`, fontWeight: "500" }}>Total: </p>
                                                <div style={{ display: 'flex' }}>
                                                    <p style={{ fontWeight: "600", fontSize: `${data.title.fontSize}px`, color: data.title.fontColor }}>$20.00</p>
                                                    <p style={{ fontWeight: "600", fontSize: `${data.title.fontSize}px`, color: data.title.fontColor, opacity: 0.5, marginLeft: "3px", textDecoration: "line-through" }}>$25.00</p>
                                                </div>
                                            </div>
                                            <div>
                                                <button style={{
                                                    backgroundColor: data.button.buttonColor,
                                                    border: "none",
                                                    color: data.button.textColor,
                                                    fontSize: `${data.title.fontSize}px`,
                                                    fontWeight: "500",
                                                    cursor: "pointer",
                                                    borderRadius: "10px",
                                                    padding: "8px",
                                                    width: "100%"
                                                }}>Add selected to cart</button>

                                                <p style={{ textAlign: "center", marginTop: "10px" }}>Powered by{" "}
                                                    <a style={{ color: `${data.button.buttonColor}`, textDecoration: "underline", cursor: "pointer" }} href='https://dotmagicinfotech.com/' target='_blank'>
                                                        dotmagicinfotech
                                                    </a>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div >
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
        </Grid>
    );
}

export default Frequently;
