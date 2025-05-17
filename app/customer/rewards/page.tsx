"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BottomNavigation } from "@/components/bottom-navigation"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"
import { Award, ArrowLeft, ArrowRight, Coins } from "lucide-react"
import { RewardTransactionsList } from "@/components/reward-transactions-list"
import { formatCurrency } from "@/lib/utils"

interface Rewards {
  level: string;
  points: number;
  totalSpent: number;
}

interface Reward {
  id: number;
  title: string;
  description: string;
  points: number;
  image: string;
}

interface NextThreshold {
  nextLevel: string;
  progress: number;
  pointsNeeded: number;
}

export default function RewardsPage() {
  const router = useRouter()
  const { t, dir, isRTL } = useLanguage()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [rewards, setRewards] = useState<Rewards | null>(null)
  const [rewardTransactions, setRewardTransactions] = useState([])
  const [nextThreshold, setNextThreshold] = useState<NextThreshold | null>(null)
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([])

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem("is_authenticated") === "true"

    if (!authStatus) {
      router.push("/auth/login")
      return
    }

    // Fetch data
    fetchRewardsData()

    // Mock available rewards
    setAvailableRewards([
      {
        id: 1,
        title: t("rewards.freeDelivery") as string,
        description: t("rewards.freeDeliveryDesc") as string,
        points: 100,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: 2,
        title: t("rewards.discount10"),
        description: t("rewards.discount10Desc"),
        points: 200,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: 3,
        title: t("rewards.discount25"),
        description: t("rewards.discount25Desc"),
        points: 500,
        image: "/placeholder.svg?height=80&width=80",
      },
    ])
  }, [router, t])

  const fetchRewardsData = async () => {
    setIsLoading(true)
    try {
      // Fetch rewards
      const rewardsResponse = await fetch("/api/rewards")
      if (rewardsResponse.ok) {
        const data = await rewardsResponse.json()
        setRewards(data.rewards)
        setRewardTransactions(data.transactions || [])
        setNextThreshold(data.nextThreshold)
      }
    } catch (error) {
      console.error("Error fetching rewards data:", error)
      toast({
        title: "Error",
        description: "Failed to load rewards data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRedeemReward = async (rewardId: number, points: number, title: string) => {
    try {
      const response = await fetch("/api/rewards/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rewardId,
          points,
          description: `Redeemed ${title}`,
        }),
      });

      if (response.ok) {
        toast({
          title: t("rewards.redeemSuccess"),
          description: t("rewards.redeemSuccessMessage", { title }),
        });

        // Refresh rewards data
        fetchRewardsData();
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to redeem reward");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: t("rewards.redeemError"),
        description:
          errorMessage === "Insufficient points"
            ? t("rewards.insufficientPoints")
            : t("rewards.redeemErrorMessage"),
        variant: "destructive",
      });
    }
  }

  // Map level to color
  const levelColors = {
    Bronze: "bg-amber-700",
    Silver: "bg-slate-400",
    Gold: "bg-yellow-500",
    Platinum: "bg-slate-700",
  }

  const levelColor = rewards?.level ? levelColors[rewards.level as keyof typeof levelColors] || "bg-primary" : "bg-primary";

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 max-w-md mx-auto" dir={dir}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 py-3">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              {isRTL ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
            </Button>
            <h1 className="text-xl font-bold ml-2">{t("rewards.title")}</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-6 pb-20 space-y-6">
        {/* Rewards Card */}
        {rewards && (
          <Card className="overflow-hidden">
            <div className={`${levelColor} text-white p-4`}>
              <div className="flex items-center gap-2">
                <Award className="h-6 w-6" />
                <h3 className="font-bold text-lg">{rewards.level}</h3>
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
        )}

        {/* Level Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>{t("rewards.levelBenefits")}</CardTitle>
            <CardDescription>{t("rewards.levelBenefitsDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-amber-700 flex items-center justify-center">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Bronze</p>
                    <p className="text-xs text-slate-500">{t("rewards.bronzeDesc")}</p>
                  </div>
                </div>
                <Badge variant="outline" className={rewards?.level === "Bronze" ? "bg-amber-100" : ""}>
                  {rewards?.level === "Bronze" ? t("rewards.current") : ""}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-slate-400 flex items-center justify-center">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Silver</p>
                    <p className="text-xs text-slate-500">{t("rewards.silverDesc")}</p>
                  </div>
                </div>
                <Badge variant="outline" className={rewards?.level === "Silver" ? "bg-slate-100" : ""}>
                  {rewards?.level === "Silver" ? t("rewards.current") : ""}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Gold</p>
                    <p className="text-xs text-slate-500">{t("rewards.goldDesc")}</p>
                  </div>
                </div>
                <Badge variant="outline" className={rewards?.level === "Gold" ? "bg-yellow-100" : ""}>
                  {rewards?.level === "Gold" ? t("rewards.current") : ""}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Platinum</p>
                    <p className="text-xs text-slate-500">{t("rewards.platinumDesc")}</p>
                  </div>
                </div>
                <Badge variant="outline" className={rewards?.level === "Platinum" ? "bg-slate-100" : ""}>
                  {rewards?.level === "Platinum" ? t("rewards.current") : ""}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Rewards */}
        <div className="space-y-4">
          <h3 className="font-medium">{t("rewards.availableRewards")}</h3>

          <div className="grid grid-cols-1 gap-4">
            {availableRewards.map((reward) => (
              <Card key={reward.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="h-16 w-16 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                      <img
                        src={reward.image || "/placeholder.svg"}
                        alt={reward.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{reward.title}</h4>
                      <p className="text-sm text-slate-500">{reward.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <Coins className="h-4 w-4 text-amber-500" />
                          <span className="font-medium">
                            {reward.points} {t("rewards.points")}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          disabled={(rewards?.points ?? 0) < reward.points}
                          onClick={() => handleRedeemReward(reward.id, reward.points, reward.title)}
                        >
                          {t("rewards.redeem")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        {rewardTransactions.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">{t("rewards.transactionHistory")}</h3>
            <RewardTransactionsList transactions={rewardTransactions} />
          </div>
        )}
      </main>

      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  )
}
