import { CollectionWrapper } from "@/datas/CollectionWrapper";
import { UploadedImageResponse } from "@/models/Image";
import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import { useMutation } from "@tanstack/react-query";

function useUploadMultipleImagesApi() {
    return useMutation<
        CollectionWrapper<UploadedImageResponse>,
        ErrorMessage,
        File[]
    >((images) => FetchUtils.uploadMultipleImages(images), {
        onSuccess: () => NotifyUtils.simpleSuccess("Tải hình lên thành công"),
        onError: () =>
            NotifyUtils.simpleFailed("Tải hình lên không thành công"),
    });
}

export default useUploadMultipleImagesApi;
