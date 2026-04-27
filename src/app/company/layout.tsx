import LNB from "@/components/layout/LNB";

const companyNav = [
  { label: "회사소개", href: "/company" },
  { label: "기술", href: "/company/tech" },
];

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="container mt-2">
        <h1 className="text-center mb-1">COMPANY</h1>
      </div>
      <LNB items={companyNav} />
      {children}
    </>
  );
}
