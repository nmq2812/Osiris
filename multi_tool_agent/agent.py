from google.adk.tools import built_in_code_execution
from google.adk.agents import Agent, LlmAgent
from google.adk.sessions import InMemorySessionService
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from google.adk.runners import Runner
from google.genai import types, Client


# Initialize FastAPI app
app = FastAPI()

client = Client(api_key="AIzaSyDwT8Vll0UKMP3JhaZS8EwHjf1CGanmQLU")

# Request models for API endpoints
class ProductQuery(BaseModel):
    query: str

class CategoryQuery(BaseModel):
    query: str

class ChatQuery(BaseModel):
    message: str

def get_product_info(product_query: str) -> dict:    
    mock_product_db = [
        {
            "productId": 1,
            "productName": "30MM Spinatio Army Type - Mô hình Gundam chính hãng Bandai Nhật bản",
            "productSlug": "30mm-spinatio-army-type",
            "productThumbnail": "https://bizweb.dktcdn.net/thumb/1024x1024/100/456/060/products/19ac5616-c650-461a-aaa0-d6b9a07d2eb5-1672166630055.jpg?v=1732093591540",
            "productPriceRange": [300000],
            "productVariants": [
            {
                "variantId": 1,
                "variantPrice": 300000,
                "variantProperties": {
                "content": [
                    { "id": 1, "code": "size", "name": "Kích cỡ", "value": "29.8 x 18.8 x 4.7 cm" },
                    { "id": 2, "code": "color", "name": "Màu sắc", "value": "Xanh lá" },
                    { "id": 3, "code": "material", "name": "Chất liệu", "value": "Nhựa ABS" }
                ],
                "totalElements": 3
                }
            }
            ],
            "productSaleable": True,
            "productPromotion": None
        },
        {
            "productId": 2,
            "productName": "HG Gundam Aerial - Mô hình chính hãng Bandai, chi tiết cao",
            "productSlug": "hg-gundam-aerial",
            "productThumbnail": "https://example.com/images/hg-gundam-aerial.jpg",
            "productPriceRange": [450000],
            "productVariants": [
            {
                "variantId": 2,
                "variantPrice": 450000,
                "variantProperties": {
                "content": [
                    { "id": 4, "code": "size", "name": "Kích cỡ", "value": "30 x 20 x 6 cm" },
                    { "id": 5, "code": "color", "name": "Màu sắc", "value": "Trắng xanh" },
                    { "id": 6, "code": "material", "name": "Chất liệu", "value": "Nhựa ABS & PC" }
                ],
                "totalElements": 3
                }
            }
            ],
            "productSaleable": True,
            "productPromotion": {
            "discount": "10%",
            "note": "Giảm giá nhân dịp ra mắt"
            }
        },
        {
            "productId": 3,
            "productName": "MG Gundam Barbatos - Mô hình Gundam tỉ lệ 1/100 cao cấp",
            "productSlug": "mg-gundam-barbatos",
            "productThumbnail": "https://example.com/images/mg-barbatos.jpg",
            "productPriceRange": [950000],
            "productVariants": [
            {
                "variantId": 3,
                "variantPrice": 950000,
                "variantProperties": {
                "content": [
                    { "id": 7, "code": "size", "name": "Kích cỡ", "value": "38 x 25 x 8 cm" },
                    { "id": 8, "code": "color", "name": "Màu sắc", "value": "Trắng xám" },
                    { "id": 9, "code": "material", "name": "Chất liệu", "value": "ABS cao cấp" }
                ],
                "totalElements": 3
                }
            }
            ],
            "productSaleable": True,
            "productPromotion": None
        },
        {
            "productId": 4,
            "productName": "SD Gundam Ex-Standard RX-78-2 - Dòng mô hình SD dễ lắp ráp",
            "productSlug": "sd-ex-standard-rx-78-2",
            "productThumbnail": "https://example.com/images/sd-rx-78-2.jpg",
            "productPriceRange": [180000],
            "productVariants": [
            {
                "variantId": 4,
                "variantPrice": 180000,
                "variantProperties": {
                "content": [
                    { "id": 10, "code": "size", "name": "Kích cỡ", "value": "15 x 10 x 4 cm" },
                    { "id": 11, "code": "color", "name": "Màu sắc", "value": "Trắng đỏ xanh" },
                    { "id": 12, "code": "material", "name": "Chất liệu", "value": "Nhựa mềm" }
                ],
                "totalElements": 3
                }
            }
            ],
            "productSaleable": True,
            "productPromotion": {
            "discount": "5%",
            "note": "Khuyến mãi hè"
            }
        },
        {
            "productId": 101,
            "productName": "Figure Luffy - One Piece Gear 5 (Banpresto - Chính hãng)",
            "productSlug": "figure-luffy-gear-5",
            "productThumbnail": "https://example.com/images/luffy-gear5.jpg",
            "productPriceRange": [650000],
            "productVariants": [
            {
                "variantId": 1011,
                "variantPrice": 650000,
                "variantProperties": {
                "content": [
                    { "id": 201, "code": "size", "name": "Kích cỡ", "value": "20 x 12 x 10 cm" },
                    { "id": 202, "code": "color", "name": "Màu sắc", "value": "Trắng, đỏ, vàng" },
                    { "id": 203, "code": "material", "name": "Chất liệu", "value": "PVC cao cấp" }
                ],
                "totalElements": 3
                }
            }
            ],
            "productSaleable": True,
            "productPromotion": {
            "discount": "15%",
            "note": "Ưu đãi giới hạn"
            }
        },
        {
            "productId": 102,
            "productName": "Figure Nezuko Kamado - Kimetsu no Yaiba chính hãng",
            "productSlug": "figure-nezuko-kamado",
            "productThumbnail": "https://example.com/images/nezuko.jpg",
            "productPriceRange": [480000],
            "productVariants": [
            {
                "variantId": 1012,
                "variantPrice": 480000,
                "variantProperties": {
                "content": [
                    { "id": 204, "code": "size", "name": "Kích cỡ", "value": "18 x 10 x 9 cm" },
                    { "id": 205, "code": "color", "name": "Màu sắc", "value": "Hồng đen" },
                    { "id": 206, "code": "material", "name": "Chất liệu", "value": "PVC + ABS" }
                ],
                "totalElements": 3
                }
            }
            ],
            "productSaleable": True,
            "productPromotion": None
        },
        {
            "productId": 103,
            "productName": "Figure Gojo Satoru - Jujutsu Kaisen Limited Edition",
            "productSlug": "figure-gojo-satoru",
            "productThumbnail": "https://example.com/images/gojo.jpg",
            "productPriceRange": [790000],
            "productVariants": [
            {
                "variantId": 1013,
                "variantPrice": 790000,
                "variantProperties": {
                "content": [
                    { "id": 207, "code": "size", "name": "Kích cỡ", "value": "22 x 14 x 12 cm" },
                    { "id": 208, "code": "color", "name": "Màu sắc", "value": "Tím đen" },
                    { "id": 209, "code": "material", "name": "Chất liệu", "value": "Resin" }
                ],
                "totalElements": 3
                }
            }
            ],
            "productSaleable": True,
            "productPromotion": {
            "discount": "20%",
            "note": "Phiên bản giới hạn"
            }
        }
    ]

    # Convert the query to lowercase for case-insensitive search
    query = product_query.lower()
    matching_products = []

    # Search products by name (simple substring matching)
    for product in mock_product_db:
        if query in product["productName"].lower() or query in product["productSlug"].lower():
            matching_products.append(product)

    # Return results
    if matching_products:
        return {
            "status": "success",
            "products": matching_products,
            "count": len(matching_products)
        }
    else:
        return {
            "status": "error",
            "error_message": f"Sorry, I couldn't find any products matching '{product_query}'."
        }

def get_category_info(category_query: str) -> dict:
    """Returns category information for a given category ID.

    Args:
        category_id (str): The ID of the category.

    Returns:
        dict: status and result or error msg.
    """
    # Mock category data for simplicity
    mock_category_db = [
        {
            "categoryId": 1,
            "categoryName": "Gundam",
            "categorySlug": "gundam",
            "categoryDescription": "Mô hình Gundam chính hãng từ Bandai.",
            "categoryThumbnail": "https://example.com/images/gundam.jpg"
        },
        {
            "categoryId": 2,
            "categoryName": "Figure",
            "categorySlug": "figure",
            "categoryDescription": "Các loại figure nhân vật anime, game.",
            "categoryThumbnail": "https://example.com/images/figure.jpg"
        }
    ]

    # Convert the query to lowercase for case-insensitive search
    query = category_query.lower()
    matching_categories = []

    # Search categories by name (simple substring matching)
    for category in mock_category_db:
        if query in category["categoryName"].lower():
            matching_categories.append(category)

    # Return results
    if matching_categories:
        return {
            "status": "success",
            "categories": matching_categories,
            "count": len(matching_categories)
        }
    else:
        return {
            "status": "error",
            "error_message": f"Sorry, I couldn't find any categories matching '{category_query}'."
        }

session_service = InMemorySessionService()
session = session_service.create_session(app_name="Osiris", user_id="1", session_id="1")

root_agent = Agent(
    name="toy_economicLlm_agent",
    model="gemini-2.0-flash",
    description=(
        "Agent to answer questions about gundams and figure in store."
    ),
    instruction=(
        "You are a helpful agent who can answer user questions about gundams and figure in store and help them buy it."
    ),
    tools=[get_product_info, get_category_info, built_in_code_execution],
    
)

runner = Runner(agent=root_agent, app_name="Osiris", session_service=session_service)

@app.post("/chat")
async def chat_with_agent(chat_query: ChatQuery):
    """Interact with the agent for general queries."""
    content = types.Content(role='user', parts=[types.Part(text=chat_query.message)])
    events = runner.run(user_id="1", session_id=session.id, new_message=content)

    print("query: ", chat_query.message)
    print("Events: ", events)

    for event in events:
        final_response = event.content
        return {"response": final_response}
        
    return {"response": "no response"}