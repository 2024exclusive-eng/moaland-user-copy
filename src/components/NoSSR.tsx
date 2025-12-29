import dynamic from "next/dynamic";
import { ReactNode } from "react";

export default dynamic(
  () => Promise.resolve(({ children }: { children?: ReactNode }) => children),
  {
    ssr: false,
  }
);
