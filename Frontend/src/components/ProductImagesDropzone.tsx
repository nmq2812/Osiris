import React, { useEffect } from "react";
import {
    Upload,
    Modal,
    Button,
    Space,
    Card,
    Typography,
    Row,
    Col,
    Image,
} from "antd";
import {
    PlusOutlined,
    CheckOutlined,
    DeleteOutlined,
    InboxOutlined,
} from "@ant-design/icons";
import type { RcFile, UploadProps } from "antd/es/upload";
import { FileWithPreview } from "@/datas/FileWithPreview";
import { ImageResponse } from "@/models/Image";
import { produce } from "immer";

const { Dragger } = Upload;
const { Text, Title } = Typography;

interface ProductImagesDropzoneProps {
    imageFiles: FileWithPreview[];
    setImageFiles: React.Dispatch<React.SetStateAction<FileWithPreview[]>>;
    thumbnailName: string;
    setThumbnailName: React.Dispatch<React.SetStateAction<string>>;
    imageResponses?: ImageResponse[];
    setImageResponses?: (imageResponses: ImageResponse[]) => void;
}

function ProductImagesDropzone({
    imageFiles,
    setImageFiles,
    thumbnailName,
    setThumbnailName,
    imageResponses,
    setImageResponses,
}: ProductImagesDropzoneProps) {
    // Handle file uploads
    const handleUpload = (info: any) => {
        // Don't upload automatically - just add to our local state
        const files = info.fileList.map((file: any) => {
            if (!file.preview && file.originFileObj) {
                file.preview = URL.createObjectURL(file.originFileObj);
            }
            return file.originFileObj || file;
        });

        // Set first image as thumbnail if no thumbnail exists yet
        if (
            files.length > 0 &&
            (!thumbnailName ||
                (imageResponses &&
                    imageResponses.every((img) => img.isEliminated)))
        ) {
            setThumbnailName(files[0].name);
        }

        setImageFiles(files);
    };

    // Handle file removal
    const handleRemove = (file: any) => {
        const currentImageFiles = imageFiles.filter(
            (item) => item.name !== file.name,
        );

        // If removed file was the thumbnail, select a new one
        if (file.name === thumbnailName) {
            if (currentImageFiles.length > 0) {
                setThumbnailName(currentImageFiles[0].name);
            } else if (imageResponses && setImageResponses) {
                // If no image files left, select first non-eliminated image response as thumbnail
                const currentImageResponses = produce(
                    imageResponses,
                    (draft: any) => {
                        for (const imageResponse of draft) {
                            if (!imageResponse.isEliminated) {
                                imageResponse.isThumbnail = true;
                                setThumbnailName(imageResponse.name);
                                break;
                            }
                        }
                    },
                );
                setImageResponses(currentImageResponses);
            } else {
                setThumbnailName("");
            }
        }

        setImageFiles(currentImageFiles);
        return false; // Prevent default upload removal behavior
    };

    // Delete all image files
    const handleDeleteAllImages = () => {
        Modal.confirm({
            title: "Xác nhận xóa",
            content: "Xóa tất cả hình?",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Không xóa",
            onOk: () => {
                if (
                    imageFiles.some(
                        (imageFile) => imageFile.name === thumbnailName,
                    ) &&
                    imageResponses &&
                    setImageResponses
                ) {
                    const currentImageResponses = produce(
                        imageResponses,
                        (draft: any) => {
                            for (const imageResponse of draft) {
                                if (!imageResponse.isEliminated) {
                                    imageResponse.isThumbnail = true;
                                    setThumbnailName(imageResponse.name);
                                    break;
                                }
                            }
                        },
                    );
                    setImageResponses(currentImageResponses);
                }
                setImageFiles([]);
            },
        });
    };

    // Handle thumbnail selection for image files
    const handleSelectThumbnailFile = (file: FileWithPreview) => {
        setThumbnailName(file.name);

        // Update image responses if needed
        if (imageResponses && setImageResponses) {
            const currentImageResponses = produce(
                imageResponses,
                (draft: any) => {
                    for (const imageResponse of draft) {
                        if (imageResponse.isThumbnail) {
                            imageResponse.isThumbnail = false;
                            break;
                        }
                    }
                },
            );
            setImageResponses(currentImageResponses);
        }
    };

    // Handle thumbnail selection for image responses
    const handleSelectThumbnail = (index: number) => {
        if (imageResponses && setImageResponses) {
            setThumbnailName(imageResponses[index].name);
            const currentImageResponses = produce(
                imageResponses,
                (draft: any) => {
                    for (const imageResponse of draft) {
                        if (imageResponse.isThumbnail) {
                            imageResponse.isThumbnail = false;
                            break;
                        }
                    }
                    draft[index].isThumbnail = true;
                },
            );
            setImageResponses(currentImageResponses);
        }
    };

    // Handle deleting an image response
    const handleDeleteImageResponse = (index: number) => {
        if (imageResponses && setImageResponses) {
            const currentImageResponses = produce(
                imageResponses,
                (draft: any) => {
                    draft[index].isEliminated = true;

                    if (draft[index].isThumbnail) {
                        draft[index].isThumbnail = false;

                        // Find a new thumbnail
                        for (const imageResponse of draft) {
                            if (!imageResponse.isEliminated) {
                                imageResponse.isThumbnail = true;
                                setThumbnailName(imageResponse.name);
                                break;
                            }
                        }
                    }
                },
            );

            // If all image responses are eliminated, set thumbnail from imageFiles
            if (currentImageResponses.every((img: any) => img.isEliminated)) {
                if (imageFiles.length > 0) {
                    setThumbnailName(imageFiles[0].name);
                } else {
                    setThumbnailName("");
                }
            }

            setImageResponses(currentImageResponses);
        }
    };

    // Clean up object URLs when component unmounts
    useEffect(() => {
        return () =>
            imageFiles.forEach((file) => {
                if (file.preview) URL.revokeObjectURL(file.preview);
            });
    }, [imageFiles]);

    // Upload component props
    const uploadProps: UploadProps = {
        name: "file",
        multiple: true,
        fileList: [],
        accept: "image/*",
        beforeUpload: () => false, // Prevent auto upload
        onChange: handleUpload,
        onRemove: handleRemove,
    };

    return (
        <div>
            <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Kéo thả hoặc bấm để chọn hình</p>
                <p className="ant-upload-hint">
                    Dung lượng mỗi tập tin không quá 5 MB
                </p>
            </Dragger>

            {/* Existing images from server */}
            {imageResponses &&
                imageResponses.some((img) => !img.isEliminated) && (
                    <Card style={{ marginTop: 16 }}>
                        <Row gutter={[16, 16]}>
                            {imageResponses.map((img, index) => {
                                if (!img.isEliminated) {
                                    return (
                                        <Col
                                            key={img.name}
                                            xs={12}
                                            sm={8}
                                            md={6}
                                            lg={4}
                                        >
                                            <Card
                                                size="small"
                                                cover={
                                                    <div
                                                        style={{
                                                            height: 115,
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                            border:
                                                                img.name ===
                                                                thumbnailName
                                                                    ? "2px solid #52c41a"
                                                                    : "none",
                                                        }}
                                                    >
                                                        <Image
                                                            height={100}
                                                            src={img.path}
                                                            alt={img.name}
                                                            title={img.name}
                                                            style={{
                                                                objectFit:
                                                                    "contain",
                                                            }}
                                                            preview={false}
                                                        />
                                                    </div>
                                                }
                                                actions={[
                                                    <Button
                                                        key="select"
                                                        type="text"
                                                        icon={<CheckOutlined />}
                                                        disabled={
                                                            img.name ===
                                                            thumbnailName
                                                        }
                                                        onClick={() =>
                                                            handleSelectThumbnail(
                                                                index,
                                                            )
                                                        }
                                                    />,
                                                    <Button
                                                        key="delete"
                                                        type="text"
                                                        danger
                                                        icon={
                                                            <DeleteOutlined />
                                                        }
                                                        onClick={() =>
                                                            handleDeleteImageResponse(
                                                                index,
                                                            )
                                                        }
                                                    />,
                                                ]}
                                            />
                                        </Col>
                                    );
                                }
                                return null;
                            })}
                        </Row>
                    </Card>
                )}

            {/* New uploaded images */}
            {imageFiles.length > 0 && (
                <div style={{ marginTop: 16 }}>
                    {imageResponses &&
                        imageResponses.some((img) => !img.isEliminated) && (
                            <div
                                style={{
                                    margin: "16px 0",
                                    borderTop: "1px dashed #d9d9d9",
                                    paddingTop: 16,
                                }}
                            >
                                <Space>
                                    <PlusOutlined style={{ fontSize: 12 }} />
                                    <Text>Hình mới thêm, chưa được lưu</Text>
                                </Space>
                            </div>
                        )}

                    <Card>
                        <Row gutter={[16, 16]}>
                            {imageFiles.map((file) => (
                                <Col
                                    key={file.name}
                                    xs={12}
                                    sm={8}
                                    md={6}
                                    lg={4}
                                >
                                    <Card
                                        size="small"
                                        cover={
                                            <div
                                                style={{
                                                    height: 115,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    border:
                                                        file.name ===
                                                        thumbnailName
                                                            ? "2px solid #52c41a"
                                                            : "none",
                                                }}
                                            >
                                                <Image
                                                    height={100}
                                                    src={file.preview}
                                                    alt={file.name}
                                                    title={file.name}
                                                    style={{
                                                        objectFit: "contain",
                                                    }}
                                                    preview={false}
                                                />
                                            </div>
                                        }
                                        actions={[
                                            <Button
                                                key="select"
                                                type="text"
                                                icon={<CheckOutlined />}
                                                disabled={
                                                    file.name === thumbnailName
                                                }
                                                onClick={() =>
                                                    handleSelectThumbnailFile(
                                                        file,
                                                    )
                                                }
                                            />,
                                            <Button
                                                key="delete"
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() =>
                                                    handleRemove(file)
                                                }
                                            />,
                                        ]}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Card>

                    <Button
                        danger
                        style={{ marginTop: 16 }}
                        onClick={handleDeleteAllImages}
                    >
                        Xóa tất cả hình
                    </Button>
                </div>
            )}
        </div>
    );
}

export default ProductImagesDropzone;
