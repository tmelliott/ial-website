import Header from "../components/Header";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`bg-black`}>
      <Header />
      {children}
    </div>
  );
}
