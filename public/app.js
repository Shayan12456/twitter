// let inp = document.getElementsByClassName("search");
// let url = "http://localhost:8080/twitter/search/name=";
// let func =  async (req, res)=>{
//     let info = await call(input.value);
//     res.render("post.ejs", info);
// }
// inp.addEventListener("keypress", async (event)=>{
//     if (event.key === "Enter") { // Checking if the pressed key is the Enter key
//         // Call your function here
//         func();
//     }
// });

// async function call(url, value){
//     let info = await axios.get(url + value);
//     console.log(info);
//     return info;
// }

const input = document.querySelector(".search");

let func =  async ()=>{
    let post = await getPost(input.value);

    console.log(post.username);
    return post.username;


};

input.addEventListener("keypress",(event) => {//callback
    if (event.key === "Enter") { // Checking if the pressed key is the Enter key
        // Call your function here
        func();
    }
});
async function getPost(name){
    const url = `http://localhost:8080/twitter/search/username=${name}`;
    try{
        let info = await axios.get(url);
        console.log(info);
        return info;
    }catch{
        console.log("sorry");
    }
}
