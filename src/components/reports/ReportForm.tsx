interface ReportFormProps {
  content?: any[];
}

const ReportForm: React.FC<ReportFormProps> = ({ content = [] }) => {
  return (
    <div className="m-5 p-5 flex flex-col gap-3">
      <h2 className="text-lg font-semibold mb-3">Report Form</h2>
      {content.length > 0 ? (
        content.map((item, idx) => (
          <div
            key={idx}
            className="p-2 border rounded-md bg-gray-50 text-gray-700"
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

export default ReportForm;
