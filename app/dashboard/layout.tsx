import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardMobileNav } from "@/components/dashboard/mobile-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="lg:pl-64">
        <div className="container mx-auto px-4 py-6 pb-24 lg:pb-6">
          {children}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <DashboardMobileNav />
    </div>
  )
}
