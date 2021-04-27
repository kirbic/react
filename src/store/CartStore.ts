import {
  createStore,
  createHook,
  createContainer,
  StoreActionApi,
} from "react-sweet-state";
import {
  ApiConfig,
  ApiKit,
  Cart,
  CartActionMode,
  kirbic_api_kit,
} from "@kirbic/apikit";

type State = {
  api: ApiKit;
  cart: Cart;
  loading: boolean;
};
type StoreApi = StoreActionApi<State>;

const initialState: State = {
  api: kirbic_api_kit({ shop_id: "invalid-shop" }),
  cart: {
    lines: [],
    total: "0.00",
    id: "000",
    shop_id: "1234",
  },
  loading: true,
};

const private_fetch = () => async ({ setState, getState }: StoreApi) => {
  const { api } = getState();
  try {
    const cartObtained = await api.get_cart();
    setState({ cart: cartObtained, loading: false });
    console.log("[kibic-cart] refreshed!");
  } catch (error) {
    console.error(`Error, cannot fetch cart from API, invalid data`);
  }
};

const cart_action = (mode: CartActionMode) => (
  price_id: string,
  quantity: number = 1
) => async ({ getState, dispatch }: StoreApi) => {
  const { api } = getState();
  await api.cart_action_api(mode, price_id, quantity);
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
    const { api } = getState();
    await api.delete_cart();
    await dispatch(private_fetch());
  },
  cart_set_metadata: (metadata: Record<string, any>) => async ({
    getState,
    dispatch,
  }: StoreApi) => {
    const { api } = getState();
    await api.set_metadata(metadata);
    await dispatch(private_fetch());
  },
};

type Actions = typeof actions;

export const CartStore = createStore<State, Actions>({
  initialState,
  actions,
});

export const useCartStore = createHook(CartStore);

export const CartContainer = createContainer<State, Actions, ApiConfig>(
  CartStore,
  {
    onInit: () => async (
      { setState, dispatch }: StoreApi,
      config: ApiConfig
    ) => {
      await setState({ api: kirbic_api_kit(config) });
      await dispatch(private_fetch());
    },
  }
);
