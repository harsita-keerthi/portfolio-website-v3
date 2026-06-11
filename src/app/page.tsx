import { PortfolioOS } from "@/components/portfolio-os";
import { profile } from "@/data/profile";
import { dockItems, homeWidgetContent } from "@/data/widgets";

export default function Home() {
  return (
    <PortfolioOS
      profile={profile}
      content={homeWidgetContent}
      dockItems={dockItems}
    />
  );
}
