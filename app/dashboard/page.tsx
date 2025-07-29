import { DashboardWrapper } from "./dashboard-wrapper"
import { getPocketTags } from "./get-pocket-tags"
import { getPocketItems } from "./get-pocket-items"

export default async function Dashboard() {
  const [pocketTags, pocketItems] = await Promise.all([getPocketTags(), getPocketItems()])

  await new Promise(resolve => setTimeout(resolve, 30000))
  return (
    <DashboardWrapper 
      pocketItems={pocketItems}
      pocketTags={pocketTags}
    />
  )
}