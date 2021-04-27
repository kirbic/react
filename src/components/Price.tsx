import React, { useMemo, FC, Children } from "react";

import { Price as PriceType, Currency } from "@kirbic/apikit/kit";

type PriceProps = {
  price?: PriceType;
  multiplier?: number;
  children?: number | string;
  defaultCurrency?: Currency;
  defaultLocale?: string;
  intl_options?: Intl.NumberFormatOptions;
};
/* eslint react/prop-types: off */

export const Price: FC<PriceProps> = ({
  price,
  children,
  defaultCurrency = "EUR",
  multiplier = 1,
  defaultLocale = "de-DE",
  intl_options = {},
}) => {
  const presentable = useMemo(() => {
    // Check multiplier
    if (multiplier < 0) {
      throw new Error("Multiplier should be an integer bigger than 0");
    }

    // validate children
    let validChildren = false;
    if (Children.count(children) === 1) {
      validChildren = true;
    }

    // validate price
    let validPrice = false;
    if (price) {
      validPrice = true;
    }

    // Use price or pass a children
    if (validPrice && validChildren) {
      throw new Error(
        "Use price prop or pass a number as a children, not both"
      );
    }

    const amountValue =
      parseFloat(price?.unit_amount || (children as any)) * multiplier;
    const currency = price?.currency || defaultCurrency;
    const formatter = new Intl.NumberFormat(defaultLocale, {
      style: "currency",
      currency,
      ...intl_options,
    });
    return formatter.format(amountValue);
  }, [multiplier, price, children, defaultLocale, defaultCurrency]);

  return <span>{presentable}</span>;
};
