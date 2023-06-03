import { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import api from '../utils/api';
import authApi from '../utils/authApi';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import DeleteCardPopup from './DeleteCardPopup';
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from './ProtectedRoute';
import Register from './Register';
import Login from './Login';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { jwtStorageKey } from '../utils/constants';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [deletingCardId, setDeletingCardId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [infoTooltip, setInfoTooltip] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(jwtStorageKey);
    if (token) {
      authApi.checkToken(token)
        .then(({data}) => {
          setUserEmail(data.email);
          navigate('/', {replace: true});
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [])

  useEffect(() => {
    if (userEmail) {
      Promise.all([
        api.getUserInfo(),
        api.getInitialCards()
      ])
        .then(([userInfo, cards]) => {
          setCurrentUser(userInfo);
          setCards(cards);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [userEmail])

  function handleCardLike(cardId, isLiked) {
    api.toggleLike(cardId, isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === cardId ? newCard : c));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(cardId) {
    setDeletingCardId(cardId);
  }

  function handleCardDeleteConfirm(cardId) {
    setIsLoading(true);
    api.deleteCard(cardId)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== cardId));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard({});
    setDeletingCardId('');
    setInfoTooltip({});
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleUpdateUser({name, about}) {
    setIsLoading(true);
    api.editUserInfo({name, about})
      .then((userInfo) => {
        setCurrentUser(userInfo);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateAvatar({avatar}) {
    setIsLoading(true);
    api.editUserAvatar(avatar)
      .then((userInfo) => {
        setCurrentUser(userInfo);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleAddPlaceSubmit({title, source}) {
    setIsLoading(true);
    api.addCard({name: title, link: source})
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleLoginSubmit({email, password}) {
    setIsLoading(true);
    authApi.signIn({email, password})
      .then(({token}) => {
        localStorage.setItem(jwtStorageKey, token);
        setUserEmail(email);
        navigate('/', {replace: true});
      })
      .catch((err) => {
        if (err.includes('401')) {
          setInfoTooltip({
            type: 'fail',
            message: 'Указан неправильный email или пароль'
          });
        } else {
          setInfoTooltip({
            type: 'fail',
            message: 'Что-то пошло не так! Попробуйте ещё раз.'
          });
        }
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleRegisterSubmit({email, password}) {
    setIsLoading(true);
    authApi.signUp({email, password})
      .then(() => {
        setInfoTooltip({
          type: 'success',
          message: 'Вы успешно зарегистрировались!'
        });
        navigate('/sign-in', {replace: true});
      })
      .catch((err) => {
        setInfoTooltip({
          type: 'fail',
          message: 'Что-то пошло не так! Попробуйте ещё раз.'
        });
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleLogout() {
    localStorage.removeItem(jwtStorageKey);
    setUserEmail('');
  }

  return (
    <div className="root">
      <div className="root__content">
        <CurrentUserContext.Provider value={currentUser}>
        <Header userEmail={userEmail} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={(
            <ProtectedRoute isLoggedIn={!!userEmail}>
              <>
                <Main
                  onEditAvatar={handleEditAvatarClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditProfile={handleEditProfileClick}
                  onCardClick={handleCardClick}
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                />
                <Footer />
              </>
            </ProtectedRoute>
          )} />
          <Route path="/sign-up" element={(
            <Register
              isLoading={isLoading}
              onRegister={handleRegisterSubmit}
            />
          )} />
          <Route path="/sign-in" element={(
            <Login
              isLoading={isLoading}
              onLogin={handleLoginSubmit}
            />
          )} />
        </Routes>

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          isLoading={isLoading}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
         />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          isLoading={isLoading}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          isLoading={isLoading}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <DeleteCardPopup
          cardId={deletingCardId}
          isLoading={isLoading}
          onClose={closeAllPopups}
          onCardDelete={handleCardDeleteConfirm}
        />

        <ImagePopup {...selectedCard} onClose={closeAllPopups} />
        <InfoTooltip {...infoTooltip} onClose={closeAllPopups} />
        </CurrentUserContext.Provider>
      </div>
    </div>
  );
}

export default App;
