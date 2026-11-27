import { Upload } from "lucide-react";
import { FilePicker } from "@/components/file-picker";
import { SidebarNav } from "@/components/sidebar-nav";

export default function Home() {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
      <SidebarNav
        items={[
          { href: "#add-files", label: "New transfer", icon: <Upload />, current: true },
        ]}
      />

      <main className="mx-auto w-full max-w-214 px-5 pt-11 pb-14 sm:px-10 sm:pt-16 lg:pt-22">
        <FilePicker />
      </main>
    </div>
  );
}
