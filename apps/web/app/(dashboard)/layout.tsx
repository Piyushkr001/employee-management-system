export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-muted/20 p-4">
        {/* Placeholder for dashboard sidebar */}
        <h2 className="text-lg font-bold">Dashboard</h2>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
