import React from "react";

import { GradientBackground } from "./gradient-background";
import { Header } from "./header";

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="h-dvh relative">
      <div className="max-h-full overflow-auto" id="dashboard-scroll">
        <GradientBackground />
        <Header />
        {children}
      </div>
    </div>
  )
}