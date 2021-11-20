import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Cookies from "js-cookie";

/*document.addEventListener("astilectron-ready", function() {
    astilectron.sendMessage({event: "getCard", data: 4022201}, function(message) {
        console.log(message);
    });
});*/

var preferredTheme = Cookies.get("theme");
if(preferredTheme)
    Cookies.set("theme", preferredTheme, { expires: 365 });

if(preferredTheme == "dark" || 
    preferredTheme != "light" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
    document.body.classList.add("dark");

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
    if(Cookies.get("theme"))
        return;

    if(e.matches)
        document.body.classList.add("dark");
    else
        document.body.classList.remove("dark");
});

createApp(App).use(router).mount('#app')
