export default function Page() {
  return (
    <div className="flex justify-center ">
      <div className="container p-4 flex flex-col gap-8">
        <div className="border-b">
          <h1 className="text-xl">iNZight Analytics Brand</h1>
        </div>

        <h2 className="text-lg">Colours</h2>
        <div className="h-32 flex gap-4 bg-gray-300 p-4">
          <div className="w-3/5 bg-black"></div>
          <div className="w-3/10 bg-white"></div>
          <div className="w-1/10 bg-red-600"></div>
        </div>
      </div>
    </div>
  );
}
