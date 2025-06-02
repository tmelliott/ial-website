export default function Footer() {
  return (
    <footer className="p-24 flex justify-between">
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

      <div className="flex flex-col items-end max-w-xs">
        <p className="text-lg pb-48">
          Analytics, research, and data visualisation that make a difference.
        </p>
        <div>IMAGE</div>
      </div>
    </footer>
  );
}
