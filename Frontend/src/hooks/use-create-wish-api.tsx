import { useMutation } from "@tanstack/react-query";
import React from "react";
import Link from "next/link";
import { Typography } from "antd";
import ResourceURL from "@/constants/ResourceURL";
import { ClientWishResponse, ClientWishRequest } from "@/datas/ClientUI";
import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import NotifyUtils from "@/utils/NotifyUtils";

const { Text } = Typography;

function useCreateWishApi() {
    return useMutation<ClientWishResponse, ErrorMessage, ClientWishRequest>({
        mutationFn: (requestBody) =>
            FetchUtils.postWithToken(ResourceURL.CLIENT_WISH, requestBody),

        onSuccess: (response) =>
            NotifyUtils.simpleSuccess(
                <>
                    <span>
                        Đã thêm sản phẩm {response.wishProduct.productName} vào{" "}
                    </span>
                    <Link
                        href="/user/wishlist"
                        className="text-blue-600 hover:underline"
                    >
                        danh sách yêu thích
                    </Link>
                </>,
            ),
        onError: () =>
            NotifyUtils.simpleFailed(
                "Không thêm được sản phẩm vào danh sách yêu thích",
            ),
    });
}

export default useCreateWishApi;
