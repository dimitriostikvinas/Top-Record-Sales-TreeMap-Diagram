// URLs of the three used datasets
const DATASETS = {
    videogames: {
      TITLE: 'Video Game Sales',
      DESCRIPTION: 'Top 100 Most Sold Video Games Grouped by Platform',
      FILE_PATH:
        'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json'
    },
    movies: {
      TITLE: 'Movie Sales',
      DESCRIPTION: 'Top 100 Highest Grossing Movies Grouped By Genre',
      FILE_PATH:
        'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json'
    },
    kickstarter: {
      TITLE: 'Kickstarter Pledges',
      DESCRIPTION:
        'Top 100 Most Pledged Kickstarter Campaigns Grouped By Category',
      FILE_PATH:
        'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json'
    }
};


document.addEventListener('DOMContentLoaded', function() {
    // Default fetching of video games dataset
    fetch(DATASETS.videogames.FILE_PATH)
        .then(response => response.json())
        .then(data => {
            drawTreemapDiagram(data, DATASETS.videogames.TITLE, DATASETS.videogames.DESCRIPTION);
            setupEventListeners(DATASETS);
        })
        .catch(error => console.error('Error loading dataset URLs: ', error));

    // Setup event listeners for when a link is pressed, in order to fetch its corresponding dataset 
    function setupEventListeners(DATASETS){
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', event =>{
                event.preventDefault();
                const datasetKey = link.id;
                const url = DATASETS[datasetKey].FILE_PATH;
                if(url){
                    fetchData(url, DATASETS[datasetKey].TITLE, DATASETS[datasetKey].DESCRIPTION);
                } else{
                    console.log('No URL defined for this dataset');
                }
            });
        });
    };
    // Fetch the dataset for the pressed link and pass it for visualization with TreeMap Diagram
    function fetchData(url, TITLE, DESCRIPTION){
        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayData(data);
                drawTreemapDiagram(data, TITLE, DESCRIPTION);
            }
            )
    }
    // The data is displayed in a formatted pre tag within the specified div for visual clarity and to maintain JSON formatting.
    function displayData(data) {
        const displayDiv = document.getElementById('data-display');
        displayDiv.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
    }
})