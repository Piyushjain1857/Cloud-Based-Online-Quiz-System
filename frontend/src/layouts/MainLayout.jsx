import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/layout.css';

const MainLayout = () => {
  return (
    <div className="layout-root">
      <Sidebar />
      <div className="main-wrapper">
        <Header />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
