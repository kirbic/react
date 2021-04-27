import React, { useMemo } from "react";
import { equals, always, T, cond } from "ramda";

import { Unit as UnitType } from "../lib/kit";

const plural = (singular: string, plural: string) => (qty: number) =>
  qty > 1 ? plural : singular;

const unitLabel = (unit: UnitType, qty = 1) => {
  cond<string, any>([
    [equals("units"), always(plural("ud.", "uds."))],
    [equals("box"), always(plural("caja", "cajas"))],
    [equals("pallet"), always(plural("palé", "palés"))],
    [equals("item"), always(plural("artículo", "artículos"))],
    [equals("pack"), always(plural("artículo", "artículos"))],
    [T, always(plural(".", ".."))],
  ])(unit as string)(qty);
  return unitLabel;
};

type UnitProps = {
  unit: UnitType;
  quantity?: number;
  prefix?: string;
  sufix?: string;
};

export const Unit: React.FC<UnitProps> = ({
  unit,
  prefix,
  sufix,
  quantity = 1,
}: UnitProps) => {
  const labeledUnit = useMemo(() => unitLabel(unit, quantity), [
    unit,
    quantity,
  ]);
  return (
    <span>
      {prefix}
      {labeledUnit}
      {sufix}
    </span>
  );
};
