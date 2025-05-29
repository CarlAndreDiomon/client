import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2, FileUp, Book, Layers, FileText } from "lucide-react";
import { toast } from "react-hot-toast";

const UploadPage = () => {
  const [formData, setFormData] = useState({
    file: null,
    filename: "",
    subject: "",
    gradeLevel: "",
  });
  const { uploadFile, isUploadingFile } = useAuthStore(); // Correctly get isUploadingFile from store

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData((prev) => ({ ...prev, file: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      toast.error("Please select a PDF file to upload.");
      return;
    }
    if (formData.file.type !== "application/pdf") {
      toast.error("Invalid file type. Please upload a PDF.");
      return;
    }
    if (!formData.filename.trim()) {
      toast.error("Please enter a filename.");
      return;
    }
    if (!formData.subject.trim()) {
      toast.error("Please enter a subject.");
      return;
    }
    if (!formData.gradeLevel) {
      toast.error("Please select a grade level.");
      return;
    }

    // setIsUploading(true); // This state is now managed by the store
    const data = new FormData();
    data.append("file", formData.file);
    data.append("filename", formData.filename);
    data.append("subject", formData.subject);
    data.append("gradeLevel", formData.gradeLevel);
    // Call uploadFile from useAuthStore (implement this in useAuthStore.js)
    await uploadFile(data);
    // setIsUploading(false); // This state is now managed by the store
    // Reset form if needed
    setFormData({
      file: null,
      filename: "",
      subject: "",
      gradeLevel: "",
    });
    // Clear file input
    if (document.querySelector('input[type="file"]')) {
      document.querySelector('input[type="file"]').value = "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-gray-100">
      <div className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-xl shadow-xl">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <FileUp className="w-7 h-7 text-black" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mt-2">Upload PDF</h1>
            <p className="text-gray-600 text-sm sm:text-base">Share your educational resources</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-gray-700">PDF File</span>
            </label>
            <input
              type="file"
              name="file"
              accept="application/pdf"
              className="file-input file-input-bordered w-full text-sm sm:text-base"
              onChange={handleChange}
              // `required` is good, but we also have manual checks
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-gray-700">Filename</span>
            </label>
            <div className="relative">
              <FileText className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="filename"
                className="input input-bordered w-full pl-10 pr-3 py-2 text-sm sm:text-base"
                placeholder="Enter filename (e.g., Math_Chapter1.pdf)"
                value={formData.filename}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-gray-700">Subject</span>
            </label>
            <div className="relative">
              <Book className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="subject"
                className="input input-bordered w-full pl-10 pr-3 py-2 text-sm sm:text-base"
                placeholder="Enter subject (e.g., Mathematics)"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-gray-700">Grade Level</span>
            </label>
            <div className="relative">
              <Layers className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10 h-5 w-5 text-gray-400" />
              <select
                name="gradeLevel"
                className="select select-bordered w-full pl-10 text-sm sm:text-base"
                value={formData.gradeLevel}
                onChange={handleChange}
              >
                <option value="" disabled>Select grade level</option>
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-black w-full text-sm sm:text-base py-2.5" disabled={isUploadingFile}>
            {isUploadingFile ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              "Upload File"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
