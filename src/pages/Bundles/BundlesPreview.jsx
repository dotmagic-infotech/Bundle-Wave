// React Imports
import { useState } from "react";

// Shopify Imports
import { Button, Modal, Checkbox, RadioButton, Divider, Banner } from "@shopify/polaris";

// Shopify Icons
import { BlankIcon, ChevronDownIcon, ChevronRightIcon } from "@shopify/polaris-icons";

const BundlesPreview = ({
    bundle_type_id,
    modalSize = "fullScreen",
    type = "",
    title,
    description,
    discount_value = "",
    media = [],
    data = [],
    products = [],
    offerProducts = [],
    collections = [],
    secondCollection = [],
    discountOptions = [],
    sections = [],
    discountOption = [],
    buysX = [],
    getY = [],
}) => {

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
                                        id="main-image"
                                        src={media?.[0] || products?.[0]?.image}
                                        style={{ width: "100%", height: "465px", }}
                                        alt="Main"
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
                                                onClick={() => {
                                                    const mainImage = document.getElementById("main-image");
                                                    if (mainImage) mainImage.src = img;
                                                }}
                                                alt={`Thumbnail ${index + 1}`}
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
                                                <p style={{ fontSize: "20px", fontWeight: "600" }}>$57.50</p>
                                                <p style={{ fontSize: "20px", fontWeight: "600", textDecoration: "line-through" }}>$72.00</p>
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
                                        borderRadius: "10px",
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
                            <img
                                src={"https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="}
                                style={{ width: "100%", height: "465px", objectFit: "cover" }}
                            />
                        </div>
                        <div style={{ width: "50%", paddingLeft: "20px" }}>
                            {type === "Single" && (
                                <>
                                    <p style={{ marginTop: '10px', fontSize: "2rem", fontWeight: "500", marginBottom: "25px" }}>{title}</p>
                                    <p style={{ marginTop: '10px', fontSize: "1rem", fontWeight: "400", marginBottom: "25px" }}>$559.00 <span style={{ textDecoration: "line-through", marginLeft: "5px" }}>$1199.11</span></p>
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

                                                            <img src={sectionImg} style={{ width: "60px", height: "60px", borderRadius: "10px", marginLeft: "10px", objectFit: "fill" }} />

                                                            <div style={{ marginLeft: "10px" }}>
                                                                <p style={{ fontSize: "16px", fontWeight: 500 }}>{value?.sectionTitle || value?.collection?.[0]?.title}</p>
                                                                <p style={{ marginTop: '10px' }}>{value?.discription}</p>
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
                                                            {value.products?.map((product, index) => (
                                                                <div key={index}>
                                                                    <div style={{ display: "flex", justifyContent: "space-between", padding: "15px 10px" }}>
                                                                        <div style={{ display: 'flex' }}>
                                                                            <img
                                                                                src={product?.image}
                                                                                alt={product?.title}
                                                                                style={{
                                                                                    width: "60px",
                                                                                    height: "60px",
                                                                                    marginLeft: "10px",
                                                                                    objectFit: "fill",
                                                                                    borderRadius: "10px"
                                                                                }}
                                                                            />
                                                                            <div style={{ marginLeft: "10px" }}>
                                                                                <p>{product?.title}</p>
                                                                                <p style={{ marginTop: '5px', fontWeight: "500" }}>${product?.variants[0]?.price}</p>
                                                                            </div>
                                                                        </div>
                                                                        <select disabled class="addon-variant-select" style={{ width: "67px", height: "31px", borderRadius: "8px", padding: "0px 8px", backgroundColor: "black", color: "white" }}>
                                                                            <option value="" selected="">Add</option>
                                                                        </select>
                                                                    </div>
                                                                    {index !== value.products.length - 1 && <Divider />}
                                                                </div>
                                                            ))}

                                                            {value.collection?.map((product, index) => (
                                                                <div key={index}>
                                                                    <div style={{ display: "flex", padding: "15px 10px" }}>
                                                                        <img
                                                                            src={product?.image}
                                                                            alt={product?.title}
                                                                            style={{
                                                                                width: "60px",
                                                                                height: "60px",
                                                                                borderRadius: "10px",
                                                                                marginLeft: "10px",
                                                                                objectFit: "fill"
                                                                            }}
                                                                        />
                                                                        <div style={{ marginLeft: "10px" }}>
                                                                            <p>{product?.title}</p>
                                                                            <p style={{ marginTop: '5px', fontWeight: "500" }}>$50.00</p>
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
                                    <div style={{ backgroundColor: "#e9e9e9", borderRadius: "10px", display: "flex", justifyContent: "space-between", marginTop: "20px", alignItems: "center", padding: "10px" }}>
                                        <p style={{ fontSize: '1rem', fontWeight: "500" }}>$0.00</p>
                                        <p style={{ fontSize: '1rem', color: "gray" }}>No items added</p>
                                    </div>
                                    <button disabled style={{
                                        marginTop: "10px",
                                        backgroundColor: "#262626",
                                        color: "white",
                                        cursor: "pointer",
                                        width: "100%",
                                        borderRadius: "10px",
                                        padding: "8px"
                                    }}>Add to cart</button>
                                </>
                            )}

                            {type === "Tiered" && (
                                <>
                                    <div style={{ border: "1px solid gray", borderRadius: "10px", display: "flex", flexDirection: "column", overflowY: "auto", padding: "20px", scrollbarWidth: "thin" }}>
                                        <p style={{ fontSize: "15px", fontWeight: "500", marginBottom: "10px" }}>{title}</p>
                                        <div
                                            style={{ fontSize: "15px", fontWeight: "500" }}
                                            dangerouslySetInnerHTML={{ __html: data?.bundle_description || "" }}
                                        />
                                        <div style={{ display: "flex", gap: "0.5rem", margin: "10px 0px 0px 0px" }}>
                                            {discountOption?.map((option, index) => (
                                                <div key={index} style={{
                                                    backgroundColor: index === 0 ? "#459E7A" : "#c0c0c0",
                                                    color: "#000000",
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

                                        <div style={{ margin: "10px -20px" }}>
                                            <Divider />
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            {products?.length > 0 && products.map((value, index) => (
                                                <div key={index}>
                                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                        <div style={{ display: "flex" }}>
                                                            <img src={value?.image} style={{ width: "60px", height: "60px", objectFit: "fill", borderRadius: "10px" }} />
                                                            <div style={{ marginLeft: "10px" }}>
                                                                <p style={{ fontWeight: 500 }}>{value?.title}</p>
                                                                <p style={{ marginTop: '5px', fontWeight: "500" }}>${value?.variants[0]?.price}</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {value?.variants?.length > 1 ?
                                                                <select disabled class="addon-variant-select" style={{ width: "67px", height: "31px", borderRadius: "8px", padding: "0px 8px", backgroundColor: "black", color: "white" }}>
                                                                    <option value="" selected="">Add</option>
                                                                </select>
                                                                :
                                                                <button disabled class="addon-variant-select" style={{ width: "67px", height: "31px", borderRadius: "8px", padding: "0px 8px", backgroundColor: "black", color: "white" }}>Add</button>
                                                            }
                                                        </div>
                                                    </div>
                                                    {index !== products.length - 1 && (
                                                        <div style={{ margin: "15px 0px" }}>
                                                            <Divider />
                                                        </div>
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
                                        <div style={{ margin: "10px -20px" }}>
                                            <Divider />
                                        </div>
                                        <div style={{ backgroundColor: "#e9e9e9", borderRadius: "10px", display: "flex", justifyContent: "space-between", marginTop: "10px", alignItems: "center", padding: "12px 10px", }}>
                                            <p style={{ fontSize: "1rem", fontWeight: "600" }}>Total</p>
                                            <p style={{ fontSize: "1rem", fontWeight: "500" }}>$559.00 <span style={{ textDecoration: "line-through", marginLeft: "5px" }}>$1199.11</span></p>
                                        </div>
                                        <button style={{
                                            marginTop: "10px",
                                            backgroundColor: "#262626",
                                            color: "white",
                                            cursor: "pointer",
                                            width: "100%",
                                            borderRadius: "10px",
                                            padding: "8px"
                                        }}>Add to cart</button>
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
                            <img
                                src={media[0] || buysX[0]?.image || collections[0]?.image}
                                style={{ width: "100%", height: "465px", borderRadius: "10px" }}
                            />
                        </div>
                        <div style={{ width: "50%", paddingLeft: "20px" }}>
                            <p style={{ marginTop: '10px', fontSize: "1rem", fontWeight: "500", marginBottom: "11px" }}>{title}</p>
                            <div
                                style={{ fontSize: "15px", fontWeight: "500" }}
                                dangerouslySetInnerHTML={{ __html: data?.bundle_description || "" }}
                            />
                            <p style={{ marginTop: '10px', fontSize: "1rem", fontWeight: "400", marginBottom: "14px" }}>$559.00 <span style={{ textDecoration: "line-through", marginLeft: "5px" }}>$1199.11</span></p>

                            {type === "specific_product" && (
                                <>
                                    <div style={{ border: "1px solid gray", borderRadius: "10px", display: "flex", flexDirection: "column", marginBottom: "-6px" }}>
                                        {buysX.map((value, index) => (
                                            <div key={index}>
                                                <div style={{ padding: "15px 10px" }}>
                                                    <div style={{ display: "flex" }}>
                                                        <img src={value?.image} style={{ width: "60px", height: "60px", objectFit: "fill", borderRadius: "10px" }} />
                                                        <div style={{ marginLeft: "10px" }}>
                                                            <p>{value?.title}</p>
                                                            <p style={{ marginTop: '5px', fontWeight: "500" }}>${value?.variants[0]?.price}</p>
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
                                                <div style={{ margin: "0px 20px" }}>
                                                    <Divider />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <button disabled style={{
                                            backgroundColor: "#262626", color: "white", cursor: "pointer", width: "45px", height: "45px", borderRadius: "50%", padding: "8px",
                                            fontWeight: "500", paddingBottom: "14px", fontSize: "30px", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1
                                        }}>+</button>
                                    </div>
                                    <div style={{ border: "1px solid gray", borderRadius: "10px", display: "flex", flexDirection: "column", marginTop: "-6px", position: "relative", overflow: "hidden" }}>
                                        {getY.map((value, index) => (
                                            <div key={index} style={{ position: "relative" }}>
                                                <div style={{ padding: "15px 10px" }}>
                                                    <div style={{ display: "flex" }}>
                                                        <img src={value?.image} style={{ width: "60px", height: "60px", objectFit: "fill", borderRadius: "10px" }} />
                                                        <div style={{ marginLeft: "10px" }}>
                                                            <p>{value?.title}</p>
                                                            <p style={{ marginTop: '5px', fontWeight: "500" }}>${value?.variants[0]?.price}</p>
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
                                                    <div style={{ position: 'absolute', top: "6px", right: "-16px", width: "95px", height: "23px", transform: "rotate(36deg)", backgroundColor: "red", color: "white", padding: "10px", fontWeight: "500", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                        {data?.discount_value === "100" ? "FREE" : `${data?.discount_value}% OFF`}
                                                    </div>
                                                )}

                                                <div style={{ margin: "0px 20px" }}>
                                                    <Divider />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            <button style={{
                                marginTop: "20px",
                                backgroundColor: "#262626",
                                color: "white",
                                cursor: "pointer",
                                width: "100%",
                                borderRadius: "10px",
                                padding: "8px"
                            }} disabled>Add to cart</button>
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
                                            <div key={index} style={{ lineHeight: "normal", cursor: "pointer", border: "1px solid black", padding: "8px 10px", borderRadius: "10px" }}>
                                                {value?.title}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            }

                            <p style={{ margin: '18px 0px 12px 0px', fontSize: "1rem", fontWeight: "600" }}>{title}</p>

                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                {discountOptions.map((value, index) => (
                                    <div key={index}>
                                        <div style={{ border: "2px solid", borderColor: value?.selected_default === "1" ? "black" : "#dbdbdb", borderRadius: "10px", padding: "22px", position: "relative" }}>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}>
                                                <div style={{ display: "flex", alignItems: "center", }}>
                                                    <RadioButton
                                                        checked={value?.selected_default === "1"}
                                                        onChange={() => handleCheckboxFour(index)}
                                                    />
                                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                                        <p style={{ fontSize: "15px", fontWeight: "600" }}>{value?.description}</p>
                                                        {value?.Label &&
                                                            <p style={{ backgroundColor: "black", padding: "0px 5px", color: 'white', borderRadius: "10px", fontSize: "10px" }}>{value?.Label}</p>
                                                        }
                                                    </div>
                                                </div>
                                                <p style={{ fontWeight: "500", fontSize: "1rem" }}>$77.00</p>
                                            </div>
                                            {value?.Badge &&
                                                <div style={{ backgroundColor: "red", display: "flex", justifyContent: 'center', alignItems: "center", position: "absolute", right: "85px", top: "-2px", padding: '4px 8px', fontSize: "11px", color: "white", borderRadius: "4px", fontWeight: "500" }}>
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
                        </div>
                        <div style={{ width: "50%" }}>
                            <p style={{ fontSize: "1.3rem", fontWeight: "500" }}>{products[0]?.title || collections[0]?.title}</p>
                            <p style={{ fontSize: "20px", fontWeight: 400, margin: "12px 0px" }}>$ 1999.00</p>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "14px 0px 5px 0px" }}>
                                <p style={{ fontSize: "16px", fontWeight: 500, color: "black" }}>{data?.bundle_title}</p>
                                <p style={{ backgroundColor: "red", color: "white", padding: "0px 6px", height: "fit-content", borderRadius: "5px", fontSize: "12px" }}>{data?.discount_value}% OFF</p>
                            </div>
                            <p style={{ marginBottom: "12px" }}>{data?.bundle_description}</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                {secondCollection.map((value, index) => {
                                    const isChecked = data?.selectedAddonIds.includes(value?.id) ? true : false;

                                    return (
                                        <div key={index}>
                                            <div style={{ border: "1px solid gray", borderRadius: "10px", display: "flex", alignItems: "center", padding: "10px", cursor: "pointer" }}>
                                                <Checkbox checked={isChecked || !!checkedItems[index]} onChange={() => handleCheckboxChange(index)} />
                                                <img src={value?.image} style={{ width: "50px", height: "50px", objectFit: "fill" }} />
                                                <div style={{ marginLeft: "10px" }}>
                                                    <p>{value?.title}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <button disabled style={{
                                margin: "13px 0px",
                                backgroundColor: "#262626",
                                color: "white",
                                cursor: "pointer",
                                width: "100%",
                                borderRadius: "10px",
                                padding: "8px"
                            }}>Add to cart</button>
                        </div>
                    </div >
                )
            case "6":
                const allProducts = [...products.slice(0, 1), ...offerProducts];

                return (
                    <div style={{ height: '500px', display: "flex", flexDirection: "column", justifyContent: "center", padding: "20px" }}>
                        <div style={{
                            display: "flex",
                            overflowX: "auto",
                            paddingBottom: "10px",

                        }}>
                            {allProducts.map((item, index, arr) => (
                                <div key={index} style={{ flex: "0 0 auto" }}>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <div style={{ position: "relative", width: "150px", height: "150px" }}>
                                            <img
                                                src={item?.image || "https://via.placeholder.com/150"}
                                                width="150px"
                                                height="150px"
                                                style={{ borderRadius: "10px", border: "2px solid #000000", width: "100%", height: "100%" }}
                                                alt={item?.title || "Recommended product"}
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
                                    <p style={{ fontSize: "1rem", fontWeight: "600", marginTop: "3px" }}>$ {item.variants[0]?.price}</p>
                                </div>
                            ))}
                            <div style={{
                                display: "flex",
                                margin: "1rem",
                                flexDirection: "column",
                                gap: "0.5rem",
                                padding: "10px"
                            }}>
                                <p style={{ fontSize: "1rem", fontWeight: "600" }}>Total: $29090.00</p>
                                <button style={{
                                    backgroundColor: "#262626",
                                    color: "white",
                                    cursor: "pointer",
                                    width: "160px",
                                    borderRadius: "10px",
                                    padding: "8px"
                                }}>Add select to cart</button>
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
