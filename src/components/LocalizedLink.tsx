"use client";

import Link, { LinkProps } from "next/link";
import { useParams } from "next/navigation";
import { ReactNode } from "react";

interface LocalizedLinkProps extends Omit<LinkProps, "href"> {
  href: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function LocalizedLink({
  href,
  children,
  className,
  style,
  ...linkProps
}: LocalizedLinkProps) {
  const params = useParams();
  const currentLocale = params.locale as string;

  const localizedHref = href.startsWith("/")
    ? `/${currentLocale}${href}`
    : `/${currentLocale}/${href}`;

  return (
    <Link
      href={localizedHref}
      className={className}
      style={style}
      {...linkProps}
    >
      {children}
    </Link>
  );
}
