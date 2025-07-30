import { DashboardWrapper } from "./dashboard-wrapper"
import { getPocketTags } from "./get-pocket-tags"
import { getPocketItems } from "./get-pocket-items"

export default async function Dashboard() {
  const [pocketTags, pocketItems] = await Promise.all([getPocketTags(), getPocketItems()])

  return (
    <DashboardWrapper 
      pocketItems={pocketItems}
      pocketTags={pocketTags}
    />
  )
}