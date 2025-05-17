"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Award, ChevronRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { formatCurrency } from "@/lib/utils"

interface RewardCardProps {
  rewards: {
    points: number
    totalSpent: number
    level: string
  }
  nextThreshold: {
    currentLevel: string
    nextLevel: string | null
    pointsNeeded: number
    progress: number
  } | null
  onViewDetails: () => void
}

export function RewardCard({ rewards, nextThreshold, onViewDetails }: RewardCardProps) {
  const { t, isRTL } = useLanguage()

  // Map level to Tailwind classes instead of dynamic colors
  const getLevelClass = (level: string) => {
    switch (level) {
      case "Bronze":
        return "bg-amber-700"
      case "Silver":
        return "bg-slate-400"
      case "Gold":
        return "bg-yellow-500"
      case "Platinum":
        return "bg-slate-700"
      default:
        return "bg-primary"
    }
  }

  const levelClass = getLevelClass(rewards.level)

  return (
    <Card className="overflow-hidden">
      <div className={`${levelClass} text-white p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6" />
            <h3 className="font-bold text-lg">{rewards.level}</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-white hover:bg-white/20"
            onClick={onViewDetails}
          >
            {t("common.viewDetails")}
            {isRTL ? <ChevronRight className="h-4 w-4 ml-1 rotate-180" /> : <ChevronRight className="h-4 w-4 ml-1" />}
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-slate-500">{t("rewards.availablePoints")}</p>
            <p className="text-2xl font-bold">{rewards.points}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">{t("rewards.totalSpent")}</p>
            <p className="text-lg font-semibold">{formatCurrency(rewards.totalSpent)}</p>
          </div>
        </div>

        {nextThreshold && nextThreshold.nextLevel && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{rewards.level}</span>
              <span>{nextThreshold.nextLevel}</span>
            </div>
            <Progress value={nextThreshold.progress} className="h-2" />
            <p className="text-xs text-slate-500 text-center">
              {t("rewards.pointsToNextLevel", { points: nextThreshold.pointsNeeded })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
