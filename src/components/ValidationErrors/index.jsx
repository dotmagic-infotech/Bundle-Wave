import { Banner, List } from "@shopify/polaris";

const ValidationErrors = ({ errors }) => {
    if (!errors || Object.keys(errors).length === 0) return null;

    return (
        <div style={{ marginBottom: "10px" }}>
            <Banner
                title={`There are ${Object.keys(errors).length} errors with this bundle creation:`}
                tone="critical"
            >
                <List>
                    {Object.entries(errors).map(([key, message]) => (
                        <List.Item key={key}>{message}</List.Item>
                    ))}
                </List>
            </Banner>
        </div>
    );
};

export default ValidationErrors;
