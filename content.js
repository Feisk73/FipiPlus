if (!window.__fipiplus_loaded) {
    window.__fipiplus_loaded = true;

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && event.target.tagName === 'INPUT') {
            checkAnswer(event.target)
        }
    }, true);
}

function checkAnswer(input) {
    const id = input.closest('[id]').id.slice(9);
    const i = document.getElementById('i' + id);
    const button = i.querySelector('.answer-button');
    const statusPanel = i.querySelector('.task-status');
    if (!['ВЕРНО', 'РЕШЕНО'].includes(statusPanel.textContent)) {
        checkStatus(statusPanel, input)
        button.click();
    }
}

function checkStatus(statusPanel, input) {
    const observer = new MutationObserver(() => {
        if (!statusPanel.querySelector('.loader')) {
            if (statusPanel.textContent === 'ВЕРНО') {
               focusNext(input)
            }
             observer.disconnect();
        }
    
    });
    observer.observe(statusPanel, {
        childList: true,
        characterData: true,
        subtree: true
    });
}

function focusNext(current) {
    const focusable = [...document.querySelectorAll('input')];
    const index = focusable.indexOf(current);
    setTimeout(() => focusable[index + 1]?.focus(), 0);
}