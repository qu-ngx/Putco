import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="min-h-screen bg-text-light relative flex flex-col">
      <div className="hidden lg:block absolute top-32 left-0 w-full text-center">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-7xl tracking-tight font-koulen text-navbar">
            -WELCOME TO PUTCO-
          </h1>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;