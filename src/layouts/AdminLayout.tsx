import PageTransition from "../components/ui/PageTransition";
import TopProgressBar from "../components/ui/TopProgressBar";
import { usePageTransition } from "../hooks/usePageTransition";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isTransitioning } = usePageTransition();
  return (
    <>
      <TopProgressBar loading={isTransitioning} />
      <PageTransition adminMode>
        {children}
      </PageTransition>
    </>
  );
} 