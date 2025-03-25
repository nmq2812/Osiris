import { useMutation } from "react-query";

import React from "react";
import ResourceURL from "@/constants/ResourceURL";
import { ClientWishResponse, ClientWishRequest } from "@/datas/ClientUI";
import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import { Anchor, Text } from "@mantine/core";
import { Link } from "tabler-icons-react";

function useCreateWishApi() {
    return useMutation<ClientWishResponse, ErrorMessage, ClientWishRequest>(
        (requestBody) =>
            FetchUtils.postWithToken(ResourceURL.CLIENT_WISH, requestBody),
        {
            onSuccess: (response) =>
                NotifyUtils.simpleSuccess(
                    <Text inherit>
                        <span>
                            Đã thêm sản phẩm {response.wishProduct.productName}{" "}
                            vào{" "}
                        </span>
                        <Anchor component={Link} href="/user/wishlist" inherit>
                            danh sách yêu thích
                        </Anchor>
                    </Text>,
                ),
            onError: () =>
                NotifyUtils.simpleFailed(
                    "Không thêm được sản phẩm vào danh sách yêu thích",
                ),
        },
    );
}

export default useCreateWishApi;
