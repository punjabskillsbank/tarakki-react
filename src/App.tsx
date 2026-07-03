import { RouterProvider } from 'react-router-dom';
import { Router } from './routes/Routes';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={Router} />
    </>
  );
}