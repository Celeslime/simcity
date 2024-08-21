document.getElementById('search').addEventListener('input', function() {
    const keyword = this.value.toLowerCase();
    const content = document.getElementById('content');
    const results = document.getElementById('search-results');
    results.innerHTML = '';
    
    if (keyword) {
        const sections = content.querySelectorAll('h1, h2, h3, p');
        sections.forEach(section => {
            if (section.innerText.toLowerCase().includes(keyword)) {
                const result = document.createElement('div');
                result.innerHTML = `<a href="#${section.id}">${section.innerText}</a>`;
                results.appendChild(result);
            }
        });
    }
});
