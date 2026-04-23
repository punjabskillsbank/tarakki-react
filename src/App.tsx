import { RouterProvider } from 'react-router-dom';
import { Router } from './routes/Routes';

export default function App() {
  return <RouterProvider router={Router} />;
}