import React from "react";
import { render, screen } from "@testing-library/react";
import { Image } from "./Image";

test("<Image/>", () => {
  const { container, debug } = render(<Image media_id="1234" />);
  debug();
  const img = container.querySelector("img");
  expect(img?.src).toBe("https://cdn.kirbic.com/@/1234");
});

test("<Image/> crop width", () => {
  const { container, debug } = render(<Image media_id="1234" width={200} />);
  debug();
  const img = container.querySelector("img");
  expect(img?.src).toBe("https://cdn.kirbic.com/@w:200/1234");
  expect(img?.width).toBe(200);
});

test("<Image/> crop heigth", () => {
  const { container, debug } = render(<Image media_id="1234" height={140} />);
  debug();
  const img = container.querySelector("img");
  expect(img?.src).toBe("https://cdn.kirbic.com/@h:140/1234");
  expect(img?.height).toBe(140);
});

test("<Image/> alt and title", () => {
  const { container, debug } = render(
    <Image media_id="1234" alt="A" title="B" width={200} />
  );
  const img = container.querySelector("img");
  expect(img?.src).toBe("https://cdn.kirbic.com/@w:200/1234");
  expect(img?.alt).toBe("A");
  expect(img?.title).toBe("B");
});
