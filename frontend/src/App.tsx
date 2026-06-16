import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { AuthorDetailPage } from "./pages/AuthorDetailPage";
import { AuthorsPage } from "./pages/AuthorsPage";
import { BookDetailPage } from "./pages/BookDetailPage";
import { BooksPage } from "./pages/BooksPage";
import { LandingPage } from "./pages/LandingPage";
import { LocationsPage } from "./pages/LocationsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="books" element={<BooksPage />} />
          <Route path="books/:bookId" element={<BookDetailPage />} />
          <Route path="authors" element={<AuthorsPage />} />
          <Route path="authors/:authorId" element={<AuthorDetailPage />} />
          <Route path="locations" element={<LocationsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
