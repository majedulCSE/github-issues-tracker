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
        const searchText = e.target.value;
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
    fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
    .then ((res) => res.json())
    .then ((json) => {
        const issues = json.data;
        open = issues.filter(issues => issues.status === "open");
        closed = issues.filter(issues => issues.status === "closed");
        displayIssues(issues);
    });
};


// {
//     "id": 46,
//     "title": "Implement data backup system",
//     "description": "Set up automated daily backups of database with retention policy and restore procedures.",
//     "status": "open",
//     "labels": [
//         "enhancement"
//     ],
//     "priority": "high",
//     "author": "backup_bruce",
//     "assignee": "db_admin",
//     "createdAt": "2024-02-08T09:15:00Z",
//     "updatedAt": "2024-02-08T09:15:00Z"
// }


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
            <p class="bg-yellow-200 px-3 py-1 text-yellow-600 rounded-4xl"><i class="fa-brands fa-chrome"></i> HELP WANTED</p>
            `;
        }
        else if (label === "enhancement"){
            labelHtml += `
            <p class="bg-green-200 px-3 py-1 text-green-600 rounded-4xl">
            <i class="fa-solid fa-wand-magic-sparkles"></i> ENHANCEMENT
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
        card.classList = `bg-white p-10 shadow rounded-2xl space-y-4 border-t-3 ${issue.status === 'open' ? "border-green-500" : "border-purple-500"}`;
        const labelsHTML = createLevels(issue.labels);
        card.innerHTML = `
                <div class="flex justify-between items-center">
                  <img src="${issue.status === "open" ? "./assets/Open-Status.png" : "./assets/Closed-Status.png"}" alt="">
                  <p class=" px-3 py-1 ${issue.priority === "high" ? "bg-red-200 test-red-600" : issue.priority === "medium" ?  "bg-yellow-200 test-yellow-600" : "bg-gray-200 text-gray-600"} rounded-4xl">${issue.priority}</p>
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
                  <p class="text-p">${issue.author} <br> ${issue.createdAt} <br>  ${issue.assignee} <br> ${issue.updatedAt} </p>
                </div>
        `;
        issuesContainer.appendChild(card);
    }
    calculateCard();
};

loadIssues();