import Button from "../components/Button";

const BUTTON_TYPES: Parameters<typeof Button>[0]["type"][] = [
  "primary",
  "secondary",
  "alternate",
] as const;
const BUTTON_VARIANTS: Parameters<typeof Button>[0]["variant"][] = [
  "filled",
  "outlined",
];

export default function Page() {
  return (
    <div className="flex justify-center bg-gray-50 min-h-screen dark:bg-black dark:text-gray-50">
      <div className="container px-4 py-8 flex flex-col gap-8">
        <div className="border-b">
          <h1 className="text-4xl mb-4">iNZight Analytics Brand</h1>
        </div>

        <div className="">
          <h2 className="text-2xl mb-2">Colours</h2>
          <div className="h-32 flex gap-1 bg-gray-500 p-4">
            <div className="w-6/10 bg-white dark:bg-black"></div>
            <div className="w-3/10 bg-black dark:bg-white"></div>
            <div className="w-1/10 bg-accent-500"></div>
          </div>
          <div className="p-4 space-y-2">
            {BUTTON_VARIANTS.map((variant) => (
              <div className="grid grid-cols-5 gap-4" key={variant}>
                {BUTTON_TYPES.map((type) => (
                  <Button
                    key={type}
                    type={type}
                    variant={variant}
                    className="capitalize"
                  >
                    {type} button
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl mb-2">Typography</h2>

          <div className="bg-gray-300 p-4">
            <h1 className="text-4xl mb-4">Heading level 1</h1>
            <h2 className="text-2xl mb-2">Heading level 2</h2>
            <h3 className="text-xl mb-1">Heading level 3</h3>
            <h4 className="font-bold mb-1">Heading level 4</h4>

            <p>Normal paragraph text.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
