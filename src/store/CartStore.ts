import {
  createStore,
  createHook,
  createContainer,
  StoreActionApi,
} from "react-sweet-state";

import {
  cart_action_api,
  delete_cart,
  get_cart,
  set_metadata,
  Cart,
  CartActionMode,
} from "./api";

type State = {
  shop_id: string;
  cart: Cart;
  loading: boolean;
};
type StoreApi = StoreActionApi<State>;

const initialState: State = {
  shop_id: "1234",
  cart: {
    lines: [],
    total: "0.00",
    id: "000",
    shop_id: "1234",
  },
  loading: true,
};

const private_fetch = () => async ({ setState, getState }: StoreApi) => {
  const { shop_id } = getState();
  const cartObtained = await get_cart(shop_id);
  setState({ cart: cartObtained, loading: false });
  console.log("[kibic-cart] refreshed!");
};

const cart_action = (mode: CartActionMode) => (
  price_id: string,
  quantity: number = 1
) => async ({ getState, dispatch }: StoreApi) => {
  const { shop_id } = getState();
  await cart_action_api(shop_id, mode, price_id, quantity);
  await dispatch(private_fetch());
};

const actions = {
  /* Line actions */
  line_add: cart_action("add"),
  line_remove: cart_action("remove"),
  line_delete: cart_action("delete"),
  line_set: cart_action("set"),

  /* Cart actions */
  cart_refresh: private_fetch,
  cart_delete: () => async ({ getState, dispatch }: StoreApi) => {
    const { shop_id } = getState();
    await delete_cart(shop_id);
    await dispatch(private_fetch());
  },
  cart_set_metadata: (metadata: Record<string, any>) => async ({
    getState,
    dispatch,
  }: StoreApi) => {
    const { shop_id } = getState();
    await set_metadata(shop_id, metadata);
    await dispatch(private_fetch());
  },
};

type Actions = typeof actions;

export const CartStore = createStore<State, Actions>({
  initialState,
  actions,
});

export const useCartStore = createHook(CartStore);

type ContainerProps = { shop_id: string };
export const CartContainer = createContainer<State, Actions, ContainerProps>(
  CartStore,
  {
    onInit: () => async (
      { setState, dispatch }: StoreApi,
      { shop_id }: ContainerProps
    ) => {
      await setState({ shop_id });
      await dispatch(private_fetch());
    },
  }
);
