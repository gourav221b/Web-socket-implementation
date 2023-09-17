// Connect to socket server 
const socket = io('https://dukh-dard-peedha.adaptable.app/');


// check for logged in user
window.addEventListener("load", () => {
    if (!window.sessionStorage.getItem("loginName"))
        window.location.replace('login.html')
})

// Form submit handler
const addForm = document.getElementById('addForm');
addForm?.addEventListener('submit', handleSubmit);
// submit data to server
function handleSubmit(e) {
    e.preventDefault();

    const text = document.getElementById('rantText').value;

    fetch(`https://dukh-dard-peedha.adaptable.app/data`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: window.sessionStorage.getItem("loginName"), text })
    });

    document.getElementById('rantText').value = '';

}

let allRes;
// fetch all data

function fetchAllData() {

    fetch("https://dukh-dard-peedha.adaptable.app/data").then(res => res.json())
        .then(data => {
            console.log(data)
            data?.map(item => {
                let tempElem = document.createElement("div");
                tempElem.setAttribute("class", `rounded-lg overflow-hidden shadow-lg card w-full lg:w-2/5 min-h-60 flex flex-col items-start justify-around mx-auto "`)

                let tempElemChild = document.createElement("div");
                tempElemChild.setAttribute("class", "px-6 py-4")

                let tempText = document.createElement("div")
                tempText.setAttribute("class", "font-bold text-2xl mb-2 randomMessage")
                tempText.textContent = item?.text

                let tempName = document.createElement("p")
                tempName.setAttribute("class", "font-semibold text-lg mb-2 randomMessage")
                tempName.textContent = item?.user || "Unknown"

                tempElemChild.appendChild(tempText)
                tempElemChild.appendChild(tempName)
                tempElem.appendChild(tempElemChild)

                document.getElementById("allRantList").appendChild(tempElem)


            })

        }).catch(err => document.getElementById("messageSection").textContent = err)




}
function fetchSingle() {
    fetch('https://dukh-dard-peedha.adaptable.app/random').then(res => res.json()).then(data => console.log(data)).catch(err => console.log(err))
}


function throwReaction(type) {
    socket.emit("reaction", { name: window.sessionStorage.getItem('loginName'), type })
}

function generateRandomPoints() {
    return [Math.random() * ((window.innerWidth - 20) - 20) + 20, Math.random() * (window.innerHeight - 10) + 10]


}
function handleNewMessage() {
    socket.emit("sendNewMessage", "Requested by " + window.sessionStorage.getItem("loginName"))
}