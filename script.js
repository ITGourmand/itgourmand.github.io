const username = 'itgourmand';
const container = document.getElementById('projects-container');

// Technical string keys for programming languages
const natureLangColors = {
    'JavaScript': '#d9a05b',
    'Python': '#5b8266',
    'HTML': '#c97a63',
    'CSS': '#7e738c',
    'C++': '#628395',
    'TypeScript': '#4f7596',
    'Web': '#968e85'
};

// Fetch method handling API requests and dynamic DOM string rendering
fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
    .then(res => {
        if (!res.ok) throw new Error("Unable to connect to the GitHub API");
        return res.json();
    })
    .then(repos => {
        container.innerHTML = '';

        const publishedPages = repos.filter(repo => repo.has_pages && repo.name.toLowerCase() !== `${username}.github.io`.toLowerCase());

        if (publishedPages.length === 0) {
            container.innerHTML = `
                <div class="error-state">
                    <p>No publicly deployed applications were found.</p>
                </div>`;
            return;
        }

        publishedPages.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'project-card';

            const url = `https://${username}.github.io/${repo.name}/`;
            // English translation for default repository descriptions
            const description = repo.description || "Digital tool crafted with precision. Click below to open the application.";

            const currentLang = repo.language || "Web";
            const currentDotColor = natureLangColors[currentLang] || natureLangColors['Web'];

            card.innerHTML = `
                <div class="card-body">
                    <h3>${repo.name}</h3>
                    <p>${description}</p>
                </div>
                <div class="card-footer">
                    <div class="lang-tag">
                        <span class="lang-circle" style="background-color: ${currentDotColor}"></span>
                        ${currentLang}
                    </div>
                    <a href="${url}" target="_blank" class="link-explore">
                        Open <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            `;
            container.appendChild(card);
        });
    })
    .catch(err => {
        container.innerHTML = `
            <div class="error-state">
                <i class="fa-solid fa-triangle-exclamation" style="color: var(--accent); margin-bottom: 10px;"></i>
                <p>An error occurred while syncing with GitHub. Please reload the page.</p>
            </div>`;
        console.error(err);
    });