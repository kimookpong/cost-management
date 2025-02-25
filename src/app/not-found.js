export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center  py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-500 to-purple-500 dark:from-gray-900 dark:to-black transition-all">
      <h1 className="text-6xl font-extrabold text-white">404</h1>
      <p className="mt-4 text-2xl font-medium text-gray-100">
        อุปส์! ไม่พบหน้าที่คุณต้องการ
      </p>
      <a
        href="/"
        className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
      >
        กลับไปหน้าหลัก
      </a>
    </div>
  );
}
