"use client";

export default function AdminDashboard() {


  return (
    <div className="space-y-4 sm:space-y-6">


      {/* Hello World Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Hello World! 👋
          </h2>
          <p className="mt-3 text-base text-gray-600 dark:text-gray-400 sm:mt-4 sm:text-lg">
            Tu dashboard está listo para usar. Comienza a personalizar tu experiencia.
          </p>
          <div className="mt-4 flex flex-col justify-center gap-3 sm:mt-6 sm:flex-row sm:gap-4">
            <button className="w-full rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto sm:text-base">
              Comenzar
            </button>
            <button className="w-full rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 sm:w-auto sm:text-base">
              Explorar
            </button>
          </div>
        </div>
      </div>


    </div>
  );
}
