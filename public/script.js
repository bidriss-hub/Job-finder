const form =
document.getElementById("search-form") ||
document.getElementById("jobForm");

const results =
document.getElementById("results");

const status =
document.getElementById("status");

const savedJobsContainer =
document.getElementById("saved-jobs");


let savedJobs =
JSON.parse(localStorage.getItem("savedJobs")) || [];


 
// SEARCH JOBS

async function searchJobs(){

    const keyword =
    document.getElementById("q").value.trim();


    const where =
    document.getElementById("where").value.trim();


    const category =
    document.getElementById("category").value;


    const sort =
    document.getElementById("sort").value;



    status.textContent =
    "Searching global jobs...";


    results.innerHTML = "";



    try{


        const response =
        await fetch(
        `/api/jobs?q=${encodeURIComponent(keyword)}&where=${encodeURIComponent(where)}&category=${encodeURIComponent(category)}&sort=${sort}`
        );



        const data =
        await response.json();



        if(!response.ok){

            throw new Error(
                data.error || "Unable to fetch jobs."
            );

        }



        if(!data.jobs || data.jobs.length === 0){


            status.textContent =
            "No jobs found.";



            results.innerHTML = `

            <div class="no-results">

                <h3>No jobs found</h3>

                <p>
                Try another keyword or location.
                </p>

            </div>

            `;


            return;

        }



        status.textContent =
        `${data.jobs.length} jobs found`;



        displayJobs(data.jobs);



    }


    catch(error){


        status.textContent =
        "Error loading jobs";


        results.innerHTML = `

        <div class="no-results">

            <h3>Unable to load jobs</h3>

            <p>
            ${error.message}
            </p>

        </div>

        `;


    }


}





// DISPLAY JOBS

function displayJobs(jobs){


    results.innerHTML = "";



    jobs.forEach(job=>{


        const card =
        document.createElement("div");



        card.className =
        "job-card";



        const salary =

        job.salary_min

        ?

        `${Number(job.salary_min).toLocaleString()} - ${Number(job.salary_max || job.salary_min).toLocaleString()} RWF`

        :

        "Salary not provided";




        card.innerHTML = `


        <h3>
        ${job.title || "Job opportunity"}
        </h3>


        <p>
        <strong>Company:</strong>
        ${job.company || "Unknown company"}
        </p>



        <p>
        <strong>Location:</strong>
        ${job.location || "Unknown location"}
        </p>



        <p>
        <strong>Category:</strong>
        ${job.category || "General"}
        </p>



        <p class="salary">

        ${salary}

        </p>



        <p>

        ${(job.description || "No description available").substring(0,180)}

        ...

        </p>



        <div class="job-actions">


        <a

        href="${job.url || "#"}"

        target="_blank"

        class="apply-btn">

        Apply

        </a>



        <button class="save-btn">

        Save

        </button>


        </div>


        `;



        card
        .querySelector(".save-btn")
        .addEventListener(
        "click",
        ()=>saveJob(job)
        );



        results.appendChild(card);



    });


}





// SAVE JOBS

function saveJob(job){


    const exists =
    savedJobs.some(
    saved=>saved.id === job.id
    );



    if(exists){


        alert(
        "Job already saved."
        );


        return;

    }



    savedJobs.push(job);



    localStorage.setItem(

    "savedJobs",

    JSON.stringify(savedJobs)

    );



    displaySavedJobs();



    alert(
    "Job saved successfully!"
    );


}






// DISPLAY SAVED JOBS

function displaySavedJobs(){


    if(!savedJobsContainer)
    return;



    savedJobsContainer.innerHTML = "";



    if(savedJobs.length === 0){


        savedJobsContainer.innerHTML = `

        <p>
        You haven't saved any jobs yet.
        </p>

        `;


        return;

    }



    savedJobs.forEach(job=>{


        const card =
        document.createElement("div");



        card.className =
        "job-card";



        card.innerHTML = `


        <h3>
        ${job.title}
        </h3>


        <p>
        ${job.company}
        </p>


        <p>
        ${job.location}
        </p>


        <a

        href="${job.url || "#"}"

        target="_blank"

        class="apply-btn">

        Apply

        </a>


        `;



        savedJobsContainer.appendChild(card);



    });


}





// SEARCH FORM

if(form){


    form.addEventListener(
    "submit",
    function(e){


        e.preventDefault();


        searchJobs();


    });


}






// LOCATION BUTTONS

document
.querySelectorAll(".location-btn")
.forEach(button=>{


    button.addEventListener(
    "click",
    ()=>{


        let location =

        button.textContent

        .replace(
        /🇷🇼|🇰🇪|🇬🇧|🇫🇷|🇩🇪|🇺🇸|🇨🇦|🇦🇪/g,
        ""
        )

        .trim();



        document
        .getElementById("where")
        .value = location;



        searchJobs();



    });


});





// LOAD SAVED JOBS

displaySavedJobs();





window.addEventListener(
"load",
()=>{


    status.textContent =
    "Search jobs by keyword or location.";


});
