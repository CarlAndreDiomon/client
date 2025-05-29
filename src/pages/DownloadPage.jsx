import React, { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const DownloadPage = () => {
  const {
    modules,
    fetchModules,
    isLoadingModules,
    downloadModuleById,
    isDownloadingModule,
  } = useAuthStore();

  useEffect(() => {
    // Fetch modules when the component mounts
    fetchModules();
  }, [fetchModules]);

  const handleDownload = async (moduleId, moduleName) => {
    if (isDownloadingModule) {
      toast.error('Another download is already in progress.');
      return;
    }
    // You will need to replace 'YOUR_BACKEND_API_URL_HERE' in useAuthStore.js
    // with your actual backend URL for this to work.
    await downloadModuleById(moduleId, moduleName);
  };

  if (isLoadingModules) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Download Modules</h1>
      {modules && modules.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {modules.map((module) => (
            <div key={module.id} className="card bg-base-100 shadow-xl">
              <div className="card-body p-4 sm:p-6">
                <h2 className="card-title text-lg sm:text-xl">{module.name || 'Unnamed Module'}</h2>
                <p className="text-sm sm:text-base">{module.description || 'No description available.'}</p>
                <p className="text-xs sm:text-sm text-gray-500">ID: {module.id}</p>
                <div className="card-actions justify-end mt-4">
                  <button
                    className={`btn btn-primary btn-sm sm:btn-md ${isDownloadingModule ? 'btn-disabled' : ''}`}
                    onClick={() => handleDownload(module.id, module.name || `module_${module.id}`)}
                    disabled={isDownloadingModule}
                  >
                    {isDownloadingModule ? (
                      <>
                        <span className="loading loading-spinner loading-xs sm:loading-sm"></span>
                        Downloading...
                      </>
                    ) : (
                      'Download'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 px-4">
          <p className="text-lg sm:text-xl text-gray-500">No modules available for download.</p>
          <p className="text-sm sm:text-md text-gray-400 mt-2">Please check back later.</p>
        </div>
      )}
    </div>
  );
};

export default DownloadPage;
