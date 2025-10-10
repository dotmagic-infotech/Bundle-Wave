// React Imports
import { useState } from "react";

// Shopify Imports
import { BlockStack, Box, LegacyStack, RadioButton, Text, TextField } from "@shopify/polaris";

// Custom Component
import FileUploadDropZone from "../FileUploadDropZone/FileUploadDropZone";
import { useFetchWithToken } from "../FetchDataAPIs/FetchWithToken";

const ContactPopup = ({ showPopup, onClose }) => {

  // Hooks
  const fetchWithToken = useFetchWithToken();

  // State
  const [files, setFiles] = useState([]);
  const [media, setMedia] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    message: "",
    selectMedia: "upload",
    link: "",
  });

  const handleClose = () => {
    onClose();
    setErrors({});
    setLoading(false);
  };

  const handleChangeValue = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!data.name.trim()) newErrors.name = "Name is required.";
    if (!data.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Invalid email address.";
    }

    if (!data.message.trim()) newErrors.message = "Message is required.";

    if (data.selectMedia === "link") {
      if (!data.link.trim()) {
        newErrors.link = "Please provide a link.";
      } else if (
        !/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(data.link.trim())
      ) {
        newErrors.link = "Please enter a valid URL (must start with http or https).";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      shopify.loading(true);
      const formData = new FormData();

      formData.append("name", data?.name);
      formData.append("email", data?.email);
      formData.append("message", data?.message);
      formData.append("link", data?.link);

      if (data?.selectMedia === "link") {
        formData.append("link", data?.link || "");
      } else if (files?.length > 0) {
        files.forEach((file) => formData.append("files[]", file));
      }

      const result = await fetchWithToken({
        url: `https://bundle-wave-backend.xavierapps.com/api/send_inquiry_mail`,
        method: 'POST',
        body: formData,
        isFormData: true,
      });

      if (result.status) {
        onClose();
        shopify.loading(false);
        shopify.toast.show("Inquiry sent successfully!", { duration: 4000 });
      } else {
        shopify.toast.show(result?.message || "Failed to send inquiry.", {
          isError: true,
          duration: 8000,
        });
      }
    } catch {
      shopify.loading(false);
      shopify.toast.show("An unexpected error occurred. Please try again.", {
        isError: true,
        duration: 8000,
      });
    }
  };

  return (
    <div className={`contact-popup ${showPopup ? "open" : "close"}`}>
      <button onClick={handleClose} className="contact-popup__close-btn">
        ×
      </button>
      <BlockStack gap={"300"}>
        <BlockStack gap={"100"}>
          <Text as="h2" variant="headingMd">Contact Support</Text>
          <Text as="p">
            Need help with your bundle setup? Send us a quick note.
          </Text>
        </BlockStack>
        <TextField
          label="Your Name"
          value={data?.name}
          onChange={(value) => {
            handleChangeValue("name", value);
          }}
          error={errors.name}
          autoComplete="name"
        />

        <TextField
          label="Email Address"
          type="email"
          value={data?.email}
          onChange={(value) => {
            handleChangeValue("email", value);
          }}
          error={errors.email}
          autoComplete="email"
        />

        <TextField
          label="Message"
          value={data?.message}
          multiline={6}
          maxHeight={110}
          onChange={(value) => {
            handleChangeValue("message", value);
          }}
          error={errors.message}
          placeholder="Describe your issue or question..."
          autoComplete="off"
        />

        <LegacyStack >
          <RadioButton
            label="Upload Screenshots or Files"
            checked={data?.selectMedia === 'upload'}
            id="selectMediaUpload"
            onChange={() => {
              handleChangeValue("selectMedia", "upload");
              setData((prev) => ({ ...prev, link: "" }));
            }}
          />
          <RadioButton
            label="Add Link"
            checked={data?.selectMedia === 'link'}
            id="selectMediaLink"
            onChange={() => {
              handleChangeValue("selectMedia", "link");
              setFiles([]);
              setMedia([]);
            }}
          />
        </LegacyStack>

        {data?.selectMedia === 'upload' ? (
          <FileUploadDropZone media={media} setMedia={setMedia} files={files} setFiles={setFiles} />
        ) : (
          <TextField
            label="Link"
            value={data?.link}
            onChange={(value) => {
              handleChangeValue("link", value);
            }}
            error={errors.link}
            autoComplete="off"
          />
        )}

        <button
          type="button"
          className="contact-popup__button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </BlockStack>
    </div>
  );
};

export default ContactPopup;
