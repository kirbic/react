import React, { FC, ImgHTMLAttributes, useMemo } from "react";
import * as R from "ramda";
import PropTypes from "prop-types";

type Transforms = {
  width?: number;
  height?: number;
  density?: number;
};

type ImageProps = Omit<Transforms, "density"> & {
  media_id: string;
};
const shorteners: Record<string, string> = {
  width: "w",
  height: "h",
  density: "d",
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
  const { src, srcset } = useMemo(() => {
    const base = "https://cdn.kirbic.com";
    const transformers = R.pick(Object.keys(shorteners), props);
    const transforms = chain_transforms(transformers);
    const transforms_2x = chain_transforms({ ...transformers, density: 2 });
    return {
      src: `${base}/@${transforms}/${media_id}`,
      srcset: `${base}/@${transforms}/${media_id} 1x,${base}/@${transforms_2x}/${media_id} 2x`,
    };
  }, R.props(Object.keys(shorteners), props));

  return <img src={src} srcSet={srcset} {...props} />;
};
Image.propTypes = {
  media_id: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};
