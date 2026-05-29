import createElement from '../helpers/domHelper';

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    if (fighter) {
        const imageElement = createFighterImage(fighter);

        const nameElement = createElement({
            tagName: 'div',
            className: 'fighter-preview___name'
        });
        nameElement.innerText = fighter.name;

        const detailsElement = createElement({
            tagName: 'div',
            className: 'fighter-preview___details'
        });

        const hpElement = createElement({ tagName: 'div', className: 'fighter-preview___detail-item' });
        hpElement.innerHTML = `<span>HP:</span><span>${fighter.health}</span>`;

        const atkElement = createElement({ tagName: 'div', className: 'fighter-preview___detail-item' });
        atkElement.innerHTML = `<span>ATK:</span><span>${fighter.attack}</span>`;

        const defElement = createElement({ tagName: 'div', className: 'fighter-preview___detail-item' });
        defElement.innerHTML = `<span>DEF:</span><span>${fighter.defense}</span>`;

        detailsElement.append(hpElement, atkElement, defElement);
        fighterElement.append(imageElement, nameElement, detailsElement);
    }

    return fighterElement;
}
