// React Imports
import { useMemo, useState } from "react";

// Shopify Component
import { Collapsible, Icon, RangeSlider, Text, Card, Grid, Divider, Select, Button, ButtonGroup } from "@shopify/polaris";
import { AdjustIcon, ButtonIcon, CaretDownIcon, CaretUpIcon, ColorIcon, ResetIcon, TextAlignCenterIcon, TextGrammarIcon, TextUnderlineIcon, VariantIcon, XIcon, } from "@shopify/polaris-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Custom Component
import ColorPickerPopover from "../../../components/ColorPicker/ColorPickerPopover";
import { useFetchWithToken } from "../../../components/FetchDataAPIs/FetchWithToken";
import VariantItems from "../../../components/VariantItems/VariantItems";

const defaultData = {
    selectDisplay: { type: "main_product_page" },
    title_setting: { titleSize: 30, titleWeight: 600, alignment: "left" },
    background: { background_type: "transparent", background_color: "#FFFFFF" },
    title: { fontColor: "#000000", fontSize: 14, fontWeight: 400 },
    border: { color: "#7a26bf", borderWidth: 2, borderRadius: 10 },
    variants: {
        type: "color_swatch",
        background_color: "#ffffff",
        text_color: "#000000",
        border_color: "#7a26bf",
        unselected_background_color: "#FFFFFF",
        unselected_text_color: "#000000",
        unselected_border_color: "#000000",
    },
    button: { width: 100, height: 10, buttonColor: "#7a26bf", textColor: "#FFFFFF" },
};

function Addons() {
    // Hooks
    const fetchWithToken = useFetchWithToken();
    const queryClient = useQueryClient();

    // State
    const [openIndex, setOpenIndex] = useState(null);
    const [selection, setSelection] = useState("selected");
    const [localData, setLocalData] = useState(null);

    const fetchCustomize = async () => {
        return await fetchWithToken({
            url: `https://bundle-wave-backend.xavierapps.com/api/get_customize?path=addOns`,
            method: "GET",
        });
    };

    const { data: apiData, isLoading, refetch } = useQuery({
        queryKey: ["customize", "addOns"],
        queryFn: fetchCustomize,
        staleTime: 0,
    });

    const data = useMemo(() => {
        return {
            ...defaultData,
            ...(apiData || {}),
            ...(localData || {}),
        };
    }, [apiData, localData]);

    const handleChangeValue = (section, key, value) => {
        setLocalData(prev => ({
            ...(prev ?? {}),
            [section]: {
                ...(prev?.[section] ?? data[section]),
                [key]: value,
            },
        }));
    };

    const updateCustomizeMutation = useMutation({
        mutationFn: async (payload) => {
            return await fetchWithToken({
                url: `https://bundle-wave-backend.xavierapps.com/api/update_customize?path=addOns`,
                method: "POST",
                body: payload,
                isFormData: false,
            });
        },
        onSuccess: (result) => {
            if (result?.status) {
                queryClient.invalidateQueries(["customize", "addOns"]);
                shopify.toast.show("Update Successful Customization Add-Ons Bundle");
                setLocalData(null);
            } else {
                shopify.toast.show("Failed to Update Customization Add-Ons Bundle");
            }
        },
        onError: () => {
            shopify.toast.show("Something went wrong");
        },
    });

    const handleSubmit = async () => {
        const passData = {
            selectDisplay: {
                type: data.selectDisplay.type,
            },
            title_setting: {
                titleSize: data.title_setting.titleSize,
                titleWeight: data.title_setting.titleWeight,
                alignment: data.title_setting.alignment,
            },
            background: {
                background_type: data?.background?.background_type,
                background_color: data?.background?.background_color,
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
                textColor: data.button.textColor,
            },
        }

        updateCustomizeMutation.mutate(passData);
    };

    const handleUndo = () => {
        setLocalData(null);
        refetch();
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
                            { label: "Product page", value: "main_product_page" },
                            { label: "Included Product Page", value: "included_product_page" },
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

    const product = [
        {
            name: "Classic Leather Strap Watch", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/watch4.webp?v=1758271387", price: "$85.00", oprice: "$90.00", variant: [
                {
                    color: ["#000000", "#8B4513", "#D2B48C", "#1E3A8A"]
                }
            ],
        },
        { name: "Stainless Steel Chronograph Watch", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/watch5.jpg?v=1758271387", price: "$150.00", oprice: "$155.00" },
        { name: "Minimalist Silver Mesh Watch", image: "https://cdn.shopify.com/s/files/1/0577/4242/6181/files/watch.webp?v=1758271387", price: "$95.00", oprice: "$100.00" }
    ];

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
                            onClick={handleUndo}
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
                                <Button variant="primary" onClick={handleSubmit} loading={isLoading}>Save</Button>
                            </ButtonGroup>
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
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <div style={{ maxWidth: "400px" }}>
                                        <img
                                            src="https://cdn.shopify.com/s/files/1/0577/4242/6181/files/watch4.webp?v=1758271387"
                                            width="100%"
                                        />
                                        <div style={{ display: "flex", gap: "0.2rem" }}>
                                            <img
                                                src="https://cdn.shopify.com/s/files/1/0577/4242/6181/files/watch5.jpg?v=1758271387"
                                                width="80px"
                                                height="80px"
                                            />
                                            <img
                                                src="https://cdn.shopify.com/s/files/1/0577/4242/6181/files/watch.webp?v=1758271387"
                                                width="80px"
                                                height="80px"
                                            />
                                        </div>
                                    </div>
                                    <div style={{ width: "400px", color: data.title.fontColor, }}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", lineHeight: "normal" }}>
                                            <p style={{ fontSize: `${data.title_setting.titleSize}px`, fontWeight: data.title_setting.titleWeight }}>✨ Add-Ons Bundle</p>
                                            <p style={{ fontSize: `${data.title_setting.titleSize}px`, fontWeight: data.title_setting.titleWeight }}>$85.00</p>
                                        </div>
                                        <p style={{ fontSize: `${data?.title?.fontSize}`, fontWeight: `${data?.title?.fontWeight}`, margin: '10px 0px' }}>Complete your look with our exclusive add-ons! Pair your favorite earrings with matching styles for extra sparkle and savings.</p>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "10px 0px" }}>
                                            <p style={{
                                                fontSize: `${data.title.fontSize}px`, fontWeight: "600", color: data.title.fontColor, textAlign: data.title_setting.alignment === "left" ? "start"
                                                    : data.title_setting.alignment === "center"
                                                        ? "center"
                                                        : "end"
                                            }}>Product Add-ons</p>
                                            <div style={{ backgroundColor: `${data?.button?.buttonColor}`, color: `${data?.button?.textColor}`, borderRadius: "5px", padding: "2px 7px" }}>20% OFF</div>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                            {product.map((imgSrc, index) => (
                                                <div key={index}>
                                                    <div style={{ border: index === 0 ? `${data.border.borderWidth}px solid ${data.border.color}` : `${data.border.borderWidth}px solid black`, borderRadius: `${data.border.borderRadius}px`, padding: "10px", backgroundColor: "transparent" }}>
                                                        <div style={{ display: "flex", alignItems: "center", }}>
                                                            <input type="checkbox" checked={index === 0} style={{ width: "1rem", height: "1rem", accentColor: `${data.button.buttonColor}`, color: `${data.button.textColor}`, marginRight: "10px" }} />
                                                            <img src={imgSrc?.image} style={{ width: "60px", height: "60px" }} />
                                                            <div style={{ marginLeft: "10px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                                                <p style={{ fontSize: `${data.title.fontSize}px`, color: data.title.fontColor, fontWeight: data.title.fontWeight }}>{imgSrc?.name}</p>
                                                                <div style={{ display: 'flex' }}>
                                                                    <p style={{ fontSize: `${data.title.fontSize}px`, color: data.title.fontColor, fontWeight: data.title.fontWeight }}>{imgSrc?.price}</p>
                                                                    <p style={{ fontSize: `${data.title.fontSize}px`, color: data.title.fontColor, fontWeight: data.title.fontWeight, opacity: 0.5, marginLeft: "3px", textDecoration: "line-through" }}>{imgSrc?.oprice}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <VariantItems variantType={data?.variants?.type} variant={imgSrc?.variant} data={data} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                            <button style={{ marginTop: "20px", backgroundColor: data?.button?.buttonColor, color: data.button.textColor, cursor: "pointer", width: `${data?.button?.width}%`, padding: `${data?.button?.height}px 5px`, border: "none", fontSize: "18px" }}>Add to cart</button>
                                        </div>
                                    </div>
                                </div>
                            ) : data.selectDisplay.type === "included_product_page" ? (
                                <div style={{ display: "flex", flexDirection: "column", width: "50%", border: `1px solid black`, padding: "12px", borderRadius: `8px`, background: data?.background?.background_type === "transparent" ? 'transparent' : data?.background?.background_color }}>
                                    <div style={{
                                        display: "flex", justifyContent: data.title_setting.alignment === "left" ? "start"
                                            : data.title_setting.alignment === "center"
                                                ? "center"
                                                : "end", alignItems: "center", gap: "10px", marginBottom: "12px"
                                    }}>
                                        <p style={{
                                            fontSize: `${data.title_setting.titleSize}px`, fontWeight: data.title_setting.titleWeight, color: data.title.fontColor, lineHeight: 1,
                                        }}>Product Add-ons</p>
                                        <div style={{ backgroundColor: `${data?.button?.buttonColor}`, color: `${data?.button?.textColor}`, borderRadius: "5px", padding: "2px 7px" }}>20% OFF</div>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                        {product.map((imgSrc, index) => (
                                            <div key={index}>
                                                <div style={{ border: index === 0 ? `${data.border.borderWidth}px solid ${data.border.color}` : `${data.border.borderWidth}px solid black`, borderRadius: `${data.border.borderRadius}px`, padding: "10px", backgroundColor: "transparent" }}>
                                                    <div style={{ display: "flex", alignItems: "center", }}>
                                                        <input type="checkbox" checked={index === 0} style={{ accentColor: `${data.button.buttonColor}`, marginRight: "8px", width: "1rem", height: "1rem" }} />
                                                        <img src={imgSrc?.image} style={{ width: "60px", height: "60px" }} />
                                                        <div style={{ marginLeft: "10px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                                            <p style={{ fontSize: `${data.title.fontSize}px`, color: data.title.fontColor, fontWeight: data.title.fontWeight }}>{imgSrc?.name}</p>
                                                            <div style={{ display: 'flex' }}>
                                                                <p style={{ fontSize: `${data.title.fontSize}px`, color: data.title.fontColor, fontWeight: data.title.fontWeight }}>{imgSrc?.price}</p>
                                                                <p style={{ fontSize: `${data.title.fontSize}px`, color: data.title.fontColor, fontWeight: data.title.fontWeight, opacity: 0.5, marginLeft: "3px", textDecoration: "line-through" }}>{imgSrc?.oprice}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <VariantItems variantType={data?.variants?.type} variant={imgSrc?.variant} data={data} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <button style={{ marginTop: "20px", backgroundColor: data?.button?.buttonColor, color: data.button.textColor, cursor: "pointer", width: `${data?.button?.width}%`, padding: `${data?.button?.height}px 5px`, border: "none", fontSize: "18px" }}>Add to cart</button>
                                    </div>
                                </div>
                            ) : data.selectDisplay.type === "pop_up" ? (
                                <div style={{ backgroundColor: "white", borderRadius: "10px", padding: "10px", position: "relative" }}>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <img src="https://cdn.shopify.com/s/files/1/0577/4242/6181/files/18k-rose-gold-rose-ring.jpg?v=1758263771"
                                            style={{ width: "80px", height: "80px", objectFit: "fill" }}
                                        />
                                        <div style={{ marginLeft: "10px", display: "flex", flexDirection: "column", gap: "0.5rem", height: '65px', justifyContent: "space-around", width: "90%" }}>
                                            <p style={{ fontSize: `${data.title.fontSize}px`, color: data.title.fontColor, fontWeight: data.title.fontWeight }}>18k Pedal Ring</p>
                                            <div style={{ display: 'flex', justifyContent: "space-between", width: "100%" }}>
                                                <div style={{ display: "flex" }}>
                                                    <p style={{ fontWeight: data.title.fontWeight, fontSize: `${data.title.fontSize}px`, color: data.title.fontColor }}>$45.00</p>
                                                    <p style={{ fontWeight: data.title.fontWeight, fontSize: `${data.title.fontSize}px`, color: data.title.fontColor, opacity: 0.5, marginLeft: "3px", textDecoration: "line-through" }}>$47.00</p>
                                                </div>
                                                <p style={{ padding: "1px 16px", backgroundColor: `${data?.background?.button_color}`, color: "white", borderRadius: "10px" }}>Added</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ margin: "10px -10px" }}>
                                        <Divider borderColor="border-hover" />
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "10px 0px" }}>
                                        <p style={{
                                            fontSize: `${8 + Number(data.title.fontSize ?? 0)}px`, fontWeight: "600", color: data.title.fontColor, textAlign: data.title_setting.alignment === "left" ? "start"
                                                : data.title_setting.alignment === "center"
                                                    ? "center"
                                                    : "end"
                                        }}>Product Add-ons</p>
                                        <div style={{ backgroundColor: `${data?.button?.buttonColor}`, color: `${data?.button?.textColor}`, borderRadius: "5px", padding: "2px 7px" }}>20% OFF</div>
                                    </div>
                                    <p style={{ fontSize: `${data?.title?.fontSize}`, fontWeight: `${data?.title?.fontWeight}`, margin: '10px 0px' }}>Complete your look with our exclusive add-ons! Pair your favorite earrings<br /> with matching styles for extra sparkle and savings.</p>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                        {product.map((imgSrc, index) => (
                                            <div key={index}>
                                                <div style={{ border: index === 1 ? `${data.border.borderWidth}px solid ${data.border.color}` : `${data.border.borderWidth}px solid black`, borderRadius: `${data.border.borderRadius}px`, padding: "10px", backgroundColor: "transparent" }}>
                                                    <div style={{ display: "flex", alignItems: "center", }}>
                                                        <input type="checkbox" checked={index === 0} style={{ width: "1rem", height: "1rem", accentColor: `${data.button.buttonColor}`, color: `${data.button.textColor}`, marginRight: "10px" }} />
                                                        <img src={imgSrc?.image}
                                                            style={{ width: "60px", height: "60px", objectFit: "fill" }}
                                                        />
                                                        <div style={{ marginLeft: "10px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                                            <p style={{ fontSize: `${data.title.fontSize}px`, color: data.title.fontColor, fontWeight: data.title.fontWeight }}>{imgSrc?.name}</p>
                                                            <div style={{ display: 'flex' }}>
                                                                <p style={{ fontWeight: data.title.fontWeight, fontSize: `${data.title.fontSize}px`, color: data.title.fontColor }}>{imgSrc?.price}</p>
                                                                <p style={{ fontWeight: data.title.fontWeight, fontSize: `${data.title.fontSize}px`, color: data.title.fontColor, opacity: 0.5, marginLeft: "3px", textDecoration: "line-through" }}>{imgSrc?.oprice}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <VariantItems variantType={data?.variants?.type} variant={imgSrc?.variant} data={data} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ margin: "10px -10px" }}>
                                        <Divider borderColor="border-hover" />
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <button style={{ backgroundColor: data.button.buttonColor, border: "none", color: data.button.textColor, fontSize: "18px", cursor: "pointer", width: `${data?.button?.width}%`, padding: `${data?.button?.height}px 5px`, marginTop: "2px" }}>
                                            Add to cart
                                        </button>
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "end", margin: "10px 0px", position: "absolute", top: "-45px", right: "0px" }}>
                                        <Button icon={XIcon} variant='secondary'></Button>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </Card>
                </div>
            </Grid.Cell>
        </Grid>
    );
}

export default Addons;
