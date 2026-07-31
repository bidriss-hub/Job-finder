require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;


app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));



// BACKUP JOB DATABASE
// Used when API has no results

const backupJobs = [

{
id:"rw1",
title:"Software Developer",
company:"Kigali Tech Hub",
location:"Kigali, Rwanda",
category:"Technology",
salary_min:900000,
salary_max:1800000,
description:"Develop websites, applications and maintain software systems.",
url:"#"
},

{
id:"ke1",
title:"Data Analyst",
company:"Nairobi Digital Solutions",
location:"Nairobi, Kenya",
category:"Technology",
salary_min:1200000,
salary_max:2200000,
description:"Analyse business data and create reports.",
url:"#"
},

{
id:"uk1",
title:"Frontend Developer",
company:"London Web Studio",
location:"London, UK",
category:"Technology",
salary_min:3500000,
salary_max:6000000,
description:"Build modern websites using HTML, CSS and JavaScript.",
url:"#"
},

{
id:"fr1",
title:"Marketing Specialist",
company:"Paris Media Group",
location:"Paris, France",
category:"Marketing",
salary_min:3000000,
salary_max:5000000,
description:"Create marketing campaigns and manage customers.",
url:"#"
},

{
id:"de1",
title:"Mechanical Engineer",
company:"Berlin Engineering GmbH",
location:"Berlin, Germany",
category:"Engineering",
salary_min:4000000,
salary_max:7000000,
description:"Design engineering solutions and improve systems.",
url:"#"
},

{
id:"us1",
title:"Registered Nurse",
company:"New York Health Center",
location:"New York, USA",
category:"Healthcare",
salary_min:5000000,
salary_max:8000000,
description:"Provide professional healthcare services.",
url:"#"
},

{
id:"ca1",
title:"Cloud Engineer",
company:"Toronto Cloud Labs",
location:"Toronto, Canada",
category:"Technology",
salary_min:6000000,
salary_max:9000000,
description:"Manage cloud systems and infrastructure.",
url:"#"
},

{
id:"ae1",
title:"UX Designer",
company:"Dubai Creative Studio",
location:"Dubai, UAE",
category:"Design",
salary_min:7000000,
salary_max:11000000,
description:"Design user-friendly digital experiences.",
url:"#"
}

];





function getCountry(location){

    const text = location.toLowerCase();


    if(text.includes("usa") || text.includes("new york")){
        return "us";
    }


    if(text.includes("canada") || text.includes("toronto")){
        return "ca";
    }


    if(text.includes("germany") || text.includes("berlin")){
        return "de";
    }


    if(text.includes("france") || text.includes("paris")){
        return "fr";
    }


    if(text.includes("australia") || text.includes("sydney")){
        return "au";
    }


    if(text.includes("uk") || text.includes("london")){
        return "gb";
    }


    return "gb";

}






app.get("/api/jobs", async(req,res)=>{


try{


const keyword =
req.query.q || "developer";


const location =
req.query.where || "London";



let jobs = [];




// TRY ADZUNA FIRST

try{


const country =
getCountry(location);



const url =
new URL(

`https://api.adzuna.com/v1/api/jobs/${country}/search/1`

);



url.searchParams.set(
"app_id",
ADZUNA_APP_ID
);


url.searchParams.set(
"app_key",
ADZUNA_APP_KEY
);


url.searchParams.set(
"results_per_page",
"20"
);


url.searchParams.set(
"what",
keyword
);


url.searchParams.set(
"where",
location
);



const response =
await fetch(url);



if(response.ok){


const data =
await response.json();



jobs =
(data.results || []).map(job=>({


id:job.id,

title:job.title,

company:
job.company?.display_name ||
"Company",


location:
job.location?.display_name ||
location,


category:
job.category?.label ||
"General",


description:
job.description ||
"No description available",


salary_min:
job.salary_min ||
null,


salary_max:
job.salary_max ||
null,


url:
job.redirect_url


}));


}



}

catch(error){

console.log(
"API failed, using backup jobs"
);

}





// FALLBACK JOBS

if(jobs.length === 0){


jobs =
backupJobs.filter(job=>


job.location
.toLowerCase()
.includes(location.toLowerCase())


||

location
.toLowerCase()
.includes(
job.location.split(",")[1]
?.trim()
.toLowerCase()
)



);



}





// IF STILL EMPTY SHOW ALL JOBS

if(jobs.length === 0){

jobs = backupJobs;

}





res.json({

count:jobs.length,

jobs:jobs

});



}


catch(error){


console.log(error);


res.status(500).json({

error:"Server error"

});


}


});







app.get("*",(req,res)=>{


res.sendFile(

path.join(
__dirname,
"public",
"index.html"
)

);


});






app.listen(PORT,()=>{


console.log(
`JobFinder Global running on http://localhost:${PORT}`
);


});