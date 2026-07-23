export default function HomePage() {
  return (
    <main className="max-w-5xl mx-auto p-8">
      <section className="text-center py-10">
        <h1 className="text-5xl font-bold">
          J. R. Black Ministries
        </h1>

        <p className="text-xl text-gray-400 mt-4">
          Building Lives on the Word of God
        </p>

        <p className="mt-6 text-lg">
          Welcome to the J. R. Black Ministries Document Library.
        </p>
      </section>

      <section className="border rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Search the Ministry Library
        </h2>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search sermons, lessons, scriptures, or topics..."
            className="flex-1 rounded border px-4 py-2 text-black"
          />

          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white">
            Search
          </button>
        </div>
      </section>

      <section className="border rounded-lg p-6">
        <h2 className="text-2xl font-semibold">
          Featured Message
        </h2>

        <h3 className="text-3xl font-bold mt-4">
          Philippians 4:11-13
        </h3>

        <p className="mt-3 text-lg">
          Learning Contentment in Every Season
        </p>

        <button className="mt-6 bg-green-600 hover:bg-green-700 px-5 py-2 rounded text-white">
          Read More
        </button>
      </section>
    </main>
  );
}