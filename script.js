const username = 'itgourmand';
const container = document.getElementById('projects-container');
const avatar = document.getElementById('profile-avatar');
const avatarFallback = document.getElementById('avatar-fallback');

const languageColors = {
    JavaScript: '#d9a05b',
    Python: '#5b8266',
    HTML: '#c97a63',
    CSS: '#7e738c',
    C: '#628395',
    'C++': '#628395',
    'C#': '#7256a5',
    TypeScript: '#4f7596',
    Ruby: '#b34b4b',
    Go: '#4f9da6',
    Rust: '#9a6245',
    Java: '#c46b42',
    PHP: '#777bb4',
    Swift: '#e8784b',
    Kotlin: '#8d65c5',
    Dart: '#3986a8',
    Shell: '#6b8e5a',
    R: '#477db3',
    Web: '#968e85'
};

if (avatar) {
    avatar.src = `https://github.com/${username}.png?size=160`;
    avatar.addEventListener('error', () => {
        avatar.style.display = 'none';
        if (avatarFallback) avatarFallback.hidden = false;
    }, { once: true });
}

function makeProjectCard(repo) {
    const card = document.createElement('article');
    card.className = 'project-card';

    const body = document.createElement('div');
    body.className = 'card-body';

    const title = document.createElement('h3');
    title.textContent = repo.name;

    const description = document.createElement('p');
    description.textContent = repo.description || 'A small project made with care.';
    body.append(title, description);

    const language = repo.language || 'Web';
    const languageTag = document.createElement('span');
    languageTag.className = 'lang-tag';

    const dot = document.createElement('span');
    dot.className = 'lang-circle';
    dot.style.backgroundColor = languageColors[language] || languageColors.Web;
    dot.setAttribute('aria-hidden', 'true');

    const languageName = document.createElement('span');
    languageName.textContent = language;
    languageTag.append(dot, languageName);

    const actions = document.createElement('div');
    actions.className = 'project-links';
    const projectLink = document.createElement('a');
    projectLink.className = 'card-main-link';
    projectLink.href = `https://${username}.github.io/${encodeURIComponent(repo.name)}/`;
    projectLink.target = '_blank';
    projectLink.rel = 'noopener noreferrer';
    projectLink.textContent = 'Open project ↗';

    const sourceLink = document.createElement('a');
    sourceLink.className = 'source-link';
    sourceLink.href = repo.html_url;
    sourceLink.target = '_blank';
    sourceLink.rel = 'noopener noreferrer';
    sourceLink.textContent = 'Source';
    actions.append(projectLink, sourceLink);

    const footer = document.createElement('div');
    footer.className = 'card-footer';
    footer.append(languageTag, actions);

    card.append(body, footer);
    return card;
}

fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
    .then(response => {
        if (!response.ok) throw new Error('Unable to connect to the GitHub API');
        return response.json();
    })
    .then(repos => {
        const publishedPages = repos.filter(repo =>
            repo.has_pages && repo.name.toLowerCase() !== `${username}.github.io`.toLowerCase()
        );

        container.replaceChildren();
        container.setAttribute('aria-busy', 'false');

        if (publishedPages.length === 0) {
            const emptyState = document.createElement('p');
            emptyState.className = 'empty-state';
            emptyState.textContent = 'No published projects yet.';
            container.append(emptyState);
            return;
        }

        publishedPages.forEach(repo => container.append(makeProjectCard(repo)));
    })
    .catch(error => {
        container.replaceChildren();
        container.setAttribute('aria-busy', 'false');

        const errorState = document.createElement('p');
        errorState.className = 'error-state';
        errorState.textContent = 'Could not load projects from GitHub. Please try again later.';
        container.append(errorState);
        console.error(error);
    });
