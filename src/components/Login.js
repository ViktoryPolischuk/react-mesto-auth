import { useState } from "react";

function Login({isLoading, onLogin}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleEmailChange(e) {
    setEmail(e.target.value)
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault();

    onLogin({email, password});
  }

  return (
    <main>
      <div
        className="auth auth_login">
          <h1 className="auth__title">Вход</h1>
          <form className="auth__form" noValidate onSubmit={handleSubmit}>
          <label className="auth__field">
          <input className="auth__input auth__input_type_email" type="email"
            id="email" name="email" placeholder="Email" minLength="2"
            maxLength="30" required value={email} onChange={handleEmailChange} />
          <span className="auth__input-error email-error"></span>
        </label>
        <label className="auth__field">
          <input className="auth__input auth__input_type_password" type="password"
            id="password" name="password" placeholder="Пароль" required
            value={password} onChange={handlePasswordChange} />
          <span className="auth__input-error password-error"></span>
        </label>
            <button className="auth__submit-button" type="submit">
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
          </form>
      </div>
    </main>
  )
}

export default Login;
