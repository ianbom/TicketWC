import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div
      className="flex flex-wrap justify-between gap-4 px-4 lg:px-6 text-beig
                 *:data-[slot=card]:shadow-xs
                 *:data-[slot=card]:bg-black
                 *:data-[slot=card]:text-beig
                 dark:*:data-[slot=card]:bg-black
                 dark:*:data-[slot=card]:text-beig"
    >
      {/* Card 1 */}
      <Card className="@container/card flex-1 min-w-[250px] bg-dark text-beig border border-beig/20">
        <CardHeader className="relative">
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            $1,250.00
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs text-beig border-beig/40">
              <TrendingUpIcon className="size-3" />
              +12.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex gap-2 font-medium">
            Trending up this month <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-beig/60">
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>

      {/* Card 2 */}
      <Card className="@container/card flex-1 min-w-[250px] bg-dark text-beig border border-beig/20">
        <CardHeader className="relative">
          <CardDescription>New Customers</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            1,234
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs text-beig border-beig/40">
              <TrendingDownIcon className="size-3" />
              -20%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex gap-2 font-medium">
            Down 20% this period <TrendingDownIcon className="size-4" />
          </div>
          <div className="text-beig/60">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>

      {/* Card 3 */}
      <Card className="@container/card flex-1 min-w-[250px] bg-dark text-beig border border-beig/20">
        <CardHeader className="relative">
          <CardDescription>Active Accounts</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            45,678
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs text-beig border-beig/40">
              <TrendingUpIcon className="size-3" />
              +12.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex gap-2 font-medium">
            Strong user retention <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-beig/60">Engagement exceed targets</div>
        </CardFooter>
      </Card>

      {/* Card 4 */}
      <Card className="@container/card flex-1 min-w-[250px] bg-dark text-beig border border-beig/20">
        <CardHeader className="relative">
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            4.5%
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs text-beig border-beig/40">
              <TrendingUpIcon className="size-3" />
              +4.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex gap-2 font-medium">
            Steady performance <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-beig/60">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  );
}
