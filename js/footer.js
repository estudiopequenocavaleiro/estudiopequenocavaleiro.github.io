document.addEventListener('DOMContentLoaded', () => {
    const socialBlock = document.querySelector('.footer__social-block');
    if (!socialBlock || !('IntersectionObserver' in window)) return;

    let revealTimer = null;
    const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
            if (entry.intersectionRatio >= 0.35) {
                if (!socialBlock.classList.contains('is-invited') && revealTimer === null) {
                    revealTimer = setTimeout(() => {
                        socialBlock.classList.add('is-invited');
                        revealTimer = null;
                    }, 700);
                }
            } else {
                clearTimeout(revealTimer);
                revealTimer = null;
                socialBlock.classList.remove('is-invited');
            }
        }
    }, { threshold: 0.35 });
    observer.observe(socialBlock);
});
