(()=>{const e=[];function t(e,t,n,o,a){this.title=e,this.author=t,this.hasRead=n,this.starRating=o,this.showOtherBooks=a}function n(e){e.forEach(((t,n)=>{if(n===e.length-1){const e=document.querySelector(".books-container"),o=document.createElement("div");o.dataset.id=n,t.hasRead?o.className="read-book-div":o.className="unread-book-div",o.innerHTML=`<h3 class = 'book-title'>${t.title}</h3>\n                          <h3 class ="book-author">${t.author}</h3>\n                          ${t.starRating?`<div class="stars">${t.starRating}</div>`:'<button class="mark-as-read">Mark As Read and Add Rating</button>'}</span>\n                          <button class='delete'><img src="trashcan.png"/></button>\n                          <button class='edit'><img src="edit.png"/></button>\n                          <button class='more-books'>More Books by ${t.author}</button>`,e.appendChild(o)}!function(e){document.querySelectorAll(".delete").forEach((function(t){t.addEventListener("click",(function(){r(e)}))}))}(n),document.querySelectorAll(".more-books").forEach((e=>e.addEventListener("click",(()=>getBooksByAuthor().then((e=>function(e){const t=document.querySelector(".overlay"),n=document.getElementById("text-overlay");if(document.getElementById("remove-overlay").addEventListener("click",(()=>t.style.display="none")),0===e.results.length)return void alert("Cannot find author in database, check spelling and try again");t.style.display="block",console.log(e.results);const o=e.results.reduce(((e,t)=>(e.some((e=>e.book_title===t.book_title))||e.push(t),e)),[]).map((e=>(""===e.summary&&(e.summary="No Summary Available"),e))).map((e=>`<div class='more-by-author'><h3>${e.book_title}</h3><p>${e.summary}</p><a href =${e.url}>More Here</a></div>`));n.innerHTML=o.join("<hr/>"),console.log(n)}(e))))))),document.querySelectorAll(".edit").forEach((function(e){e.addEventListener("click",(function(){!function(){const e=event.target.parentNode.parentNode.dataset.id,t=event.target.parentNode.parentNode.children[0],n=event.target.parentNode.parentNode.children[1],o=t.innerHTML,a=n.innerHTML;u.value=o,m.value=a,r(e),editAuthorListener(n)}()}))}))}))}function o(t){e.push(t)}function a(){if("Yes"===c.value)d.style.display="block";else for(c.value,d.style.display="none",i=0;i<l.length;i++)l[i].classList.remove("select")}function s(e){let t=e.toLowerCase().split(" ");for(var n=0;n<t.length;n++)t[n]=t[n].charAt(0).toUpperCase()+t[n].substring(1);return t.join(" ")}function r(t){const n=event.target.parentNode.parentNode;e.splice(t,1),n.remove(n)}getBooksByAuthor=async()=>{console.log("clicked");const t=e[event.target.parentNode.dataset.id].author;console.log(t);const n=t.split(" ").join("+"),o=await fetch(`https://api.nytimes.com/svc/books/v3/reviews.json?author=${n}&api-key=fsaJyExrkFogrVr0yM5V1nH6ke9YfUwY`,{mode:"cors"});return await o.json()};let l=document.querySelectorAll(".selected");const c=document.getElementById("read"),d=document.querySelector(".Rating"),u=document.getElementById("title"),m=document.getElementById("author"),h=document.getElementById("read"),g=document.getElementById("submit");o(new t("My Brilliant Friend","Elena Ferrante",!0,"★ ★ ★ ★ ★","","","")),document.addEventListener("click",(function(e){let t=e.target.getAttribute("data-star");if(e.target.matches(".selected"))for(e.preventDefault(),i=0;i<l.length;i++)i<t?l[i].classList.add("select"):l[i].classList.remove("select")}),!1),document.addEventListener("mouseover",(function(e){if(e.target.matches(".selected")){e.preventDefault();let t=e.target.getAttribute("data-star");for(i=0;i<l.length;i++)i<t?l[i].classList.add("select"):l[i].classList.remove("select")}}),!1),g.addEventListener("click",(()=>{!function(){if(event.preventDefault(),""==u.value||""==m.value)alert("Please fill in all fields");else{let a=document.getElementById("rate").getElementsByClassName("select").length,r="★ ".repeat(a),l=new t(s(u.value),s(m.value),h.value,starRating=r,showOtherBooks="");document.getElementById("read").value,o(l),n(e),document.getElementById("bookInfo").reset()}}(),a()})),c.addEventListener("change",(()=>{a()})),n(e)})();