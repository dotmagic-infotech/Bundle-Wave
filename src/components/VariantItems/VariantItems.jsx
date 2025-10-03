// React Imports
import { useState } from "react";

// Shopify Imports
import { Icon } from "@shopify/polaris";
import { ChevronDownIcon, ChevronRightIcon } from "@shopify/polaris-icons";

export default function VariantItems({ variantType, variant = [], data }) {
    const firstVariant = variant[0] || {};

    // State
    const [open, setOpen] = useState(true);

    const handleSwatch = () => {
        setOpen((prev) => !prev);
    };

    return (
        <div>
            {variantType === "dropdown" ? (
                variant.length > 0 && (
                    <div style={{ border: `1px solid ${data?.variants?.border_color}`, display: "flex", justifyContent: "space-between", padding: "5px", borderRadius: "5px", width: "100%", marginTop: "10px" }}>
                        <p style={{ fontWeight: "500" }}>Select Variant</p>
                        <div><Icon source={ChevronDownIcon} /></div>
                    </div>
                )
            ) : (
                variant.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
                        <div style={{ backgroundColor: "transparent", border: `1px solid black`, padding: "8px", borderRadius: "5px", width: "100%" }}>
                            <div style={{ display: "flex", gap: "5px", cursor: "pointer", userSelect: "none" }} onClick={handleSwatch}>
                                {open ?
                                    <div><Icon source={ChevronDownIcon} /></div>
                                    :
                                    <div><Icon source={ChevronRightIcon} /></div>
                                }
                                <p style={{ fontWeight: "500" }}>Select Variant</p>
                            </div>
                            {open &&
                                <>
                                    <div style={{ marginTop: "5px", maxHeight: open ? "500px" : "0", opacity: open ? 1 : 0, overflow: "hidden", transition: "all 0.3s ease" }}>
                                        {firstVariant?.size?.length > 0 && (
                                            <div>
                                                <p style={{ fontSize: "15px", fontWeight: "400", marginBottom: "5px" }}>Size</p>
                                                <div style={{ display: "flex", gap: "8px" }}>
                                                    {firstVariant.size.map((s, i) => (
                                                        <button key={i} style={{ padding: "5px 10px", borderRadius: "4px", border: `1px solid ${data?.variants?.border_color}`, cursor: "pointer", backgroundColor: `${i === 0 ? data?.variants?.background_color : "transparent"}`, color: `${i === 0 ? data?.variants?.text_color : "black"}`, fontSize: "14px", fontWeight: "500" }}>
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ marginTop: "5px", maxHeight: open ? "500px" : "0", opacity: open ? 1 : 0, overflow: "hidden", transition: "all 0.3s ease" }}>
                                        {firstVariant?.color?.length > 0 && (
                                            <div>
                                                <p style={{ fontSize: "15px", fontWeight: "400", marginBottom: "5px" }}>Color</p>
                                                <div style={{ display: "flex", gap: "8px" }}>
                                                    {firstVariant.color.map((c, i) => (
                                                        <div key={i} style={{ border: `2px solid ${i === 0 ? data?.variants?.border_color : "transparent"}`, padding: "2px", borderRadius: "50%", cursor: "pointer" }}>
                                                            <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: c }} title={c} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                )
            )}
        </div>
    )
}
