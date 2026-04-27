import LNB from "@/components/layout/LNB";

const productNav = [
  { label: "평판 스캐너", href: "/product" },
  { label: "고속 스캐너", href: "/product/highspeed" },
  { label: "북 스캐너", href: "/product/book" },
  { label: "상품권 스캐너", href: "/product/voucher" },
  { label: "바코드 스캐너", href: "/product/barcode" },
  { label: "지문 스캐너", href: "/product/fingerprint" },
  { label: "필름 스캐너", href: "/product/film" },
  { label: "표본 스캐너", href: "/product/specimen" },
  { label: "신분증 스캐너", href: "/product/idcard" },
  { label: "생명공학 스캐너", href: "/product/bio" },
];

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="container mt-2">
        <h1 className="text-center mb-1">PRODUCT</h1>
      </div>
      <LNB items={productNav} />
      {children}
    </>
  );
}
