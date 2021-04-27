import { get_api, ApiConfig } from "./api";
import { Endpoints } from "@kirbic/types";

export type Cart = Endpoints["GET /cart/"]["response"]["data"];

export type Price = Endpoints["GET /catalog/product/"]["response"]["data"]["items"][0]["prices"][0];
export type Currency = Price["currency"];
export type Unit = Price["unit_type"];
export type CartActionMode = Endpoints["PATCH /cart/{mode}/{price_id}"]["parameters"]["mode"];

export type ApiKit = ReturnType<typeof kirbic_api_kit>;

export const kirbic_api_kit = (config: ApiConfig) => {
  const api = get_api(config);

  const get_cart = async (): Promise<Cart> => {
    const res = await api.get<Cart>("/cart");
    return res.data;
  };

  const delete_cart = async (): Promise<void> => {
    await api.delete("/cart/");
  };

  const set_metadata = async (
    metadata: Record<string, unknown>
  ): Promise<Cart> => {
    const res = await api.post("/cart/metadata/", metadata);
    return res.data;
  };

  const cart_action_api = async (
    mode: CartActionMode,
    price_id: string,
    quantity: number
  ): Promise<Cart> => {
    const res = await api.patch<Cart>(`/cart/${mode}/${price_id}`, {
      quantity,
    });
    return res.data;
  };

  return {
    cart_action_api,
    delete_cart,
    get_cart,
    set_metadata,
  };
};
