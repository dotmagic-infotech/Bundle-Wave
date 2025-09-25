// React Imports
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Shopify Imports
import { Box, Button, ButtonGroup, Page } from "@shopify/polaris";

// Custom Components
import Fixedbundle from "./AllBundleCustomize/Fixedbundle";
import Mixmatch from "./AllBundleCustomize/Mixmatch";
import BuyXgetY from "./AllBundleCustomize/BuyXgetY";
import Volumediscount from "./AllBundleCustomize/Volumediscount";
import Addons from "./AllBundleCustomize/Addons";
import Frequently from "./AllBundleCustomize/Frequently";

function CustomizeDesign() {
  // Hooks
  const navigate = useNavigate();

  // State
  const [data, setData] = useState({
    bundle_select: "fixedbundle",
  });

  const handleChangeValue = (key, value) => {
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const bundleOptions = [
    { label: "Fixed Bundle", value: "fixedbundle" },
    { label: "Mix and Match", value: "mixmatch" },
    { label: "Buy X Get Y", value: "buyxgety" },
    { label: "Volume Discounts", value: "volumediscount" },
    { label: "Add-Ons", value: "addons" },
    { label: "Frequently Bought Together", value: "frequently" },
  ];

  return (
    <Page
      fullWidth
      title="Customize Design"
      backAction={{
        onAction: () => {
          navigate("/bundles");
        },
      }}
    >
      <ButtonGroup variant="segmented" fullWidth>
        {bundleOptions.map(({ label, value }) => (
          <Button
            key={value}
            variant={data.bundle_select === value ? "primary" : "secondary"}
            pressed={data.bundle_select === value}
            onClick={() => handleChangeValue("bundle_select", value)}
          >
            {label}
          </Button>
        ))}
      </ButtonGroup>
      <Box paddingBlockStart={200}>
        {data.bundle_select === "fixedbundle" && <Fixedbundle />}
        {data.bundle_select === "mixmatch" && <Mixmatch />}
        {data.bundle_select === "buyxgety" && <BuyXgetY />}
        {data.bundle_select === "volumediscount" && <Volumediscount />}
        {data.bundle_select === "addons" && <Addons />}
        {data.bundle_select === "frequently" && <Frequently />}
      </Box>
    </Page>
  );
}

export default CustomizeDesign;
