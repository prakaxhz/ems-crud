import Navbar from '../components/Navbar';

export default function MainLayout({ children, onAddClick }) {
  return (
    <div className="app-root">
      <Navbar onAddClick={onAddClick} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

