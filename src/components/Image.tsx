import React, { FC, useMemo } from "react";
import * as R from "ramda";

type Transforms = {
  width?: number;
  height?: number;
};

type ImageProps = Transforms & {
  media_id: string;
  [key: string]: any;
};
const shorteners: Record<string, string> = {
  width: "w",
  height: "h",
};

const chain_transforms = (t: Transforms) => {
  const to_chain = R.toPairs(t);
  return to_chain.map(([key, val]) => `${shorteners[key]}:${val}`).join(",");
};

export const Image: FC<ImageProps> = ({
  media_id,
  width,
  height,
  ...props
}) => {
  const url = useMemo(() => {
    const base = "https://cdn.kirbic.com";
    const transforms = chain_transforms({ width, height });
    return `${base}/@${transforms}/${media_id}`;
  }, []);
  return <img src={url} {...props} />;
};
