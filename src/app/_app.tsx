import { Provider } from 'react-redux';
import { persistor, store } from '@/src/shared/store/store';
import './globals.css';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from '@/src/components/ToastContainer';

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ToastContainer />
       <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
