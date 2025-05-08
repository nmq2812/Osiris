import ResourceURL from "@/constants/ResourceURL";
import { ClientCartResponse, ClientCartRequest } from "@/datas/ClientUI";
import { useAuthStore } from "@/stores/authStore";
import FetchUtils, { ErrorMessage } from "@/utils/FetchUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useSaveCartApi() {
    const queryClient = useQueryClient();

    const {
        currentCartId,
        currentTotalCartItems,
        updateCurrentCartId,
        updateCurrentTotalCartItems,
    } = useAuthStore();

    return useMutation<ClientCartResponse, ErrorMessage, ClientCartRequest>({
        mutationFn: (requestBody) =>
            FetchUtils.postWithToken(ResourceURL.CLIENT_CART, requestBody),

        onSuccess: (cartResponse) => {
            void queryClient.invalidateQueries({
                queryKey: ["client-api", "carts", "getCart"],
            });
            currentCartId !== cartResponse.cartId &&
                updateCurrentCartId(cartResponse.cartId);
            currentTotalCartItems !== cartResponse.cartItems.length &&
                updateCurrentTotalCartItems(cartResponse.cartItems.length);
        },
        onError: () =>
            NotifyUtils.simpleFailed("Không lưu được thay đổi trên giỏ hàng"),
    });
}

export default useSaveCartApi;
