import { Header } from "@/app/dashboard/header"

import { DashboardWrapper, PocketItem, PocketTag } from "./dashboard-wrapper"
import { getPocketTags } from "./get-pocket-tags"
import { getPocketItems } from "./get-pocket-items"
import { GradientBackground } from "./gradient-background"

export default async function Dashboard() {
  const [pocketTags, pocketItems] = await Promise.all([getPocketTags(), getPocketItems()])

  return (
    <div className="h-dvh relative">
      <div className="max-h-full overflow-auto" id="dashboard-scroll">
        <GradientBackground />
        <Header />
        <DashboardWrapper 
          pocketItems={pocketItems}
          pocketTags={pocketTags}
        />
      </div>
    </div>
  )
}