"use client";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function Page() {
  const logger = () => toast.success("hello world");

  return (
    <div>
      <Button onClick={logger}>click me</Button>
    </div>
  );
}
