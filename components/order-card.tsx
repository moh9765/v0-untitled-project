"use client";

import { useLanguage } from "@/contexts/language-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Package, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Order } from "@/lib/types";

interface OrderCardProps {
  order: Order;
}

// Helper to clean and safely convert date strings
const cleanDateString = (dateString?: string): string => {
  if (!dateString || typeof dateString !== "string") return "";
  return dateString.replace(" ", "T").split(".")[0];
};

export function OrderCard({ order }: OrderCardProps) {
  const { t, isRTL } = useLanguage();

  const formatDate = (dateString?: string) => {
    const cleaned = cleanDateString(dateString);
    if (!cleaned) return t("common.unknownDate"); // fallback if invalid
    const date = new Date(cleaned);
    if (isNaN(date.getTime())) return t("common.unknownDate");
    return new Intl.DateTimeFormat("en", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center mr-3">
              <Package className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <h3 className="font-medium">{order.id}</h3>
              <p className="text-sm text-slate-500">{formatDate(order.created_at)}</p>
            </div>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              order.status === "Delivered"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                : order.status === "In Transit"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
            }`}
          >
            {order.status}
          </span>
        </div>

        <div className="grid gap-2 mt-3">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-slate-500">{t("delivery.from")}</p>
              <p className="font-medium">{order.pickupAddress}</p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-slate-500">{t("delivery.to")}</p>
              <p className="font-medium">{order.deliveryAddress}</p>
            </div>
          </div>

          {order.estimatedDelivery && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-slate-500" />
              <span>
                {t("delivery.estimatedDelivery")}: {order.estimatedDelivery}
              </span>
            </div>
          )}
        </div>

        <Button variant="link" asChild className="px-0 mt-2">
          <Link href={`/customer/track?id=${order.id}`} className="flex items-center gap-1">
            {t("delivery.trackOrders")}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
