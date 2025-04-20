export default function Page() {
  return (
    <div className="flex justify-center ">
      <div className="container px-4 py-8 flex flex-col gap-8">
        <div className="border-b">
          <h1 className="text-4xl mb-4">iNZight Analytics Brand</h1>
        </div>

        <div className="">
          <h2 className="text-2xl mb-2">Colours</h2>
          <div className="h-32 flex gap-4 bg-gray-300 p-4">
            <div className="w-3/5 bg-black"></div>
            <div className="w-3/10 bg-white"></div>
            <div className="w-1/10 bg-red-600"></div>
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
