"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export default function Counter() {
  const [count, setCount] = React.useState<number>(0);

  return (
    <Button variant={"default"} onClick={() => setCount((x) => x + 1)}>
      Clicked {count} times
    </Button>
  );
}
