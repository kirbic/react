import React, { useContext } from "react";
import { CartContainer } from "../store/CartStore";

type KirbicConfig = {
  shop_id: string;
  access_token?: string;
};

const KirbicContext = React.createContext<KirbicConfig>({
  shop_id: "invalid-shop",
});

type KirbicProps = {
  config: KirbicConfig;
};

export const useKirbic = () => {
  const config = useContext(KirbicContext);
  return config;
};

export const Kirbic: React.FC<KirbicProps> = ({ children, config }) => {
  return (
    <KirbicContext.Provider value={config}>
      <CartContainer {...config}>{children}</CartContainer>
    </KirbicContext.Provider>
  );
};
