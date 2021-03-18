import { useCartStore } from "../store/CartStore";
import { Cart } from "../store/api";

export type CartHook = {
  hasItems: boolean;
  cart: Cart;
  loading: boolean;
  redirect_to_checkout: () => void;
};

type Actions = ReturnType<typeof useCartStore>["1"];

export const useCart = (): CartHook & Actions => {
  const [{ cart, loading, shop_id }, actions] = useCartStore();

  return {
    ...actions,
    hasItems: cart.lines.length > 0,
    loading,
    cart,
    redirect_to_checkout: () => {
      const checkoutUrl = `https://checkout.kirbic.com/shop/${shop_id}`;
      window.location.href = checkoutUrl;
    },
  };
};
