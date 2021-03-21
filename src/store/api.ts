import axios from "axios";
import { Endpoints } from "@kirbic/types";

export type Cart = Endpoints["GET /cart/"]["response"]["data"];

export type Price = Endpoints["GET /catalog/product/"]["response"]["data"]["items"][0]["prices"][0];
export type Currency = Price["currency"];
export type Unit = Price["unit_type"];
export type CartActionMode = Endpoints["PATCH /cart/{mode}/{price_id}"]["parameters"]["mode"];

const api = axios.create({
  baseURL: "https://api.kirbic.com",
  withCredentials: true,
});

const get_headers = (shop_id: string) => ({
  "x-shopcopter-shop": shop_id,
});

export const get_cart = async (shop_id: string): Promise<Cart> => {
  const res = await api.get<Cart>("/cart", {
    headers: get_headers(shop_id),
  });
  return res.data;
};

export const delete_cart = async (shop_id: string): Promise<void> => {
  await api.delete("/cart/", {
    headers: get_headers(shop_id),
  });
};

export const set_metadata = async (
  shop_id: string,
  metadata: Record<string, unknown>
): Promise<Cart> => {
  const res = await api.post("/cart/metadata", metadata, {
    headers: get_headers(shop_id),
  });
  return res.data;
};

export const cart_action_api = async (
  shop_id: string,
  mode: CartActionMode,
  price_id: string,
  quantity: number
): Promise<Cart> => {
  const res = await api.patch<Cart>(
    `/cart/${mode}/${price_id}`,
    { quantity },
    {
      headers: get_headers(shop_id),
    }
  );
  return res.data;
};
