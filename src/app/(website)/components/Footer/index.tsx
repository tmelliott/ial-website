export default function Footer() {
  return (
    <footer className="p-12 lg:p-24 flex flex-col gap-12">
      <div className="flex justify-between flex-col lg:flex-row">
        <div className="flex text-lg gap-24">
          <ol>
            <li>About</li>
            <li>News</li>
            <li>Projects</li>
            <li>Apps</li>
          </ol>
          <ol>
            <li>Cool stuff</li>
            <li>Horizon Europe</li>
          </ol>
        </div>

        <div className="flex flex-col items-center lg:items-end max-w-xs mt-12 lg:mt-0 mx-auto lg:mx-0">
          <p className="text-lg pb-12 lg:pb-48 text-center lg:text-right">
            Analytics, research, and data visualisation that make a difference.
          </p>
          <div>IMAGE</div>
        </div>
      </div>
      <div className="text-sm">&copy; iNZight Analytics Ltd 2025</div>
    </footer>
  );
}
