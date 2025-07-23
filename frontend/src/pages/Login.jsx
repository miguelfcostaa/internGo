import React from "react";
 
function login () {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-b from-orange-200 to-blue-600 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 z-0"
        src={{ backgroundImage: `url('/assets/logo.jpg')` }}
      ></div>
 
    <div className="relative z-10 bg-white p-10 rounded-lg shadow-lg max-w-md w-full">
      <h1 className="text-3xl font-bold mb-2">Entrar</h1>
      <p className="text-sm mb-6">
        És novo aqui?{' '}
        <a href="#" className="text-blue-500 hover:underline">
          Cria uma conta
        </a>
      </p>
      <form className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Palavra-passe</label>
            <input
              type="password"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
 
          <div className="flex items-center">
            <input type="checkbox" id="remember" className="mr-2" />
            <label htmlFor="remember" className="text-sm font-medium">
              Mantêm-me logado
            </label>
          </div>
 
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900"
          >
            Entrar
          </button>
        </form>
 
        <div className="mt-4 text-center">
          <a href="#" className="text-xs text-blue-500 hover:underline">
            Esqueceu a palavra-passe?
          </a>
        </div>
      </div>
    </div>
  );
};
 
export default login;