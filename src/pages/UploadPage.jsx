import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2, FileUp, Book, Layers, FileText } from "lucide-react";

const UploadPage = () => {
  const [formData, setFormData] = useState({
    file: null,
    filename: "",
    subject: "",
    gradeLevel: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const { uploadFile } = useAuthStore();

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
    if (!formData.file || formData.file.type !== "application/pdf") {
      alert("Please upload a PDF file only.");
      return;
    }
    setIsUploading(true);
    const data = new FormData();
    data.append("file", formData.file);
    data.append("filename", formData.filename);
    data.append("subject", formData.subject);
    data.append("gradeLevel", formData.gradeLevel);
    // Call uploadFile from useAuthStore (implement this in useAuthStore.js)
    await uploadFile(data);
    setIsUploading(false);
  };

  return (
    <div className="h-screen flex justify-center items-center p-6 bg-gray-100">
      <div className="sm:w-screen md:w-96 lg:w-2/3 xl:w-1/3 shadow-lg shadow-gray-600 bg-white p-6 rounded-lg">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <FileUp className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-2xl font-bold mt-2">Upload PDF</h1>
            <p className="text-base-content/60">Upload your PDF file and details</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">PDF File</span>
            </label>
            <div className="relative">
              <input
                type="file"
                name="file"
                accept="application/pdf"
                className="file-input file-input-bordered w-full"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Filename</span>
            </label>
            <div className="relative">
              <FileText className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10 h-5 w-5 text-base-content/40" />
              <input
                type="text"
                name="filename"
                className="input input-bordered w-full pl-10"
                placeholder="Enter filename"
                value={formData.filename}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Subject</span>
            </label>
            <div className="relative">
              <Book className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10 h-5 w-5 text-base-content/40" />
              <input
                type="text"
                name="subject"
                className="input input-bordered w-full pl-10"
                placeholder="Enter subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Grade Level</span>
            </label>
            <div className="relative">
              <Layers className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10 h-5 w-5 text-base-content/40" />
              <select
                name="gradeLevel"
                className="input input-bordered w-full pl-10"
                value={formData.gradeLevel}
                onChange={handleChange}
                required
              >
                <option value="">Select grade level</option>
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
          <button type="submit" className="btn btn-black w-full" disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
