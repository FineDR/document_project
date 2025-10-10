interface PreviewPageProps {
  content?: any[];
}

const PreviewPage: React.FC<PreviewPageProps> = ({ content = [] }) => {
  return (
    <div className="m-5 p-5 flex flex-col gap-3">
      <h2 className="text-lg font-semibold mb-3">Preview Page</h2>
      {content.length > 0 ? (
        content.map((item, idx) => (
          <div
            key={idx}
            className="p-2 border rounded-md bg-gray-100 text-gray-800"
          >
            {JSON.stringify(item)}
          </div>
        ))
      ) : (
        <p className="text-gray-400 italic">No content on this page</p>
      )}
    </div>
  );
};

export default PreviewPage;
