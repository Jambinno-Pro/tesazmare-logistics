import PricingClient from "./PricingClient";
import type { Metadata } from "next";
import { pricingMetadata } from "./metadata";

export const metadata: Metadata = pricingMetadata;

export default function PricingPage() {
  return <PricingClient />;
}
