// React Imports
import { useState } from "react";

// Shopify Imports
import { Button, Modal, Checkbox, RadioButton, Divider } from "@shopify/polaris";

// Shopify Icons
import { BlankIcon, ChevronDownIcon, ChevronRightIcon } from "@shopify/polaris-icons";

const BundlesPreview = ({ bundle_type_id, modalSize = "fullScreen", type = "", title, description, discount_value = "", media = [], data = [], products = [], offerProducts = [], collections = [], secondCollection = [], discountOptions = [], sections = [], discountOption = [], buysX = [], getY = [], finalPrice = "", total = "" }) => {

    // State
    const [active, setActive] = useState(false);
    const [checkedItems, setCheckedItems] = useState({});
    const [selectedOption, setSelectedOption] = useState(0);
    const [selectedFirst, setSelectedFirst] = useState(0);

    const toggleModal = (() => setActive((active) => !active));

    const handleCheckboxChange = (index) => {
        setCheckedItems((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const handleCheckboxFour = (index) => {
        setSelectedOption(index);
    };

    const handleDisable = () => {
        if (bundle_type_id === "1") {
            return products.length === 0
        } else if (bundle_type_id === "2") {
            const Data = type === "Single" ? sections?.length === 0 : (products?.length === 0 && collections?.length === 0)

            return Data;
        } else if (bundle_type_id === "3") {
            return (buysX.length === 0 || getY.length === 0);
        } else if (bundle_type_id === "4") {
            const Data = type === "specific_product" ? products?.length === 0 : collections?.length === 0

            return Data;
        } else if (bundle_type_id === "5") {
            return (products.length === 0 || collections.length === 0) && secondCollection.length === 0;
        } else if (bundle_type_id === "6") {
            return products.length === 0;
        }
        return false;
    };

    const getSectionImage = (section) => {
        if (section?.collection?.length > 0) return section.collection[0]?.image;
        if (section?.products?.length > 0) return section.products[0]?.image;
        if (section?.media) return section.media;
        if (section?.sectionImage?.length > 0) return section.sectionImage[0];
        return "";
    };

    const renderBundle = () => {
        switch (bundle_type_id) {
            case "1":
                return (
                    <>
                        <div style={{ maxHeight: '1000px', padding: "20px" }}>
                            <div style={{ display: "flex", gap: "15px" }}>
                                <div style={{ width: "50%" }}>
                                    <img
                                        src={media?.[0] || products?.[0]?.image}
                                        style={{ width: "100%", height: "465px", }}
                                    />

                                    <div style={{ display: "flex", gap: "10px" }}>
                                        {products?.slice(0, 4).map((img, index) => (
                                            <img
                                                key={index}
                                                src={img?.image}
                                                width="100"
                                                height="100"
                                                style={{
                                                    cursor: "pointer",
                                                    border: "1px solid #ccc",
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div style={{ width: "50%" }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", borderRadius: "10px", backgroundColor: "transparent" }}>
                                        <p style={{ marginTop: '10px', fontSize: "2rem", fontWeight: "500", marginBottom: "10px" }}>{title}</p>
                                        <div style={{ display: "flex", justifyContent: "space-between", }}>
                                            <p style={{ fontSize: "20px", fontWeight: "500" }}>Total Price</p>
                                            <div style={{ display: "flex", alignItems: 'center', gap: "10px" }}>
                                                <p style={{ fontSize: "20px", fontWeight: "600" }}>${finalPrice}</p>
                                                {data?.discount_option_id !== "5" &&
                                                    <p style={{ fontSize: "18px", fontWeight: "600", textDecoration: "line-through" }}>${total}</p>
                                                }
                                            </div>
                                        </div>
                                        <Divider borderColor="border-hover" />
                                        <div style={{ backgroundColor: "white", width: "100%", height: "auto" }}>
                                            {products?.length > 0 && products.map((product, index) => (
                                                <div key={index}>
                                                    <div style={{ display: "flex" }}>
                                                        <img src={product?.image} alt={product?.title} style={{ width: "72px", height: "72px", objectFit: "fill" }} />
                                                        <div style={{ marginLeft: "10px" }}>
                                                            <p style={{ fontSize: "15px", fontWeight: "500" }}>{product?.title}</p>
                                                            <p style={{ fontSize: "15px", marginTop: '10px', fontWeight: "500" }}>${product?.variants[0]?.price}</p>
                                                        </div>
                                                    </div>
                                                    {index !== products.length - 1 && (
                                                        <div style={{ margin: "10px 0px" }}>
                                                            <Divider />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <button disabled style={{
                                        backgroundColor: "rgb(122, 38, 191)",
                                        border: "none",
                                        color: "rgb(255, 255, 255)",
                                        fontSize: "18px",
                                        cursor: "pointer",
                                        width: "100%",
                                        padding: "10px 5px",
                                        marginTop: "10px"
                                    }}>Add bundle to cart | Save {discount_value}%</button>
                                    <div
                                        style={{ marginTop: "10px" }}
                                        dangerouslySetInnerHTML={{ __html: description }}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )
            case "2":
                return (
                    <div style={{ maxHeight: '1000px', display: "flex", padding: "20px" }}>
                        <div style={{ width: "50%" }}>
                            {data?.bundle_subtype === "Single" ? (
                                <img src={sections?.[0]?.products?.[0]?.image || sections?.[0]?.collection?.[0]?.image} style={{ width: "100%", height: "465px", objectFit: "cover" }} />
                            ) : (
                                <img src={products?.[0]?.image} style={{ width: "100%", height: "465px", objectFit: "cover" }} />
                            )}
                            <div style={{ display: "flex", gap: "10px" }}>
                                {sections?.[0]?.products?.slice(0, 4).map((img, index) => (
                                    <img key={index} src={img?.image} width="100" height="100"
                                        style={{
                                            cursor: "pointer",
                                            border: "1px solid #ccc",
                                        }}
                                    />
                                ))}
                                {products?.slice(0, 4).map((img, index) => (
                                    <img key={index} src={img?.image} width="100" height="100"
                                        style={{
                                            cursor: "pointer",
                                            border: "1px solid #ccc",
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div style={{ width: "50%", paddingLeft: "20px" }}>
                            {type === "Single" && (
                                <>
                                    <p style={{ marginTop: '10px', lineHeight: 1, fontSize: "2rem", fontWeight: "500", marginBottom: "25px" }}>{title}</p>
                                    <div style={{ border: "1px solid gray", borderRadius: "10px", display: "flex", flexDirection: "column", marginBottom: "-6px" }}>
                                        {sections.map((value, index) => {
                                            const sectionImg = getSectionImage(value);

                                            return (
                                                <div key={index}>
                                                    <div style={{ display: "flex", justifyContent: "space-between", padding: "15px 10px" }}>
                                                        <div style={{ display: "flex" }}>
                                                            <div style={{ cursor: "pointer", display: 'flex' }}>
                                                                {selectedFirst === "" ? (
                                                                    <Button icon={ChevronRightIcon} variant="plain" onClick={() => setSelectedFirst(index)} />
                                                                ) : (
                                                                    <Button icon={ChevronDownIcon} variant="plain" onClick={() => setSelectedFirst("")} />
                                                                )}
                                                            </div>

                                                            <img src={sectionImg} width="72" height="72" style={{ marginLeft: "10px" }} />

                                                            <div style={{ marginLeft: "10px" }}>
                                                                <p style={{ fontSize: "16px", fontWeight: 500 }}>{value?.sectionTitle || value?.collection?.[0]?.title}</p>
                                                                <p style={{ marginTop: '10px', fontSize: "15px" }}>{value?.discription}</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {value.discountRequirement === "exact_quantity"
                                                                ? <p style={{ fontSize: "14px", color: "#555" }}>Add exactly {value.quantity} item(s)</p>
                                                                : value.discountRequirement === "minimum_quantity"
                                                                    ? <p style={{ fontSize: "14px", color: "#555" }}>Add at least {value.minimum} item(s)</p>
                                                                    : value.discountRequirement === "range_quantity"
                                                                        ? <p style={{ fontSize: "14px", color: "#555" }}>Add between {value.minimum} and {value.maximum} item(s)</p>
                                                                        : ""}
                                                        </div>
                                                    </div>

                                                    <div style={{ margin: "0px 10px" }}>
                                                        <Divider />
                                                    </div>

                                                    {selectedFirst === index && (
                                                        <div>
                                                            {value?.products?.map((product, index) => (
                                                                <div key={index}>
                                                                    <div style={{ display: "flex", justifyContent: "space-between", padding: "15px 10px" }}>
                                                                        <div style={{ display: 'flex' }}>
                                                                            <img src={product?.image} width="72" height="72" style={{ marginLeft: "10px" }} />
                                                                            <div style={{ marginLeft: "10px" }}>
                                                                                <p style={{ fontSize: "16px", fontWeight: 500 }}>{product?.title}</p>
                                                                                <p style={{ fontSize: "16px", marginTop: '10px', fontWeight: 500 }}>${product?.variants[0]?.price}</p>
                                                                            </div>
                                                                        </div>
                                                                        <select disabled class="addon-variant-select" style={{ width: "67px", height: "31px", borderRadius: "8px", padding: "0px 8px", backgroundColor: "black", color: "white" }}>
                                                                            <option value="" selected>Add</option>
                                                                        </select>
                                                                    </div>
                                                                    {index !== value.products.length - 1 && <Divider />}
                                                                </div>
                                                            ))}

                                                            {value?.collection?.map((product, index) => (
                                                                <div key={index}>
                                                                    <div style={{ display: "flex", padding: "15px 10px" }}>
                                                                        <img src={product?.image} width="72" height="72" style={{ marginLeft: "10px" }} />
                                                                        <div style={{ marginLeft: "10px" }}>
                                                                            <p style={{ fontSize: "16px", fontWeight: 500 }}>{product?.title}</p>
                                                                            <p style={{ fontSize: "16px", marginTop: '10px', fontWeight: 500 }}>$50.00</p>
                                                                        </div>
                                                                    </div>
                                                                    {index !== value.collection.length - 1 && <Divider />}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {index !== sections.length - 1 && <Divider />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div style={{ backgroundColor: `#efefef`, display: "flex", justifyContent: "space-between", padding: "10px", borderRadius: "5px", width: "100%", marginTop: "18px" }}>
                                        <p style={{ fontWeight: "500", fontSize: "1rem" }}>Total Price</p>
                                        <p style={{ fontWeight: "500", fontSize: "1rem" }}>0 items added</p>
                                    </div>
                                    <button style={{
                                        backgroundColor: "#7a26bf", marginTop: "10px", border: "none", color: "white", fontSize: "18px", fontWeight: "400", cursor: "pointer", width: "100%", borderRadius: "10px", padding: `10px`,
                                    }}>Add to cart | Save {data?.discount_value}%</button>
                                    <div style={{ fontSize: "15px", fontWeight: "500", marginTop: "10px" }} dangerouslySetInnerHTML={{ __html: data?.bundle_description || "" }} />
                                </>
                            )}

                            {type === "Tiered" && (
                                <>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                        <p style={{ fontSize: "1.5rem", fontWeight: "500" }}>{title}</p>
                                        <div style={{ display: "flex", gap: "0.5rem" }}>
                                            {discountOption?.map((option, index) => (
                                                <div key={index} style={{
                                                    backgroundColor: index === 0 ? "#7a26bf" : "#dddddd",
                                                    color: index === 0 ? "#FFFFFF" : "#000000",
                                                    borderRadius: "10px",
                                                    opacity: 0.9,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    cursor: "pointer",
                                                    gap: "0.5rem",
                                                    padding: "10px",
                                                    width: "100%",
                                                    boxShadow: "0 0 10px rgba(0,0,0,0.1)"
                                                }}>
                                                    <p style={{ fontWeight: 600, fontSize: "1.3rem", textAlign: "center" }}>
                                                        {option.buy_start}+ <span style={{ fontWeight: 500, fontSize: "1rem" }}>Items</span>
                                                    </p>
                                                    <p style={{ fontWeight: 500, fontSize: "0.9rem", textAlign: "center" }}>
                                                        {option?.discountValue}% OFF
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            {products?.length > 0 && products.map((value, index) => (
                                                <div key={index}>
                                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                        <div style={{ display: "flex" }}>
                                                            <img src={value?.image} width="72" height="72" />
                                                            <div style={{ marginLeft: "10px" }}>
                                                                <p style={{ fontSize: "16px", fontWeight: 500 }}>{value?.title}</p>
                                                                <p style={{ fontSize: "16px", marginTop: '10px', fontWeight: 500 }}>${value?.variants[0]?.price}</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {value?.variants?.length > 1 ?
                                                                <select disabled style={{
                                                                    width: "67px", height: "31px", borderRadius: "8px", padding: "0px 8px", backgroundColor: "#7a26bf", color: "white", border: "none"
                                                                }}>
                                                                    <option value="" selected="">Add</option>
                                                                </select>
                                                                :
                                                                <button disabled style={{
                                                                    width: "67px", height: "31px", borderRadius: "8px", padding: "0px 8px", backgroundColor: "#7a26bf", color: "white", border: "none"
                                                                }}>Add</button>
                                                            }
                                                        </div>
                                                    </div>
                                                    {index !== products.length - 1 && (
                                                        <hr style={{ margin: "10px 0px" }} />
                                                    )}
                                                </div>
                                            ))}
                                            {collections?.length > 0 && collections.map((value, index) => (
                                                <div key={index}>
                                                    <div>
                                                        <div style={{ display: "flex" }}>
                                                            <img src={value?.image} style={{ width: "60px", height: "60px", objectFit: "fill", borderRadius: "10px" }} />
                                                            <div style={{ marginLeft: "10px" }}>
                                                                <p>{value?.title}</p>
                                                                <p style={{ marginTop: '5px', fontWeight: "500" }}>$50.00</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {index !== collections.length - 1 && (
                                                        <div style={{ margin: "15px 10px" }}>
                                                            <Divider />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <button disabled style={{
                                            backgroundColor: "rgb(122, 38, 191)",
                                            border: "none",
                                            color: "rgb(255, 255, 255)",
                                            fontSize: "18px",
                                            cursor: "pointer",
                                            borderRadius: "10px",
                                            width: "100%",
                                            padding: "10px 5px",
                                        }}>Add to cart</button>
                                        <div style={{ fontSize: "15px", fontWeight: "500" }} dangerouslySetInnerHTML={{ __html: data?.bundle_description || "" }} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )
            case "3":
                return (
                    <div style={{ maxHeight: '1000px', display: "flex", padding: "20px" }}>
                        <div style={{ width: "50%" }}>
                            <img src={media[0] || buysX[0]?.image || collections[0]?.image} style={{ width: "100%", height: "465px" }} />
                            <div style={{ display: "flex", gap: "10px" }}>
                                {buysX?.slice(0, 4).map((img, index) => (
                                    <img key={index} src={img?.image} width="100" height="100" style={{ cursor: "pointer" }} />
                                ))}
                            </div>
                        </div>

                        <div style={{ width: "50%", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
                            <p style={{ fontSize: "1.5rem", fontWeight: "500", marginBottom: "10px" }}>{title}</p>

                            <div style={{ display: "flex", justifyContent: "space-between", }}>
                                <p style={{ fontSize: "20px", fontWeight: "500" }}>Total Price</p>
                                <div style={{ display: "flex", alignItems: 'center', gap: "10px" }}>
                                    <p style={{ fontSize: "20px", fontWeight: "600" }}>${finalPrice}</p>
                                    {data?.discount_option_id !== "5" &&
                                        <p style={{ fontSize: "20px", fontWeight: "600", textDecoration: "line-through" }}>${total.toFixed(2)}</p>
                                    }
                                </div>
                            </div>

                            <Divider borderColor="border-hover" />

                            <div style={{ border: "1px solid gray", borderRadius: "10px", display: "flex", flexDirection: "column", marginBottom: "-6px" }}>
                                {buysX.map((value, index) => (
                                    <div key={index}>
                                        <div style={{ padding: "15px 10px" }}>
                                            <div style={{ display: "flex" }}>
                                                <img src={value?.image} width="72" height="72" />
                                                <div style={{ marginLeft: "10px" }}>
                                                    <p style={{ fontSize: "15px", fontWeight: "500" }}>{value?.title}</p>
                                                    <p style={{ fontSize: "15px", marginTop: '10px', fontWeight: "500" }}>{value?.variants?.[0]?.price ? `$${value?.variants?.[0]?.price}` : ""}</p>
                                                </div>
                                            </div>
                                            {value?.variants?.length > 1 &&
                                                <select disabled style={{ width: "100%", height: "36px", backgroundColor: "#fafafa", borderRadius: "8px", marginTop: "10px" }}>
                                                    <option selected>
                                                        Variants
                                                    </option>
                                                </select>
                                            }
                                        </div>
                                        {index !== buysX.length - 1 && (
                                            <hr style={{ margin: "0px 10px" }} />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", margin: "-15px 0px" }}>
                                <button disabled style={{ backgroundColor: "rgb(122, 38, 191)", border: "none", color: "rgb(255, 255, 255)", cursor: "pointer", width: "40px", height: "40px", borderRadius: "50%", padding: "8px 8px 16px", fontWeight: 500, fontSize: "33px", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1 }}>+</button>
                            </div>
                            <div style={{ border: "1px solid gray", borderRadius: "10px", display: "flex", flexDirection: "column", marginTop: "-6px", position: "relative", overflow: "hidden" }}>
                                {getY.map((value, index) => (
                                    <div key={index} style={{ position: "relative" }}>
                                        <div style={{ padding: "15px 10px" }}>
                                            <div style={{ display: "flex" }}>
                                                <img src={value?.image} width="72" height="72" />
                                                <div style={{ marginLeft: "10px" }}>
                                                    <p style={{ fontSize: "15px", fontWeight: "500" }}>{value?.title}</p>
                                                    <p style={{ fontSize: "15px", marginTop: '10px', fontWeight: "500" }}>${value?.variants[0]?.price}</p>
                                                </div>
                                            </div>
                                            {value?.variants?.length > 1 &&
                                                <select disabled style={{ width: "100%", height: "36px", backgroundColor: "#fafafa", borderRadius: "8px", marginTop: "10px" }}>
                                                    <option selected>
                                                        Variants
                                                    </option>
                                                </select>
                                            }
                                        </div>

                                        {index === 0 && (
                                            <div style={{ position: 'absolute', top: "10px", right: "-19px", width: "95px", height: "23px", transform: "rotate(39deg)", backgroundColor: "rgb(122, 38, 191)", color: "white", padding: "10px", fontWeight: "500", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                {data?.discount_value === "100" ? "FREE" : `${data?.discount_value}% OFF`}
                                            </div>
                                        )}

                                        {index !== getY.length - 1 && (
                                            <hr style={{ margin: "0px 10px" }} />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button disabled style={{
                                backgroundColor: "rgb(122, 38, 191)", border: "none", color: "white", fontSize: "18px", cursor: "pointer", borderRadius: "10px", width: "100%", padding: "10px 5px",
                            }}>Add to cart</button>

                            <div style={{ fontSize: "15px", fontWeight: "500" }} dangerouslySetInnerHTML={{ __html: data?.bundle_description || "" }} />
                        </div>
                    </div>
                )
            case "4":
                return (
                    <div style={{ height: '500px', display: "flex", padding: "20px" }}>
                        <div style={{ width: "50%" }}>
                            <img
                                src={products[0]?.image || collections[0]?.image}
                                style={{ width: "100%", height: "470px", }}
                            />
                        </div>
                        <div style={{ width: "50%", paddingLeft: "20px" }}>
                            <p style={{ fontSize: "1.5rem", fontWeight: "500" }}>{products[0]?.title || collections[0]?.title}</p>

                            {products[0]?.variants?.length > 1 &&
                                <div style={{ marginTop: "18px" }}>
                                    <p style={{ fontSize: "14px", fontWeight: 400, color: "black", margin: "4px 0px", }}>Denominations</p>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                                        {products[0]?.variants.map((value, index) => (
                                            <div key={index} style={{ lineHeight: "normal", cursor: "pointer", backgroundColor: index === 0 ? "#7a26bf" : "", color: index === 0 ? "white" : "", border: `1px solid #7a26bf`, padding: "8px 10px", borderRadius: "10px" }}>
                                                {value?.title}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            }

                            <p style={{ margin: '18px 0px 12px 0px', fontSize: "1rem", fontWeight: "600" }}>{title}</p>

                            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                {discountOptions.map((value, index) => (
                                    <div key={index}>
                                        <div style={{ border: "2px solid", borderColor: value?.selected_default === "1" ? "#7a26bf" : "black", borderRadius: "10px", padding: "30px 15px", position: "relative" }}>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}>
                                                <div style={{ display: "flex", alignItems: "center", }}>
                                                    <RadioButton
                                                        checked={value?.selected_default === "1"}
                                                        onChange={() => handleCheckboxFour(index)}
                                                    />
                                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                                        <p style={{ fontSize: "15px", fontWeight: "600" }}>{value?.description}</p>
                                                        {value?.Label &&
                                                            <p style={{ backgroundColor: "black", padding: "0px 10px", color: 'white', borderRadius: "10px", fontSize: "10px" }}>{value?.Label}</p>
                                                        }
                                                    </div>
                                                </div>
                                                <p style={{ fontWeight: "500", fontSize: "1rem" }}>${total}</p>
                                            </div>
                                            {value?.Badge &&
                                                <div style={{ backgroundColor: "#7a26bf", display: "flex", justifyContent: 'center', alignItems: "center", position: "absolute", right: "20px", top: "-11px", padding: '2px 8px', fontSize: "11px", color: "white", borderRadius: "4px", fontWeight: "500" }}>
                                                    {value?.Badge}
                                                </div>
                                            }
                                            {value?.selected_default === "1" &&
                                                <>
                                                    {value?.required_items > 3 &&
                                                        <div style={{ marginTop: "10px" }}>
                                                            <Divider />
                                                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                                                                <p>Quantity</p>
                                                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                                    <div style={{ width: "20px", height: "20px", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "black", color: "white", borderRadius: "10px", cursor: "pointer", userSelect: "none" }}>-</div>
                                                                    {value?.required_items}
                                                                    <div style={{ width: "20px", height: "20px", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "black", color: "white", borderRadius: "10px", cursor: "pointer", userSelect: "none" }}>+</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                </>
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button disabled style={{
                                backgroundColor: "rgb(122, 38, 191)", border: "none", color: "white", fontSize: "18px", cursor: "pointer", borderRadius: "10px", width: "100%", padding: "10px 5px", margin: "10px 0px"
                            }}>Add to cart</button>
                        </div>
                    </div>
                )
            case "5":
                return (
                    <div style={{ height: '500px', display: "flex", gap: "20px", padding: "20px" }}>
                        <div style={{ width: "50%" }}>
                            <img
                                src={products[0]?.image || collections[0]?.image}
                                style={{ width: "100%", height: "465px", }}
                            />
                            <div style={{ display: "flex", gap: "10px" }}>
                                {secondCollection?.slice(0, 4).map((img, index) => (
                                    <img
                                        key={index}
                                        src={img?.image}
                                        width="100"
                                        height="100"
                                        style={{
                                            cursor: "pointer",
                                            border: "1px solid #ccc",
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div style={{ width: "50%", display: "flex", flexDirection: "column", gap: "10px" }}>
                            <p style={{ fontSize: "1.5rem", fontWeight: "500" }}>{products[0]?.title || collections[0]?.title}</p>
                            <p>{data?.bundle_description}</p>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <p style={{ fontSize: "18px", fontWeight: 500, color: "black" }}>{data?.bundle_title}</p>
                                <p style={{ backgroundColor: "#7a26bf", color: "white", padding: "0px 6px", height: "fit-content", borderRadius: "5px", fontSize: "12px" }}>{data?.discount_value}% OFF</p>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                {secondCollection.map((value, index) => {
                                    const isChecked = data?.selectedAddonIds.includes(value?.id) ? true : false;

                                    return (
                                        <div key={index}>
                                            <div style={{ border: "2px solid black", borderRadius: "10px", display: "flex", alignItems: "center", padding: "10px", cursor: "pointer" }}>
                                                <Checkbox checked={isChecked || !!checkedItems[index]} onChange={() => handleCheckboxChange(index)} />
                                                <img src={value?.image} width="72" height="72" />
                                                <div style={{ marginLeft: "10px" }}>
                                                    <p style={{ fontSize: "15px", fontWeight: "500" }}>{value?.title}</p>
                                                    <p style={{ fontSize: "15px", marginTop: "10px", fontWeight: "500" }}>${value?.variants[0]?.price}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <button disabled style={{
                                backgroundColor: "rgb(122, 38, 191)",
                                border: "none",
                                color: "rgb(255, 255, 255)",
                                fontSize: "18px",
                                cursor: "pointer",
                                borderRadius: "10px",
                                width: "100%",
                                padding: "10px 5px",
                                marginTop: "10px"
                            }}>Add to cart</button>
                        </div>
                    </div >
                )
            case "6":
                return (
                    <div style={{ padding: "20px" }}>
                        <div style={{ maxHeight: '1000px', display: "flex", gap: "15px" }}>
                            <div style={{ width: "50%" }}>
                                <img
                                    src={media?.[0] || products?.[0]?.image}
                                    style={{ width: "100%", height: "465px", }}
                                />

                                <div style={{ display: "flex", gap: "10px" }}>
                                    {products?.slice(0, 4).map((img, index) => (
                                        <img
                                            key={index}
                                            src={img?.image}
                                            width="100"
                                            height="100"
                                            style={{
                                                cursor: "pointer",
                                                border: "1px solid #ccc",
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div style={{ width: "50%", display: "flex", flexDirection: "column", gap: "10px" }}>
                                <p style={{ marginTop: '10px', fontSize: "2rem", fontWeight: "500", marginBottom: "10px" }}>{products?.[0]?.title}</p>
                                <div style={{ display: "flex", justifyContent: "space-between", }}>
                                    <p style={{ fontSize: "20px", fontWeight: "500" }}>Total Price</p>
                                    <div style={{ display: "flex", alignItems: 'center', gap: "10px" }}>
                                        <p style={{ fontSize: "20px", fontWeight: "600" }}>${products?.[0]?.variants?.[0]?.price}</p>
                                    </div>
                                </div>
                                <Divider borderColor="border-hover" />

                                {products[0]?.variants?.length > 1 &&
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                                        {products[0]?.variants.map((value, index) => (
                                            <div key={index} style={{ lineHeight: "normal", cursor: "pointer", backgroundColor: index === 0 ? "#7a26bf" : "", color: index === 0 ? "white" : "", border: `2px solid #7a26bf`, padding: "8px 10px", borderRadius: "10px" }}>
                                                {value?.title}
                                            </div>
                                        ))}
                                    </div>
                                }

                                <button disabled style={{
                                    backgroundColor: "rgb(122, 38, 191)",
                                    border: "none",
                                    color: "rgb(255, 255, 255)",
                                    fontSize: "18px",
                                    cursor: "pointer",
                                    borderRadius: "10px",
                                    width: "100%",
                                    padding: "10px 5px",
                                    marginTop: "10px"
                                }}>Add to cart</button>
                            </div>
                        </div>
                        <p style={{ margin: '25px 0px', fontSize: "2rem", fontWeight: "500", marginBottom: "10px" }}>{data?.bundle_title}</p>
                        <div style={{
                            display: "flex",
                            overflowX: "auto",
                            paddingBottom: "10px",
                            marginTop: "10px"
                        }}>
                            {offerProducts.map((item, index, arr) => (
                                <div key={index} style={{ flex: "0 0 auto" }}>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <div style={{ position: "relative", width: "150px", height: "150px" }}>
                                            <img
                                                src={item?.image || "https://via.placeholder.com/150"}
                                                width="150px"
                                                height="150px"
                                                style={{ width: "100%", height: "100%", borderRadius: "10px" }}
                                            />
                                            <div style={{ position: "absolute", top: "8px", right: "8px" }}>
                                                <Checkbox labelHidden />
                                            </div>
                                        </div>

                                        {index !== arr.length - 1 && (
                                            <p style={{ fontSize: "1.5rem", fontWeight: "bold", margin: "0px 10px" }}>+</p>
                                        )}
                                    </div>
                                    <p style={{ fontSize: "0.8rem", marginTop: "3px", width: "150px" }}>{item.title}</p>
                                    <p style={{ fontSize: "1rem", fontWeight: "600", marginTop: "3px" }}>${item.variants[0]?.price}</p>
                                </div>
                            ))}
                            <div style={{
                                display: "flex",
                                margin: "1rem",
                                flexDirection: "column",
                                gap: "0.5rem",
                                padding: "10px",
                                width: "200px"
                            }}>
                                <p style={{ fontSize: "1rem", fontWeight: "600" }}>Total: ${total}</p>
                                <button disabled style={{
                                    backgroundColor: "rgb(122, 38, 191)",
                                    border: "none",
                                    color: "rgb(255, 255, 255)",
                                    fontSize: "18px",
                                    cursor: "pointer",
                                    borderRadius: "10px",
                                    width: "100%",
                                    padding: "10px 5px",
                                    marginTop: "10px"
                                }}>Add to cart</button>
                            </div>
                        </div>
                    </div>
                )
            default:
                return <p>Invalid Bundle Type</p>;
        }
    };

    return (
        <div>
            <Button icon={BlankIcon} onClick={toggleModal} disabled={handleDisable()}>Full Screen</Button>
            <Modal
                open={active}
                size={modalSize}
                onClose={toggleModal}
                title="Bundle preview"
                secondaryActions={[
                    {
                        content: 'Close preview',
                        onAction: toggleModal,
                    },
                ]}
            >
                {renderBundle()}
            </Modal>
        </div>
    )
};

export default BundlesPreview;
