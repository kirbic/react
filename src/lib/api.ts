import axios, { AxiosInstance } from "axios";

export type ApiConfig = {
  shop_id: string;
  access_token?: string;
};

export const get_api = ({
  shop_id,
  access_token,
}: ApiConfig): AxiosInstance => {
  if (!shop_id) {
    console.warn("KIRBIC: Missing shop_id");
  }
  let headers: Record<string, string> = {
    "x-shopcopter-shop": shop_id,
  };
  if (access_token) {
    headers = { ...headers, Authorization: `Bearer ${access_token}` };
  }

  return axios.create({
    baseURL: "https://api.kirbic.com",
    withCredentials: true,
    headers,
  });
};
