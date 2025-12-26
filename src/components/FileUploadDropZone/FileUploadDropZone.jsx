// React Imports
import { useState } from "react";

// Shopify Imports
import { DropZone, Thumbnail, Icon } from "@shopify/polaris";
import { DeleteIcon } from "@shopify/polaris-icons";

const validImageTypes = ["image/gif", "image/jpeg", "image/png", "image/svg+xml", "image/webp"];

const FileUploadDropZone = ({ media, setMedia, files, setFiles, setSections = [], editingSectionId = null, savebtn = true }) => {

    // State
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [hoveredIndexFile, setHoveredIndexFile] = useState(null);

    const handleDropZoneDrop = (_dropFiles, acceptedFiles, _rejectedFiles) => {
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
        if (savebtn) {
            shopify.saveBar.show('save');
        }
    };

    const handleRemoveMedia = (index, type) => {
        if (savebtn) {
            shopify.saveBar.show('save');
        }
        if (type === "media") {
            setMedia((prevMedia) => {
                const updated = prevMedia.filter((_, i) => i !== index);

                if (setSections && editingSectionId) {
                    setSections((prev) =>
                        prev.map((section) =>
                            section.id === editingSectionId
                                ? { ...section, media: updated }
                                : section
                        )
                    );
                }
                return updated;
            });
        } else if (type === "file") {
            setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        }
    };

    const uploadedFiles = (files?.length > 0 || media?.length > 0) && (
        <div style={{ padding: "1rem", display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", }}>
            {media?.map((url, index) => (
                <div
                    key={`media-${index}`}
                    style={{ position: "relative", width: "80px", height: "80px", display: "inline-block" }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    <Thumbnail size="large" alt={`Media ${index}`} source={url} />
                    <div className="hover-image" style={{ opacity: hoveredIndex === index ? 1 : 0, transition: "opacity 0.3s ease-in-out" }}>
                        <button className="delete-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveMedia(index, "media");
                            }}
                        >
                            <Icon source={DeleteIcon} />
                        </button>
                    </div>
                </div>
            ))}

            {files?.map((file, index) => {
                const isValidImage = validImageTypes.includes(file.type);
                return (
                    <div
                        key={`file-${index}`}
                        style={{ position: "relative", width: "80px", height: "80px", display: "inline-block" }}
                        onMouseEnter={() => setHoveredIndexFile(index)}
                        onMouseLeave={() => setHoveredIndexFile(null)}
                    >
                        <Thumbnail size="large" alt={file.name || `Uploaded file ${index}`} source={isValidImage ? window.URL.createObjectURL(file) : undefined} />
                        <div className="hover-image"
                            style={{
                                opacity: hoveredIndexFile === index ? 1 : 0,
                                transition: "opacity 0.3s ease-in-out",
                            }}
                        >
                            <button className="delete-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveMedia(index, "file");
                                }}
                            >
                                <Icon source={DeleteIcon} />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <DropZone onDrop={handleDropZoneDrop} label="Upload Files">
            {uploadedFiles}
            {(!media?.length && !files?.length) && <DropZone.FileUpload actionTitle="Upload Files" actionHint="Max file size: 2MB " />}
        </DropZone>
    );
};

export default FileUploadDropZone;
