import { useMutation } from "react-query";

import { Anchor, Text } from "@mantine/core";

import React from "react";
import ResourceURL from "@/constants/ResourceURL";
import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import { Link } from "tabler-icons-react";
import {
    ClientPreorderRequest,
    ClientPreorderResponse,
} from "@/datas/ClientUI";

function useCreatePreorderApi() {
    return useMutation<
        ClientPreorderResponse,
        ErrorMessage,
        ClientPreorderRequest
    >(
        (requestBody) =>
            FetchUtils.postWithToken(ResourceURL.CLIENT_PREORDER, requestBody),
        {
            onSuccess: (response) =>
                NotifyUtils.simpleSuccess(
                    <Text inherit>
                        <span>
                            Đã thêm sản phẩm{" "}
                            {response.preorderProduct.productName} vào{" "}
                        </span>
                        <Anchor component={Link} href="/user/preorder" inherit>
                            danh sách đặt trước
                        </Anchor>
                    </Text>,
                ),
            onError: () =>
                NotifyUtils.simpleFailed(
                    "Không thêm được sản phẩm vào danh sách đặt trước",
                ),
        },
    );
}

export default useCreatePreorderApi;
