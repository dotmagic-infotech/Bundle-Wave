// React Imports
import { useContext, useEffect, useState } from "react";

// Shopify Component
import { Collapsible, Icon, RangeSlider, Text, Card, Grid, Banner, Divider, Select, Checkbox, Button, ButtonGroup } from "@shopify/polaris";
import { AdjustIcon, ButtonIcon, CaretDownIcon, CaretUpIcon, ChevronDownIcon, ResetIcon, TextAlignCenterIcon, TextGrammarIcon, TextUnderlineIcon, VariantIcon, XIcon, } from "@shopify/polaris-icons";

// Custom Component
import ColorPickerPopover from "../../../components/ColorPicker/ColorPickerPopover";
import { useFetchWithToken } from "../../../components/FetchDataAPIs/FetchWithToken";
import { ShopifyContext } from "../../../components/ShopifyProvider/ShopifyProvider";

function Addons() {
    // Hooks
    const fetchWithToken = useFetchWithToken();
    const { shopName } = useContext(ShopifyContext);

    // State
    const [openIndex, setOpenIndex] = useState(null);
    const [data, setData] = useState({
        selectDisplay: {
            type: "main_product_page",
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
            buttonColor: "#7a26bf",
            textColor: "#FFFFFF",
        },
    });

    const fetchCustomizeData = async () => {
        try {
            const data = await fetchWithToken({
                url: `https://bundle-wave-backend.xavierapps.com/api/get_customize?shop=${shopName}&path=addOns`,
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
            url: `https://bundle-wave-backend.xavierapps.com/api/update_customize?path=addOns&shop=${shopName}`,
            method: 'POST',
            body: passData,
            isFormData: false,
        });

        if (result.status) {
            shopify.toast.show(`Update Successful Customization Products Add-Ons`);
        } else {
            shopify.toast.show(`Failed to Update Customization Products Add-Ons`);
        }
    };

    return (
        <Grid gap={100}>
            <Grid.Cell columnSpan={{ xs: 6, md: 6, lg: 4, xl: 4 }}>
                <Card padding={0}>
                    <div style={{ padding: "8px", display: "flex", flexDirection: "column", gap: "5px" }}>
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
                            {data.selectDisplay.type === "main_product_page" ? (
                                <>
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
                                        <div style={{ width: "400px" }}>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                                <p style={{ fontSize: "25px", fontWeight: "700" }}>Bundle Title</p>
                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                    <p style={{ fontSize: "20px", fontWeight: "600" }}>Total Price</p>
                                                    <p style={{ fontSize: "20px", fontWeight: "600" }}>$156.00</p>
                                                </div>
                                                <Divider />
                                                <div>
                                                    <p>Quantity</p>
                                                    <div style={{ display: "flex", gap: "1.5rem", border: "1px solid black", borderRadius: "10px", padding: "10px", width: "fit-content", cursor: "pointer" }}>
                                                        <span style={{ fontSize: "25px", lineHeight: "15px" }}>−</span>
                                                        <p style={{ fontSize: "20px" }}>1</p>
                                                        <span style={{ fontSize: "25px", lineHeight: "15px" }}>+</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "10px 0px" }}>
                                                <p style={{
                                                    fontSize: `${8 + Number(data.title.fontSize ?? 0)}px`, fontWeight: "600", color: data.title.fontColor, textAlign: data.tite_alignment.alignment === "left" ? "start"
                                                        : data.tite_alignment.alignment === "center"
                                                            ? "center"
                                                            : "end"
                                                }}>Product Add-ons</p>
                                                <div style={{ backgroundColor: "red", color: "white", borderRadius: "10px", padding: "2px 7px" }}>20% OFF</div>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                                {[
                                                    "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-diamond-earrings_5e7739a0-261d-4788-96c9-ef77214aa70e.jpg?v=1758263764",
                                                    "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-wire-bloom-earrings_afcace12-edfb-4c82-aba0-11462409947f.jpg?v=1758263758"
                                                ].map((imgSrc, index) => (
                                                    <div key={index}>
                                                        <div style={{ border: `${data.border.borderWidth}px solid ${data.border.color}`, borderRadius: `${data.border.borderRadius}px`, padding: "10px", backgroundColor: "transparent" }}>
                                                            <div style={{ display: "flex", alignItems: "center", }}>
                                                                <Checkbox checked={index === 0} />
                                                                <img src={imgSrc}
                                                                    style={{ width: "50px", height: "50px", marginLeft: "10px", objectFit: "fill", borderRadius: "10px" }}
                                                                />
                                                                <div style={{ marginLeft: "10px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                                                    <p style={{ fontSize: `${data.title.fontSize}px`, color: data.title.fontColor, fontWeight: data.title.fontWeight }}>Product #{index + 1}</p>
                                                                    <div style={{ display: 'flex' }}>
                                                                        <p style={{ fontSize: `${data.title.fontSize}px`, color: data.title.fontColor, fontWeight: data.title.fontWeight }}>$20.00</p>
                                                                        <p style={{ fontSize: `${data.title.fontSize}px`, color: data.title.fontColor, fontWeight: data.title.fontWeight, opacity: 0.5, marginLeft: "3px", textDecoration: "line-through" }}>$25.00</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {index === 0 && (
                                                                <div style={{ backgroundColor: data.variants.background_color, border: `1px solid ${data.variants.border_color}`, display: "flex", justifyContent: "space-between", padding: "5px", borderRadius: "5px", margin: "10px 0px 0px 35px" }}>
                                                                    <p style={{ fontWeight: "500" }}>Select Variant</p>
                                                                    <div>
                                                                        <Icon source={ChevronDownIcon} />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <button style={{ marginTop: "20px", backgroundColor: data?.button?.buttonColor, color: data.button.textColor, cursor: "pointer", width: "100%", borderRadius: "10px", padding: "8px", border: "none" }}>Add to cart</button>
                                        </div>
                                        {/* <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "400px", }}>
                                            <p style={{ fontSize: "25px", fontWeight: "700" }}>Bundle Title</p>
                                            <div style={{ display: "flex", justifyContent: "space-between", }}>
                                                <p style={{ fontSize: "20px", fontWeight: "600" }}>Total Price</p>
                                                <p style={{ fontSize: "20px", fontWeight: "600" }}>$156.00</p>
                                            </div>
                                            <div style={{ display: "flex", gap: "10px" }}>
                                                {["Small", "Medium", "Large"].map((_, index, arr) => (
                                                    <div key={index} style={{ border: "2px solid black", padding: "5px 10px", borderRadius: "10px", cursor: "pointer" }}>
                                                        {_}
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ display: "flex", gap: "1.5rem", border: "1px solid black", borderRadius: "10px", padding: "10px", width: "fit-content", cursor: "pointer" }}>
                                                <span style={{ fontSize: "25px", lineHeight: "15px" }}>−</span>
                                                <p style={{ fontSize: "20px" }}>1</p>
                                                <span style={{ fontSize: "25px", lineHeight: "15px" }}>+</span>
                                            </div>
                                            <button style={{ backgroundColor: "black", border: "none", color: "white", fontSize: "15px", cursor: "pointer", borderRadius: "10px", padding: "8px", width: "100%" }}>
                                                Add to cart
                                            </button>
                                        </div> */}
                                    </div>
                                </>
                            ) : data.selectDisplay.type === "pop_up" ? (
                                <div style={{ backgroundColor: "white", borderRadius: "10px", padding: "10px", position: "relative" }}>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <img src="https://cdn.shopify.com/s/files/1/0839/1399/8619/products/gift_card.png?v=1698129037"
                                            style={{ width: "80px", height: "80px", objectFit: "fill", borderColor: `2px solid ${data.border.color}`, borderRadius: "10px" }}
                                        />
                                        <div style={{ marginLeft: "10px", display: "flex", flexDirection: "column", gap: "0.5rem", height: '65px', justifyContent: "space-around", width: "90%" }}>
                                            <p style={{ fontSize: `${data.title.fontSize}px`, color: data.title.fontColor, fontWeight: data.title.fontWeight }}>Product #1</p>
                                            <div style={{ display: 'flex', justifyContent: "space-between", width: "100%" }}>
                                                <div style={{ display: "flex" }}>
                                                    <p style={{ fontWeight: data.title.fontWeight, fontSize: `${data.title.fontSize}px`, color: data.title.fontColor }}>+ $20.00</p>
                                                    <p style={{ fontWeight: data.title.fontWeight, fontSize: `${data.title.fontSize}px`, color: data.title.fontColor, opacity: 0.5, marginLeft: "3px", textDecoration: "line-through" }}>$25.00</p>
                                                </div>
                                                <p style={{ padding: "1px 16px", backgroundColor: `${data?.background?.button_color}`, color: "white", borderRadius: "10px" }}>Added</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ margin: "10px -10px" }}>
                                        <Divider />
                                    </div>
                                    <p style={{ fontSize: `${5 + Number(data.title.fontSize ?? 0)}px`, fontWeight: data.title.fontWeight, margin: "15px 0px", textAlign: "start" }}>Product add-on</p>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                        {[
                                            "https://cdn.shopify.com/s/files/1/0839/1399/8619/files/Perfume_-_3.jpg?v=1756097546",
                                            "https://cdn.shopify.com/s/files/1/0839/1399/8619/files/Perfume_-_2.jpg?v=1756097545"
                                        ].map((imgSrc, index) => (
                                            <div key={index}>
                                                <div style={{ border: index === 1 ? `${data.border.borderWidth}px solid red` : `${data.border.borderWidth}px solid ${data.border.color}`, borderRadius: `${data.border.borderRadius}px`, padding: "10px", backgroundColor: "transparent" }}>
                                                    <div style={{ display: "flex", alignItems: "center", }}>
                                                        <Checkbox checked={index === 1} />
                                                        <img src={imgSrc}
                                                            style={{ width: "65px", height: "65px", objectFit: "fill", borderRadius: "10px" }}
                                                        />
                                                        <div style={{ marginLeft: "10px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                                            <p style={{ fontSize: `${data.title.fontSize}px`, color: data.title.fontColor, fontWeight: data.title.fontWeight }}>Product #{index + 2}</p>
                                                            <div style={{ display: 'flex' }}>
                                                                <p style={{ fontWeight: data.title.fontWeight, fontSize: `${data.title.fontSize}px`, color: data.title.fontColor }}>+ $20.00</p>
                                                                <p style={{ fontWeight: data.title.fontWeight, fontSize: `${data.title.fontSize}px`, color: data.title.fontColor, opacity: 0.5, marginLeft: "3px", textDecoration: "line-through" }}>$25.00</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {index === 1 && (
                                                        <div style={{ backgroundColor: `${data?.variants.background_color}`, border: `1px solid ${data.variants.border_color}`, display: "flex", justifyContent: "space-between", padding: "5px", borderRadius: "5px", width: "396px", margin: "10px 0px 0px 35px" }}>
                                                            <p style={{ fontWeight: "500" }}>Select Variant</p>
                                                            <div>
                                                                <Icon source={ChevronDownIcon} />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ margin: "10px -10px" }}>
                                        <Divider />
                                    </div>
                                    <button style={{ backgroundColor: data.button.buttonColor, border: "none", color: data.button.textColor, fontSize: `${data.title.fontSize}px`, fontWeight: "500", cursor: "pointer", borderRadius: "10px", padding: "8px", width: "100%", marginTop: "20px" }}>
                                        Add to cart
                                    </button>

                                    <div style={{ display: "flex", justifyContent: "end", margin: "10px 0px", position: "absolute", top: "-45px", right: "0px" }}>
                                        <Button icon={XIcon} variant='secondary'></Button>
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
        </Grid>
    );
}

export default Addons;
