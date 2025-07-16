// React Imports
import { useState } from "react";

// Shopify Imports
import { DropZone, Thumbnail, Icon } from "@shopify/polaris";

const validImageTypes = ["image/gif", "image/jpeg", "image/png", "image/svg+xml", "image/webp"];

const SingleFileUploadDropZone = ({
    media,
    file,
    setFile,
}) => {

    const handleDropZoneDrop = (_dropFiles, acceptedFiles, _rejectedFiles) => {
        const singleFile = acceptedFiles[0];
        if (singleFile) {
            setFile(singleFile);
            shopify.saveBar.show("save");
        }
    };

    const uploaded = (media || file) && (
        <div
            style={{
                padding: "1rem",
                display: "flex",
                justifyContent: "center",
            }}
        >
            {file ? (
                <div
                    style={{
                        position: "relative",
                        width: "80px",
                        height: "80px",
                    }}
                >
                    <Thumbnail
                        size="large"
                        alt={file.name || "Uploaded file"}
                        source={
                            validImageTypes.includes(file.type)
                                ? window.URL.createObjectURL(file)
                                : undefined
                        }
                    />
                </div>
            ) : media ? (
                <div
                    style={{
                        position: "relative",
                        width: "80px",
                        height: "80px",
                    }}
                >
                    <Thumbnail size="large" alt="Media" source={media} />
                </div>
            ) : null}
        </div>
    );

    return (
        <DropZone
            onDrop={handleDropZoneDrop}
            label="Upload File"
            accept="image/*"
            type="image"
            allowMultiple={false}
        >

            {(file || media) ? (
                uploaded
            ) : (
                <DropZone.FileUpload actionTitle="Upload File" />
            )}
        </DropZone>
    );
};

export default SingleFileUploadDropZone;
