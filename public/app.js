const form = document.getElementById("search-form");

const resultsEl = document.getElementById("results");

const statusEl = document.getElementById("status");

const paginationEl = document.getElementById("pagination");

const searchBtn = document.getElementById("search-btn");


let currentPage = 1;

let totalJobs = 0;


const RESULTS_PER_PAGE = 20;



function escapeHtml(value){

const div=document.createElement("div");

div.textContent=value || "";

return div.innerHTML;

}






function getCurrency(location){


const text =
(location || "").toLowerCase();



if(
text.includes("kigali") ||
text.includes("rwanda")
){

return "RWF";

}



if(
text.includes("dubai") ||
text.includes("uae")
){

return "AED";

}



if(
text.includes("usa") ||
text.includes("new york")
){

return "USD";

}



if(
text.includes("europe") ||
text.includes("uk") ||
text.includes("london") ||
text.includes("paris")
){

return "GBP";

}



return "GBP";


}








function formatSalary(min,max,location){


const currency =
getCurrency(location);



if(!min && !max){

return "Salary not provided";

}



const amount =
Math.round(min || max);



if(currency==="RWF"){

return `RWF ${(
amount * 1600
).toLocaleString()}`;

}



if(currency==="AED"){

return `AED ${(
amount * 4.6
).toLocaleString()}`;

}



if(currency==="USD"){

return `$${amount.toLocaleString()}`;

}



return `£${amount.toLocaleString()}`;

}







function formatDate(date){


if(!date){

return "Unknown date";

}


return new Date(date).toLocaleDateString();


}








function createJobCard(job){



const card =
document.createElement("article");



card.className="job-card";



card.innerHTML=`


<h3>${escapeHtml(job.title)}</h3>


<p>
🏢 ${escapeHtml(job.company)}
</p>


<p>
📍 ${escapeHtml(job.location)}
</p>


<p>
💼 ${escapeHtml(job.category)}
</p>


<p>
💰 ${formatSalary(
job.salary_min,
job.salary_max,
job.location
)}
</p>


<p>
📅 ${formatDate(job.created)}
</p>


<p class="description">

${escapeHtml(
(job.description || "")
.substring(0,300)
)}

</p>



<a href="${escapeHtml(job.url)}"
target="_blank">

View & Apply

</a>


`;



return card;


}








function setStatus(message,error=false){


statusEl.textContent=message;


statusEl.className =
error ? "error" : "";


}







function getValues(){


return {


q:
document.getElementById("q").value.trim(),


where:
document.getElementById("where").value.trim(),


category:
document.getElementById("category").value,


sort:
document.getElementById("sort").value


};


}









async function searchJobs(event,page=1){


if(event){

event.preventDefault();

}



currentPage=page;



const data=getValues();



resultsEl.innerHTML="";

paginationEl.innerHTML="";



setStatus(
"Searching global jobs..."
);



searchBtn.disabled=true;



searchBtn.textContent="Searching...";





try{


const params=new URLSearchParams({

q:data.q,

where:data.where,

category:data.category,

sort:data.sort,

page

});





const response =
await fetch(
`/api/jobs?${params}`
);





const result =
await response.json();






if(!response.ok){


setStatus(
result.error ||
"Unable to search jobs",
true
);


return;


}






if(!result.jobs || result.jobs.length===0){


resultsEl.innerHTML=`

<div class="empty-state">

<h3>No jobs found</h3>

<p>
Try another keyword or location.
</p>

<p>
Examples:
Kigali, Nairobi, Dubai, London, Paris
</p>

</div>

`;

return;


}






totalJobs=result.count;



setStatus(

`${result.jobs.length} jobs found worldwide`

);







result.jobs.forEach(job=>{


resultsEl.appendChild(
createJobCard(job)
);


});



renderPagination();



}

catch(error){


console.log(error);


setStatus(
"Connection error",
true
);


}

finally{


searchBtn.disabled=false;


searchBtn.textContent="Search Jobs";


}


}









function renderPagination(){


paginationEl.innerHTML="";



if(totalJobs<=RESULTS_PER_PAGE){

return;

}



const pages=
Math.ceil(
totalJobs/RESULTS_PER_PAGE
);





const next=document.createElement("button");


next.textContent="Next →";


next.onclick=()=>{

searchJobs(null,currentPage+1);

};


paginationEl.appendChild(next);


}









form.addEventListener(
"submit",
searchJobs
);






document
.querySelectorAll(".location-btn")
.forEach(button=>{


button.addEventListener(
"click",
()=>{


document.getElementById("where").value =
button.dataset.location;



if(
!document.getElementById("q").value
){


document.getElementById("q").value =
"software developer";


}



searchJobs(null,1);


});


});







setStatus(
"Search jobs worldwide or choose a location."
);