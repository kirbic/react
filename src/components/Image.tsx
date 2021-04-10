import React, { FC, ImgHTMLAttributes, useMemo } from "react";
import * as R from "ramda";
import PropTypes from "prop-types";

type Transforms = {
  width?: number;
  height?: number;
};

type ImageProps = Transforms & {
  media_id: string;
};
const shorteners: Record<string, string> = {
  width: "w",
  height: "h",
};

const chain_transforms = (t: Transforms) => {
  const to_chain = R.toPairs(t);
  return to_chain
    .map(([key, val]) => val && `${shorteners[key]}:${val}`)
    .filter((e) => e)
    .join(",");
};

export const Image: FC<ImageProps & ImgHTMLAttributes<any>> = ({
  media_id,
  ...props
}) => {
  const url = useMemo(() => {
    const base = "https://cdn.kirbic.com";
    const transforms = chain_transforms(R.pick(Object.keys(shorteners), props));
    return `${base}/@${transforms}/${media_id}`;
  }, R.props(Object.keys(shorteners), props));

  return <img src={url} {...props} />;
};
Image.propTypes = {
  media_id: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};
