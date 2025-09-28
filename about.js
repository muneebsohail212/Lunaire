// about-panel.js
const aboutLink = document.getElementById('aboutLink');

// Create container for panel
let aboutContainer = document.createElement('div');
document.body.appendChild(aboutContainer);

aboutLink.addEventListener('click', async (e) => {
  e.preventDefault();

  if (!document.getElementById('aboutPanel')) {
    // Fetch About Us HTML
    const response = await fetch('aboutpanel.html');
    const html = await response.text();
    aboutContainer.innerHTML = html;

    const aboutPanel = document.getElementById('aboutPanel');
    const aboutContent = document.getElementById('aboutContent');
    const closeAbout = document.getElementById('closeAbout');

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

    // Close when clicking outside
    aboutPanel.addEventListener('click', (e) => {
      if (e.target === aboutPanel) {
        aboutContent.classList.add('translate-x-full');
        setTimeout(() => {
          aboutPanel.classList.add('hidden');
        }, 500);
      }
    });
  } else {
    const aboutPanel = document.getElementById('aboutPanel');
    const aboutContent = document.getElementById('aboutContent');
    aboutPanel.classList.remove('hidden');
    setTimeout(() => {
      aboutContent.classList.remove('translate-x-full');
    }, 50);
  }
});
