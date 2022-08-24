
/**
 * reset rem
 */
function setRem() {
    const html = document.getElementsByTagName('html')[0];
    const oWidth = document.body.clientWidth || document.documentElement.clientWidth;
    const UIWidth = 1920;
    html.style.fontSize = oWidth / UIWidth * 100 + 'px';
}

const appElement = document.getElementById("root");
appElement.style.width = `${window.innerWidth}px`;
appElement.style.height = `${window.innerHeight}px`;

window.addEventListener('resize', (e) => {
    appElement.style.width = `${window.innerWidth}px`;
    appElement.style.height = `${window.innerHeight}px`;

    setRem();
})

document.onreadystatechange = ((e) => {
    setRem();
})


