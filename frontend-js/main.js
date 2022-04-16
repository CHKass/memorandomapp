import Search from './modules/search'
import Chat from './modules/chat'
import RegistrationForm from './modules/registrationForm'
import Help from './modules/formatHelp'


if (document.querySelector(".format-help")) {
	new Help()
}

if (document.querySelector("#registration-form")) {
	new RegistrationForm()
}

if (document.querySelector("#chat-wrapper")) {
	new Chat()
}

if (document.querySelector(".header-search-icon")) {new Search()}