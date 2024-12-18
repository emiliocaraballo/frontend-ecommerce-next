'use client';  // Marca este archivo como un componente de cliente

import './globals.css';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { persistor, store } from '../shared/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from '@/src/components/ToastContainer';

const inter = Inter({ subsets: ['latin'] });

// export const metadata = {
//   title: 'Dashboard',
//   description: 'MVP Dashboard con diseño mejorado usando shadcn/ui',
// };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={inter.className}>
      <body className="bg-gray-100 text-gray-900">
      <ToastContainer />
        <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
               {children}
             </PersistGate>
           </Provider>
      </body>
    </html>
  );
}
