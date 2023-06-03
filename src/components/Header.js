import { Routes, Route, Link } from 'react-router-dom';
import logo from '../images/Vector.svg';

function Header({userEmail, onLogout}) {
  function handleLogoutClick(e) {
    e.preventDefault();
    onLogout();
  }
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип" />
      <nav className="header__nav">
        <Routes>
          <Route path="/sign-up" element={
            <Link className="header__link" to="/sign-in">
              Войти
            </Link>
          } />
          <Route path="/sign-in" element={
            <Link className="header__link" to="/sign-up">
              Регистрация
            </Link>
          } />
          <Route path="/" element={
            <>
              <span className="header__email">{userEmail}</span>
              <a className="header__link header__link_logout" href="#" onClick={handleLogoutClick}>Выйти</a>
            </>
          } />
        </Routes>
      </nav>
    </header>
  )
}

export default Header
