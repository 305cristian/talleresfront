const {REACT_APP_DIREC}=process.env
window.addEventListener("popstate", function (event) {
    window.location.assign(`${REACT_APP_DIREC}/home`);
});
