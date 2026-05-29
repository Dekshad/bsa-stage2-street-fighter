import controls from '../../constants/controls';

export function getHitPower(fighter) {
    const criticalHitChance = Math.random() + 1;
    return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
    const dodgeChance = Math.random() + 1;
    return fighter.defense * dodgeChance;
}

export function getDamage(attacker, defender) {
    const damage = getHitPower(attacker) - getBlockPower(defender);
    return damage > 0 ? damage : 0;
}

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        let firstFighterHealth = firstFighter.health;
        let secondFighterHealth = secondFighter.health;

        const pressedKeys = new Set();
        let playerOneCritTime = 0;
        let playerTwoCritTime = 0;

        const leftBar = document.getElementById('left-fighter-indicator');
        const rightBar = document.getElementById('right-fighter-indicator');

        let cleanup;

        const handleKeyDown = event => {
            if (event.repeat) return;
            pressedKeys.add(event.code);

            // Player One Critical Combo
            const isPlayerOneCrit = controls.PlayerOneCriticalHitCombination.every(key => pressedKeys.has(key));
            if (isPlayerOneCrit) {
                const now = Date.now();
                if (now - playerOneCritTime >= 10000) {
                    playerOneCritTime = now;
                    const damage = 2 * firstFighter.attack;
                    secondFighterHealth -= damage;
                    if (rightBar) {
                        rightBar.style.width = `${Math.max(0, (secondFighterHealth / secondFighter.health) * 100)}%`;
                    }
                    if (secondFighterHealth <= 0) {
                        cleanup();
                        resolve(firstFighter);
                    }
                }
                return;
            }

            // Player Two Critical Combo
            const isPlayerTwoCrit = controls.PlayerTwoCriticalHitCombination.every(key => pressedKeys.has(key));
            if (isPlayerTwoCrit) {
                const now = Date.now();
                if (now - playerTwoCritTime >= 10000) {
                    playerTwoCritTime = now;
                    const damage = 2 * secondFighter.attack;
                    firstFighterHealth -= damage;
                    if (leftBar) {
                        leftBar.style.width = `${Math.max(0, (firstFighterHealth / firstFighter.health) * 100)}%`;
                    }
                    if (firstFighterHealth <= 0) {
                        cleanup();
                        resolve(secondFighter);
                    }
                }
                return;
            }

            // Player One Attack
            if (event.code === controls.PlayerOneAttack) {
                if (pressedKeys.has(controls.PlayerOneBlock)) return;

                let damage = 0;
                if (pressedKeys.has(controls.PlayerTwoBlock)) {
                    damage = getDamage(firstFighter, secondFighter);
                } else {
                    damage = getHitPower(firstFighter);
                }

                secondFighterHealth -= damage;
                if (rightBar) {
                    rightBar.style.width = `${Math.max(0, (secondFighterHealth / secondFighter.health) * 100)}%`;
                }

                if (secondFighterHealth <= 0) {
                    cleanup();
                    resolve(firstFighter);
                }
            }

            // Player Two Attack
            if (event.code === controls.PlayerTwoAttack) {
                if (pressedKeys.has(controls.PlayerTwoBlock)) return;

                let damage = 0;
                if (pressedKeys.has(controls.PlayerOneBlock)) {
                    damage = getDamage(secondFighter, firstFighter);
                } else {
                    damage = getHitPower(secondFighter);
                }

                firstFighterHealth -= damage;
                if (leftBar) {
                    leftBar.style.width = `${Math.max(0, (firstFighterHealth / firstFighter.health) * 100)}%`;
                }

                if (firstFighterHealth <= 0) {
                    cleanup();
                    resolve(secondFighter);
                }
            }
        };

        const handleKeyUp = event => {
            pressedKeys.delete(event.code);
        };

        cleanup = () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
    });
}
