import showModal from './modal';
import { createFighterImage } from '../fighterPreview';
import createElement from '../../helpers/domHelper';

export default function showWinnerModal(fighter) {
    const bodyElement = createElement({
        tagName: 'div',
        className: 'modal-body'
    });

    const nameElement = createElement({
        tagName: 'h2',
        className: 'modal-winner-name'
    });
    nameElement.innerText = `${fighter.name}`;

    const imgElement = createFighterImage(fighter);
    bodyElement.append(nameElement, imgElement);

    showModal({
        title: 'Winner!',
        bodyElement,
        onClose: () => {
            window.location.reload();
        }
    });
}
