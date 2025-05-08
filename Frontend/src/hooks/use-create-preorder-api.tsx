import { useMutation } from "@tanstack/react-query";
import React from "react";
import Link from "next/link";
import { Typography } from "antd";
import ResourceURL from "@/constants/ResourceURL";
import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import {
    ClientPreorderRequest,
    ClientPreorderResponse,
} from "@/datas/ClientUI";

const { Text } = Typography;

function useCreatePreorderApi() {
    return useMutation<
        ClientPreorderResponse,
        ErrorMessage,
        ClientPreorderRequest
    >({
        mutationFn: (requestBody) =>
            FetchUtils.postWithToken(ResourceURL.CLIENT_PREORDER, requestBody),

        onSuccess: (response) =>
            NotifyUtils.simpleSuccess(
                <>
                    <span>
                        Đã thêm sản phẩm {response.preorderProduct.productName}{" "}
                        vào{" "}
                    </span>
                    <Link
                        href="/user/preorder"
                        className="text-blue-600 hover:underline"
                    >
                        danh sách đặt trước
                    </Link>
                </>,
            ),
        onError: () =>
            NotifyUtils.simpleFailed(
                "Không thêm được sản phẩm vào danh sách đặt trước",
            ),
    });
}

export default useCreatePreorderApi;
