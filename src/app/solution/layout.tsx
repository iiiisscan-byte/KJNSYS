import LNB from "@/components/layout/LNB";

const solutionNav = [
  { label: "스캔 솔루션", href: "/solution" },
  { label: "가상화 솔루션", href: "/solution/virtualization" },
];

export default function SolutionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="container mt-2">
        <h1 className="text-center mb-1">SOLUTION</h1>
      </div>
      <LNB items={solutionNav} />
      {children}
    </>
  );
}
