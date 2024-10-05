const filter = (text, counter=0) => (text.replace(/(\*\*)/g, _ => ((++counter)&1 ? "<strong>" : "</strong>"))).replace(/(\*)/g, "<br>");

if (document.getElementById("chats").value != "" && document.getElementById("chats").value != null) {
    let n = JSON.parse(document.getElementById("chats").value);
    let addition = "";
    if (n.length > 0 && n != []) {
        n.forEach(x => {
            addition += "<div class='message "+(x.role == "user" ? "user" : "system")+"-message'>"+filter(x.parts[0].text)+"</div>";
        });
        document.getElementById("chat-prev").innerHTML = addition;
    }
}