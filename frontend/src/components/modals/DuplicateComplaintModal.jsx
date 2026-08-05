function DuplicateComplaintModal({
  isOpen,
  duplicates,
  onClose,
  onSupport,
  onReportAnyway,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-8">

        <h2 className="text-2xl font-bold mb-2">
          ⚠️ Similar Complaint Found
        </h2>

        <p className="text-gray-500 mb-6">
          We found complaints near your location.
        </p>

        <div className="space-y-5">

          {duplicates.map((issue) => (

            <div
  key={issue._id}
  className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
>

              <h3 className="font-bold text-lg">
                {issue.title}
              </h3>
              <div className="flex gap-2 mt-2 flex-wrap">

  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
    {issue.category}
  </span>

  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
    {issue.status}
  </span>

</div>

              <p className="text-gray-600 mt-2">
                {issue.summary}
              </p>

              <div className="flex gap-5 mt-3">

                <span>
                  ❤️ {issue.supportCount} supporters
                </span>

                <span>
                  {issue.category}
                </span>

              </div>
             {issue.imageUrl && (
  <img
    src={issue.imageUrl}
    alt={issue.title}
    className="rounded-xl mt-4 w-full h-48 object-cover"
  />
)}
              <button
                onClick={() => onSupport(issue._id)}
                className="mt-4 w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl"
              >
                ❤️ Support Existing Complaint
              </button>

            </div>

          ))}

        </div>

        <button
          onClick={onReportAnyway}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
        >
          📤 Report Anyway
        </button>

        <button
          onClick={onClose}
          className="mt-3 w-full border py-3 rounded-xl"
        >
          Cancel
        </button>

      </div>

    </div>
  );
}

export default DuplicateComplaintModal;