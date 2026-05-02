import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const AppLayout = ({ children, title }: AppLayoutProps) => (
  <div className="flex h-screen w-full overflow-hidden bg-background">
    <Sidebar />
    <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
      <Header title={title} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  </div>
);
