import ToolSidebar from "../components/ToolSideBar";

export default function ToolLayout({ children }) {

  return (
    <div className="flex min-h-screen bg-[#020617] text-white">

      {/* Sidebar */}
      <ToolSidebar />

      {/* Page Content */}
      <main className="flex-1 p-10 overflow-y-auto">

        {children}

      </main>

    </div>
  );
}