type DocumentCardProps = {
  document: {
    title: string;
    subtitle: string;
    category: string;
    scripture: string;
    summary: string;
  };
};

export default function DocumentCard({ document }: DocumentCardProps) {
  return (
    <article className="border rounded-lg p-6">
      <p className="text-sm text-gray-400">{document.category}</p>

      <h2 className="text-2xl font-bold mt-2">{document.title}</h2>

      <p className="text-lg mt-1">{document.subtitle}</p>

      <p className="text-sm text-gray-400 mt-2">
        Scripture: {document.scripture}
      </p>

      <p className="mt-4">{document.summary}</p>

      <button className="mt-5 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded text-white">
        Read More
      </button>
    </article>
  );
}