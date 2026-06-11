import { Dock } from "@/components/dock";
import { StatusBar } from "@/components/status-bar";
import { HomeGrid } from "@/components/widgets";
import type { DockItemContent, HomeWidgetContent, Profile } from "@/types";

interface HomeScreenProps {
  profile: Profile;
  content: HomeWidgetContent;
  dockItems: DockItemContent[];
}

export function Wallpaper() {
  return <div aria-hidden="true" className="home-wallpaper" />;
}

export function HomeScreen({ profile, content, dockItems }: HomeScreenProps) {
  return (
    <section
      data-home-screen="true"
      className="home-screen font-sans text-slate-50 opacity-100 filter-none"
    >
      <Wallpaper />
      <div className="home-content">
        <StatusBar />
        <HomeGrid profile={profile} content={content} />
      </div>

      <Dock items={dockItems} />
    </section>
  );
}
