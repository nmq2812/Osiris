import ResourceURL from "@/constants/ResourceURL";
import { ClientCartResponse, ClientCartRequest } from "@/datas/ClientUI";
import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import { useMutation, useQueryClient } from "react-query";

function useSaveCartApi() {
    const queryClient = useQueryClient();

    const {
        currentCartId,
        currentTotalCartItems,
        updateCurrentCartId,
        updateCurrentTotalCartItems,
    } = useAuthStore();

    return useMutation<ClientCartResponse, ErrorMessage, ClientCartRequest>(
        (requestBody) =>
            FetchUtils.postWithToken(ResourceURL.CLIENT_CART, requestBody),
        {
            onSuccess: (cartResponse) => {
                void queryClient.invalidateQueries([
                    "client-api",
                    "carts",
                    "getCart",
                ]);
                currentCartId !== cartResponse.cartId &&
                    updateCurrentCartId(cartResponse.cartId);
                currentTotalCartItems !== cartResponse.cartItems.length &&
                    updateCurrentTotalCartItems(cartResponse.cartItems.length);
            },
            onError: () =>
                NotifyUtils.simpleFailed(
                    "Không lưu được thay đổi trên giỏ hàng",
                ),
        },
    );
}

export default useSaveCartApi;
function useAuthStore(): {
    currentCartId: any;
    currentTotalCartItems: any;
    updateCurrentCartId: any;
    updateCurrentTotalCartItems: any;
} {
    throw new Error("Function not implemented.");
}
