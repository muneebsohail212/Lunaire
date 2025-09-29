// about-panel.js
document.addEventListener('DOMContentLoaded', function() {
    const aboutLink = document.getElementById('aboutLink');
    if (!aboutLink) return;

    // Create container for panel if it doesn't exist
    let aboutContainer = document.getElementById('aboutPanelContainer');
    if (!aboutContainer) {
        aboutContainer = document.createElement('div');
        aboutContainer.id = 'aboutPanelContainer';
        document.body.appendChild(aboutContainer);
    }

    aboutLink.addEventListener('click', async (e) => {
        e.preventDefault();

        // Check if panel already exists
        let aboutPanel = document.getElementById('aboutPanel');
        let aboutContent = document.getElementById('aboutContent');
        
        if (!aboutPanel) {
            try {
                // Fetch About Us HTML
                const response = await fetch('aboutPanel.html');
                if (!response.ok) throw new Error('Failed to load aboutPanel.html');
                const html = await response.text();
                aboutContainer.innerHTML = html;

                // Re-select elements now that HTML is added
                aboutPanel = document.getElementById('aboutPanel');
                aboutContent = document.getElementById('aboutContent');
                const closeAbout = document.getElementById('closeAbout');

                if (!aboutPanel || !aboutContent || !closeAbout) {
                    throw new Error('Required elements not found in aboutPanel.html');
                }

                // Open panel
                aboutPanel.classList.remove('hidden');
                setTimeout(() => {
                    aboutContent.classList.remove('translate-x-full');
                }, 50);

                // Close button
                closeAbout.addEventListener('click', () => {
                    aboutContent.classList.add('translate-x-full');
                    setTimeout(() => {
                        aboutPanel.classList.add('hidden');
                    }, 500);
                });

                // Close when clicking outside the panel
                aboutPanel.addEventListener('click', (e) => {
                    if (e.target === aboutPanel) {
                        aboutContent.classList.add('translate-x-full');
                        setTimeout(() => {
                            aboutPanel.classList.add('hidden');
                        }, 500);
                    }
                });

            } catch (err) {
                console.error('Error loading About Panel:', err);
                alert('Failed to load About Us panel.');
            }
        } else {
            // Panel already exists, just open it
            aboutPanel.classList.remove('hidden');
            setTimeout(() => {
                aboutContent.classList.remove('translate-x-full');
            }, 50);
        }
    });
});
