import showModal from './modal';
import { createFighterImage } from '../fighterPreview';
import createElement from '../../helpers/domHelper';

export default function showWinnerModal(fighter) {
    const bodyElement = createElement({
        tagName: 'div',
        className: 'modal-body'
    });

    const imgElement = createFighterImage(fighter);
    bodyElement.append(imgElement);

    showModal({
        title: `${fighter.name} is the Winner!`,
        bodyElement,
        onClose: () => {
            window.location.reload();
        }
    });
}
