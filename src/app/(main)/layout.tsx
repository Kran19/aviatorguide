import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AgeGateModal } from "@/components/common/AgeGateModal";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AgeGateModal />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
