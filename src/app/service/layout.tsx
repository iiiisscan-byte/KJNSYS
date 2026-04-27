import LNB from "@/components/layout/LNB";

const serviceNav = [
  { label: "고객센터 안내", href: "/service" },
  { label: "서비스 문의", href: "/service/inquiry" },
  { label: "자료실", href: "/service/archive" },
];

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="container mt-2">
        <h1 className="text-center mb-1">SERVICE</h1>
      </div>
      <LNB items={serviceNav} />
      {children}
    </>
  );
}
