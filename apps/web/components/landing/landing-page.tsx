import { HeroSection } from "./hero-section";
import { PlatformHighlights } from "./platform-highlights";
import { FeaturesSection } from "./features-section";
import { AnalyticsSection } from "./analytics-section";
import { RolesSection } from "./roles-section";
import { HierarchySection } from "./hierarchy-section";
import { SecuritySection } from "./security-section";
import { CtaSection } from "./cta-section";

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <main>
        <HeroSection />
        <PlatformHighlights />
        <FeaturesSection />
        <AnalyticsSection />
        <RolesSection />
        <HierarchySection />
        <SecuritySection />
        <CtaSection />
      </main>
    </div>
  );
}
