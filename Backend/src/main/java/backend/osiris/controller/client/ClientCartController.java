package backend.osiris.controller.client;

import backend.osiris.constant.AppConstants;
import backend.osiris.constant.FieldName;
import backend.osiris.constant.ResourceName;
import backend.osiris.dto.client.ClientCartRequest;
import backend.osiris.dto.client.ClientCartResponse;
import backend.osiris.dto.client.ClientCartVariantKeyRequest;
import backend.osiris.entity.cart.Cart;
import backend.osiris.entity.cart.CartVariant;
import backend.osiris.entity.cart.CartVariantKey;
import backend.osiris.exception.ResourceNotFoundException;
import backend.osiris.mapper.client.ClientCartMapper;
import backend.osiris.repository.cart.CartRepository;
import backend.osiris.repository.cart.CartVariantRepository;
import backend.osiris.repository.inventory.DocketVariantRepository;
import backend.osiris.utils.InventoryUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/client-api/carts")
@AllArgsConstructor
public class ClientCartController {

    private CartRepository cartRepository;
    private CartVariantRepository cartVariantRepository;
    private ClientCartMapper clientCartMapper;
    private DocketVariantRepository docketVariantRepository;

    @GetMapping
    public ResponseEntity<ObjectNode> getCart(Authentication authentication) {
        String username = authentication.getName();
        ObjectMapper mapper = new ObjectMapper();

        // Reference: https://stackoverflow.com/a/11828920, https://stackoverflow.com/a/51456293
        ObjectNode response = cartRepository.findByUsername(username)
                .map(clientCartMapper::entityToResponse)
                .map(clientCartResponse -> mapper.convertValue(clientCartResponse, ObjectNode.class))
                .orElse(mapper.createObjectNode());

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping
    public ResponseEntity<ClientCartResponse> saveCart(@RequestBody ClientCartRequest request) {
        final Cart cartBeforeSave;

        // TODO: Đôi khi cartId null nhưng thực tế user vẫn đang có cart trong DB
        if (request.getCartId() == null) {
            cartBeforeSave = clientCartMapper.requestToEntity(request);
        } else {
            cartBeforeSave = cartRepository.findById(request.getCartId())
                    .map(existingEntity -> clientCartMapper.partialUpdate(existingEntity, request))
                    .orElseThrow(() -> new ResourceNotFoundException(ResourceName.CART, FieldName.ID, request.getCartId()));
        }

        // Validate Variant Inventory
        for (CartVariant cartVariant : cartBeforeSave.getCartVariants()) {
            int inventory = InventoryUtils
                    .calculateInventoryIndices(docketVariantRepository.findByVariantId(cartVariant.getCartVariantKey().getVariantId()))
                    .get("canBeSold");
            if (cartVariant.getQuantity() > inventory) {
                throw new RuntimeException("Variant quantity cannot greater than variant inventory");
            }
        }

        Cart cart = cartRepository.save(cartBeforeSave);
        ClientCartResponse clientCartResponse = clientCartMapper.entityToResponse(cart);
        return ResponseEntity.status(HttpStatus.OK).body(clientCartResponse);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteCartItems(@RequestBody List<ClientCartVariantKeyRequest> idRequests) {
        List<CartVariantKey> ids = idRequests.stream()
                .map(idRequest -> new CartVariantKey(idRequest.getCartId(), idRequest.getVariantId()))
                .collect(Collectors.toList());
        cartVariantRepository.deleteAllById(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}
