// React Imports
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
  const { name } = useParams();

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
            variant={name === value ? "primary" : "secondary"}
            pressed={name === value}
            onClick={() => navigate(`/customization/${value}`)}
          >
            {label}
          </Button>
        ))}
      </ButtonGroup>
      <Box paddingBlockStart={200}>
        {name === "fixedbundle" && <Fixedbundle />}
        {name === "mixmatch" && <Mixmatch />}
        {name === "buyxgety" && <BuyXgetY />}
        {name === "volumediscount" && <Volumediscount />}
        {name === "addons" && <Addons />}
        {name === "frequently" && <Frequently />}
      </Box>
    </Page>
  );
}

export default CustomizeDesign;
