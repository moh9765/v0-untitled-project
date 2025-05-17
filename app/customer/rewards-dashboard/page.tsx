"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BottomNavigation } from "@/components/bottom-navigation"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"
import {
  Award,
  ArrowLeft,
  ArrowRight,
  Gift,
  Truck,
  Percent,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Star,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  AlertCircle,
  Sparkles,
  Zap,
  Timer
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { RewardTransactionsList } from "@/components/reward-transactions-list"

interface Reward {
  id: number;
  title: string;
  description: string;
  points: number;
  icon: React.ReactNode;
  featured?: boolean;
  limited?: boolean;
  quickRedeem?: boolean;
}

interface RewardTransaction {
  id: number;
  userId: number;
  orderId?: number;
  points: number;
  transactionType: "earn" | "redeem" | "expire" | "adjust";
  description?: string;
  createdAt: Date;
}

export default function RewardsDashboardPage() {
  const router = useRouter()
  const { t, dir, isRTL } = useLanguage()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [loadingComplete, setLoadingComplete] = useState(false)
  const [loyaltyPoints, setLoyaltyPoints] = useState(750)
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([])
  const [featuredReward, setFeaturedReward] = useState<Reward | null>(null)
  const [quickRedeemRewards, setQuickRedeemRewards] = useState<Reward[]>([])
  const [rewardTransactions, setRewardTransactions] = useState<RewardTransaction[]>([])
  const [nextPurchasePoints, setNextPurchasePoints] = useState(25)
  const [showPointsIndicator, setShowPointsIndicator] = useState(false)
  const dashboardRef = useRef<HTMLDivElement>(null)

  // Milestone tiers data - updated to include all tiers
  const milestones = [
    { points: 200, achieved: true, label: "Bronze", icon: <CheckCircle2 className="h-4 w-4" />, color: "bg-amber-700" },
    { points: 500, achieved: true, label: "Silver", icon: <CheckCircle2 className="h-4 w-4" />, color: "bg-slate-400" },
    { points: 800, achieved: false, label: "Gold", icon: null, color: "bg-yellow-500" },
    { points: 1200, achieved: false, label: "Platinum", icon: null, color: "bg-slate-700" }
  ]

  // Calculate progress percentage for the progress bar
  const calculateProgress = () => {
    const currentPoints = loyaltyPoints;
    const lastAchievedMilestone = milestones.filter(m => m.achieved).pop()?.points || 0;
    const nextMilestone = milestones.find(m => !m.achieved)?.points || lastAchievedMilestone;

    if (lastAchievedMilestone === nextMilestone) return 100;

    const progressRange = nextMilestone - lastAchievedMilestone;
    const userProgress = currentPoints - lastAchievedMilestone;
    return Math.min(Math.round((userProgress / progressRange) * 100), 100);
  }

  // Show points indicator when hovering over next purchase section
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPointsIndicator(true);

      const hideTimer = setTimeout(() => {
        setShowPointsIndicator(false);
      }, 3000);

      return () => clearTimeout(hideTimer);
    }, 2000);

    return () => clearTimeout(timer);
  }, [loadingComplete]);

  // Load dashboard data
  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem("is_authenticated") === "true"

    if (!authStatus) {
      router.push("/auth/login")
      return
    }

    // Mock data loading
    setTimeout(() => {
      setIsLoading(false)

      // Set featured reward
      setFeaturedReward({
        id: 0,
        title: t("rewards.premiumMembership") || "Premium Membership",
        description: t("rewards.premiumMembershipDesc") || "Upgrade to Premium for 1 month and enjoy exclusive benefits",
        points: 1000,
        icon: <Star className="h-20 w-20 text-yellow-500" />,
        featured: true,
        limited: true
      });

      // Set available rewards
      setAvailableRewards([
        {
          id: 1,
          title: t("rewards.freeDelivery") || "Free Delivery",
          description: t("rewards.freeDeliveryDesc") || "Get free delivery on your next order",
          points: 100,
          icon: <Truck className="h-16 w-16 text-primary" />
        },
        {
          id: 2,
          title: t("rewards.discount20") || "20% Off",
          description: t("rewards.discount20Desc") || "Apply discount to your next purchase",
          points: 200,
          icon: <Percent className="h-16 w-16 text-primary" />
        },
        {
          id: 3,
          title: t("rewards.buyOneGetOne") || "Buy One Get One",
          description: t("rewards.buyOneGetOneDesc") || "Redeem for eligible items",
          points: 300,
          icon: <Gift className="h-16 w-16 text-primary" />
        }
      ]);

      // Set quick redeem rewards
      setQuickRedeemRewards([
        {
          id: 4,
          title: t("rewards.freeDelivery") || "Free Delivery",
          description: t("rewards.freeDeliveryDesc") || "Get free delivery on your next order",
          points: 100,
          icon: <Truck className="h-8 w-8 text-primary" />,
          quickRedeem: true
        },
        {
          id: 5,
          title: t("rewards.discount10") || "10% Off",
          description: t("rewards.discount10Desc") || "Apply discount to your next purchase",
          points: 50,
          icon: <Percent className="h-8 w-8 text-primary" />,
          quickRedeem: true
        }
      ]);

      // Set mock transaction history
      setRewardTransactions([
        {
          id: 1,
          userId: 1,
          points: 25,
          transactionType: "earn",
          description: "Order #12345",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        },
        {
          id: 2,
          userId: 1,
          points: -100,
          transactionType: "redeem",
          description: "Redeemed Free Delivery",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
        },
        {
          id: 3,
          userId: 1,
          points: 50,
          transactionType: "earn",
          description: "Order #12340",
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
        },
        {
          id: 4,
          userId: 1,
          points: 100,
          transactionType: "adjust",
          description: "Welcome Bonus",
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
        }
      ]);

      // Simulate completed loading with a slight delay for animations
      setTimeout(() => {
        setLoadingComplete(true);
      }, 500);

    }, 1000);
  }, [router, t])

  const handleRedeemReward = (rewardId: number, points: number, title: string) => {
    if (loyaltyPoints < points) {
      toast({
        title: t("rewards.redeemError") || "Error",
        description: t("rewards.insufficientPoints") || "You don't have enough points",
        variant: "destructive",
      })
      return
    }

    // Mock successful redemption
    toast({
      title: t("rewards.redeemSuccess") || "Success",
      description: t("rewards.redeemSuccessMessage", { title }) || `You've successfully redeemed ${title}`,
    })

    // Update points
    setLoyaltyPoints(prev => prev - points)

    // Add to transaction history
    const newTransaction: RewardTransaction = {
      id: Math.floor(Math.random() * 1000),
      userId: 1,
      points: -points,
      transactionType: "redeem",
      description: `Redeemed ${title}`,
      createdAt: new Date()
    }

    setRewardTransactions(prev => [newTransaction, ...prev])
  }

  const handleQuickRedeem = (reward: Reward) => {
    handleRedeemReward(reward.id, reward.points, reward.title)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>{t("common.loading") || "Loading..."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 max-w-md mx-auto" dir={dir} ref={dashboardRef}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 py-3">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              {isRTL ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
            </Button>
            <h1 className="text-xl font-bold ml-2">{t("rewards.yourRewards") || "Your Rewards"}</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-6 pb-20 space-y-8">
        <AnimatePresence>
          {loadingComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header Section with Points Display */}
              <section className="text-center mb-8">
                <h2 className="text-2xl font-semibold mb-2">{t("rewards.yourRewards") || "Your Rewards"}</h2>
                <motion.div
                  className="text-4xl font-bold text-primary"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  {loyaltyPoints} <span className="text-lg">{t("rewards.points") || "Points"}</span>
                </motion.div>
                <p className="text-sm text-slate-500 mt-1">
                  {t("rewards.earnPointsWithEveryOrder") || "Earn points with every order and unlock exclusive rewards"}
                </p>

                {/* Next Purchase Points Indicator */}
                <motion.div
                  className="mt-2 inline-flex items-center gap-1 text-sm bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-full"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: showPointsIndicator ? 1 : 0,
                    y: showPointsIndicator ? 0 : 10
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Zap className="h-4 w-4 text-primary" />
                  <span>
                    {t("rewards.nextPurchasePoints", { points: nextPurchasePoints }) ||
                      `Earn ${nextPurchasePoints} points on your next purchase`}
                  </span>
                </motion.div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Featured Reward Section */}
        <AnimatePresence>
          {loadingComplete && featuredReward && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  {t("rewards.featuredReward") || "Featured Reward"}
                </h3>
                {featuredReward.limited && (
                  <Badge variant="outline" className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    <Timer className="h-3 w-3 mr-1" />
                    {t("rewards.limitedTime") || "Limited Time"}
                  </Badge>
                )}
              </div>

              <Card className="overflow-hidden border-2 border-yellow-200 dark:border-yellow-900/50 hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-4">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <motion.div
                      className="flex-shrink-0 p-4 bg-white/80 dark:bg-slate-800/50 rounded-full shadow-md"
                      whileHover={{ rotate: 5, scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {featuredReward.icon}
                    </motion.div>
                    <div className="flex-1 text-center md:text-left">
                      <h4 className="text-xl font-bold">{featuredReward.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{featuredReward.description}</p>
                      <div className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-between">
                        <div className="flex items-center gap-1">
                          <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                          <span className="font-bold">{featuredReward.points} {t("rewards.points") || "Points"}</span>
                        </div>
                        <Button
                          className="w-full md:w-auto"
                          disabled={loyaltyPoints < featuredReward.points}
                          onClick={() => handleRedeemReward(featuredReward.id, featuredReward.points, featuredReward.title)}
                        >
                          {t("rewards.redeem") || "Redeem"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Daily Deal Section */}
        <AnimatePresence>
          {loadingComplete && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <div className="bg-glass backdrop-blur-lg border-neon rounded-2xl p-4 shadow-holographic">
                <div className="relative px-4">
                  <div className="flex-shrink-0 w-full relative">
                    <div className="h-44 bg-gradient-to-tr from-indigo-200 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-2xl p-4 shadow-md relative overflow-hidden">
                      <h4 className="text-lg font-bold mb-1">{t("rewards.dailyDeal", { number: 1 }) || "Daily Deal #1"}</h4>
                      <p className="text-sm opacity-80 mb-3">
                        {t("rewards.dailyDealDescription") || "Double points on all orders today! Earn rewards twice as fast."}
                      </p>
                      <Button
                        size="sm"
                        className="rounded-full"
                        onClick={() => {
                          toast({
                            title: t("rewards.dealActivated") || "Deal Activated",
                            description: t("rewards.dealActivatedDesc") || "You'll earn double points on your next order today!",
                          })
                        }}
                      >
                        {t("rewards.activateDeal") || "Activate Deal"}
                      </Button>

                      {/* Decorative elements */}
                      <div className="absolute top-4 right-4 h-20 w-20 rounded-full bg-white/10 blur-xl"></div>
                      <div className="absolute bottom-4 left-4 h-12 w-12 rounded-full bg-white/10 blur-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Quick Redeem Section */}
        <AnimatePresence>
          {loadingComplete && quickRedeemRewards.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8"
            >
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                {t("rewards.quickRedeem") || "Quick Redeem"}
              </h3>

              <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                {quickRedeemRewards.map((reward) => (
                  <motion.div
                    key={reward.id}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex-shrink-0"
                  >
                    <Card className="w-40 overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-3 flex flex-col items-center text-center">
                        <div className="my-2">
                          {reward.icon}
                        </div>
                        <h4 className="font-bold text-sm">{reward.title}</h4>
                        <div className="flex items-center justify-center gap-1 my-1">
                          <span className="text-xs font-semibold">{reward.points}</span>
                          <span className="text-xs text-slate-500">{t("rewards.points") || "Points"}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-1"
                          disabled={loyaltyPoints < reward.points}
                          onClick={() => handleQuickRedeem(reward)}
                        >
                          {t("rewards.redeem") || "Redeem"}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Reward Journey Progress */}
        <AnimatePresence>
          {loadingComplete && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-8"
            >
              <h3 className="text-lg font-medium mb-4">{t("rewards.rewardJourney") || "Your Reward Journey"}</h3>

              <Card>
                <CardContent className="p-4">
                  <div className="space-y-6">
                    {/* Tier progress visualization */}
                    <div className="relative pt-6 pb-12">
                      <Progress value={calculateProgress()} className="h-3 rounded-full" />

                      {/* Milestone markers */}
                      {milestones.map((milestone, index) => {
                        // Get position class based on index
                        const positionClass = index === 0 ? 'milestone-position-0' :
                                             index === 1 ? 'milestone-position-33' :
                                             index === 2 ? 'milestone-position-66' :
                                             'milestone-position-100';

                        return (
                          <div
                            key={milestone.points}
                            className={`absolute bottom-8 transform -translate-x-1/2 flex flex-col items-center ${positionClass}`}
                          >
                            <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                              milestone.achieved ? milestone.color || 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'
                            } text-white`}>
                              {milestone.achieved ? milestone.icon : null}
                            </div>
                            <span className="text-xs font-medium mt-1">{milestone.label}</span>
                            <span className="text-xs text-slate-500">{milestone.points}</span>
                          </div>
                        );
                      })}

                      {/* Current position marker */}
                      <div
                        className={`absolute bottom-8 transform -translate-x-1/2 position-${Math.min(
                          Math.max(
                            Math.floor((loyaltyPoints / milestones[milestones.length - 1].points) * 10) * 10,
                            0
                          ),
                          100
                        )}`}
                      >
                        <motion.div
                          className="h-6 w-6 rounded-full bg-secondary border-2 border-white dark:border-slate-800 shadow-md"
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: "loop",
                            ease: "easeInOut"
                          }}
                        ></motion.div>
                        <div className="absolute top-7 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 px-2 py-1 rounded shadow-sm">
                          <span className="text-xs font-bold">{loyaltyPoints}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tier benefits */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
                      {milestones.map((milestone) => (
                        <div
                          key={milestone.label}
                          className={`p-2 rounded-lg ${
                            milestone.achieved
                              ? `${milestone.color} bg-opacity-20 dark:bg-opacity-30`
                              : 'bg-slate-100 dark:bg-slate-800'
                          }`}
                        >
                          <div className="text-xs font-medium">{milestone.label}</div>
                          <div className={`text-sm font-bold ${milestone.achieved ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                            {milestone.points}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-center text-sm text-slate-500">
                      {loyaltyPoints >= milestones[milestones.length - 1].points ? (
                        <p>{t("rewards.maxTierReached") || "You've reached the highest tier!"}</p>
                      ) : (
                        <p>
                          {t("rewards.pointsToNextTier", {
                            points: milestones.find(m => !m.achieved)?.points - loyaltyPoints
                          }) || `${milestones.find(m => !m.achieved)?.points - loyaltyPoints} points to next tier`}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Available Rewards Section */}
        <AnimatePresence>
          {loadingComplete && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-8"
            >
              <h3 className="text-lg font-medium mb-4">{t("rewards.availableRewards") || "Available Rewards"}</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {availableRewards.map((reward, index) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
                      <CardContent className="p-4 flex flex-col items-center text-center h-full">
                        <div className="my-3">
                          {reward.icon}
                        </div>
                        <h4 className="font-bold text-base">{reward.title}</h4>
                        <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-grow">{reward.description}</p>
                        <Button
                          className="w-full mt-auto"
                          disabled={loyaltyPoints < reward.points}
                          onClick={() => handleRedeemReward(reward.id, reward.points, reward.title)}
                        >
                          {t("rewards.redeem") || "Redeem"} • {reward.points} {t("rewards.points") || "Points"}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/customer/rewards" className="flex items-center justify-end">
                    {t("rewards.viewAllRewards") || "View All Rewards"}
                    {isRTL ? <ChevronLeft className="h-4 w-4 ml-1" /> : <ChevronRight className="h-4 w-4 ml-1" />}
                  </Link>
                </Button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Points History Section */}
        <AnimatePresence>
          {loadingComplete && rewardTransactions.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">{t("rewards.pointsHistory") || "Points History"}</h3>
                <Button variant="ghost" size="sm">
                  {t("rewards.viewAll") || "View All"}
                </Button>
              </div>

              <RewardTransactionsList transactions={rewardTransactions} />
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  )
}
