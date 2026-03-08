let open = [];
let closed = [];
let currentStatus = 'all';

const allFilterBtn = document.getElementById('all-filter-btn');
const openFilterBtn = document.getElementById('open-filter-btn');
const closedFilterBtn = document.getElementById('closed-filter-btn');
const cardContainer = document.getElementById('card-container');
const searchInput = document.getElementById('search-input');
const issuesCount = document.getElementById('issues-count');

// search fetch 
searchInput.addEventListener("keyup", (e) => {
    fetch(` https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`)
    .then((res) => res.json())
    .then((json) => {
        displayIssues(json.data);
    });
});

// use enter press for search
searchInput.addEventListener("keypress", (e) => {
    if(e.key === "Enter"){
        const searchText = e.target.value.trim().toLowerCase();
        fetch(` https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`)
    .then((res) => res.json())
    .then((json) => displayIssues(json.data));
    };
});

// btn toggling
function toggleStyle(id){
    allFilterBtn.classList.remove('btn-primary');
    openFilterBtn.classList.remove('btn-primary');
    closedFilterBtn.classList.remove('btn-primary');

    allFilterBtn.classList.add('btn-soft');
    openFilterBtn.classList.add('btn-soft');
    closedFilterBtn.classList.add('btn-soft');

    const selected = document.getElementById(id);
    currentStatus = id;

    selected.classList.remove('btn-soft');
    selected.classList.add('btn-primary');
};

allFilterBtn.addEventListener("click", () => {
    toggleStyle("all-filter-btn");
    displayIssues([...open, ...closed]);
});
openFilterBtn.addEventListener("click", () => {
    toggleStyle("open-filter-btn");
    displayIssues(open);
});
closedFilterBtn.addEventListener("click", () => {
    toggleStyle("closed-filter-btn");
    displayIssues(closed);
});

const manageSpiner = (status) => {
    if(status == true){
        document.getElementById("spiner").classList.remove("hidden");
        document.getElementById("container").classList.add("hidden");
    }
    else{
        document.getElementById("container").classList.remove("hidden");
        document.getElementById("spiner").classList.add("hidden");
    }
};

// calculate card
function calculateCard (){
    issuesCount.innerText = cardContainer.children.length;
    if(currentStatus === 'all'){
        issuesCount.innerText =  cardContainer.children.length;
    }
    else if (currentStatus === "open-filter-btn"){
        issuesCount.innerText = open.length;
    }
    else if (currentStatus === "closed-filter-btn"){
        issuesCount.innerText = closed.length;
    }
};
calculateCard();


// issues fetch 
const loadIssues = () => {
    //manageSpiner(true);
    fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
    .then ((res) => res.json())
    .then ((json) => {
        const issues = json.data;
        open = issues.filter(issues => issues.status === "open");
        closed = issues.filter(issues => issues.status === "closed");
        displayIssues(issues);
    });
};

const createLevels = (labels) => {
    let labelHtml = "";
    for (let label of labels){
        if (label === "bug"){
            labelHtml += `
            <p class="bg-red-200 px-3 py-1 text-red-600 rounded-4xl"><i class="fa-solid fa-bug"></i> BUG</p>
            `;
        }
        else if (label === "help wanted"){
            labelHtml += `
            <p class="bg-yellow-200 px-3 py-1 text-yellow-600 rounded-4xl gap-1"><i class="fa-brands fa-chrome"></i>HELP WANTED</p>
            `;
        }
        else if (label === "enhancement"){
            labelHtml += `
            <p class="inline-flex items-center gap-1 bg-green-200 px-3 py-1 w-fit text-green-600 rounded-4xl">
            <i class="fa-solid fa-wand-magic-sparkles"></i>Enhancement
            </p>
            `;
        }
        else if (label === "documentation"){
            labelHtml += `
            <p class="inline-flex items-center gap-1 bg-blue-200 px-3 py-1 text-blue-600 rounded-4xl">
            <i class="fa-solid fa-file"></i> Documentation
            </p>
            `;
        }
        else if (label === "good first issue"){
            labelHtml += `
            <p class="inline-flex items-center gap-1 bg-pink-200 py-1 px-3 text-pink-600 rounded-4xl">
            <i class="fa-solid fa-clover"></i> Good First Issue
            </p>
            `;
        }
    }
    return labelHtml;
};

// display issues
const displayIssues = (issues) => {
    const issuesContainer = document.getElementById('card-container');
    issuesContainer.innerHTML = "";
    for (let issue of issues){
        const card = document.createElement("div");
        card.addEventListener("click", () => {
            loadingSingleIssu(issue.id);
        });
        card.classList = `bg-white p-10 shadow rounded-2xl space-y-4 border-t-3 ${issue.status === 'open' ? "border-green-500" : "border-purple-500"}`;
        const labelsHTML = createLevels(issue.labels);
        card.innerHTML = `
                <div class="flex justify-between items-center">
                  <img src="${issue.status === "open" ? "./assets/Open-Status.png" : "./assets/Closed-Status.png"}" alt="">
                  <p class=" px-3 py-1 ${issue.priority === "high" ? "bg-red-200 text-red-600" : issue.priority === "medium" ?  "bg-yellow-200 text-yellow-600" : "bg-gray-200 text-gray-600"} rounded-4xl">${issue.priority}</p>
                </div>
                <div class="space-y-1.5">
                  <h3 class="text-xl font-bold text-prim">${issue.title}</h3>
                  <p class="text-p line-clamp-2">${issue.description}</p>
                </div>
                <div class="flex items-center gap-6">
                  ${labelsHTML}
                </div>
                <div class="border-t border-gray-300">
                <div class = "mt-4">
                  <p class="text-p">${issue.author ? issue.author : "N/A"} <br> ${issue.createdAt ? issue.createdAt : "N/A"} <br>  ${issue.assignee ? issue.assignee : "N/A"} <br> ${issue.updatedAt ? issue.updatedAt : "N/A"} </p>
                </div>
        `;
        issuesContainer.appendChild(card);
        //manageSpiner(false);
    };
    calculateCard();
};

const loadingSingleIssu = (id) => {
    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
    .then((res) => res.json())
    .then((json) => showModal(json.data));
};

const showModal = (issue) => {
    const modal = document.getElementById("issue-modal");
    const modalContent = document.getElementById("modal-content");

    const labelsHtml = createLevels(issue.labels);

    modalContent.innerHTML = `
    <div class="max-w-md space-y-4 bg-white">
        <h3 class="text-xl font-bold text-prim">${issue.title}</h3>
        <div class="flex items-center gap-6">
            <p class=" px-3 py-1 text-white ${issue.status === "open" ? "bg-green-500" : "bg-purple-500"} rounded-4xl">${issue.status}</p>
            <p class="text-p"> •  ${issue.status === "open" ? "Opended" : "Closed"} by ${issue.author ? issue.author : "N/A"}  •  ${issue.createdAt ? issue.createdAt : "N/A"}</p>
        </div>
         <div class="flex items-center gap-6">
            ${labelsHtml}
        </div>
        <p class="text-p line-clamp-2">${issue.description}</p>
        <div class="flex justify-between bg-gray-100 rounded-xl p-3">
      <div class="space-y-1.5">
        <p class="text-p">Assignee:</p>
        <h4 class="font-semibold text-xl">${issue.assignee ? issue.assignee : "N/A"}</h4>
      </div>
      <div class="space-y-1.5">
        <p class="text-p">Priority:</p>
        <p class=" px-3 py-1 ${issue.priority === "high" ? "bg-red-200 text-red-600" : issue.priority === "medium" ?  "bg-yellow-200 text-yellow-600" : "bg-gray-200 text-gray-600"} rounded-4xl">${issue.priority}</p>
      </div>
    </div>
        <div class="modal-action">
          <form method="dialog">
            <!-- if there is a button, it will close the modal -->
            <button class="btn btn-primary">Close</button>
          </form>
        </div>
    </div>
    `;
    modal.showModal();
}


loadIssues();