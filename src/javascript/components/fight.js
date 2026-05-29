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
        let firstHealth = firstFighter.health;
        let secondHealth = secondFighter.health;

        const pressedKeys = new Set();
        let playerOneCritTime = 0;
        let playerTwoCritTime = 0;

        const leftBar = document.getElementById('left-fighter-indicator');
        const rightBar = document.getElementById('right-fighter-indicator');

        let cleanup;

        const updateHealthBar = (position, health, maxHealth) => {
            const bar = position === 'left' ? leftBar : rightBar;
            if (bar) {
                const percent = Math.max(0, (health / maxHealth) * 100);
                bar.style.width = `${percent}%`;
            }
        };

        const showDamageIndicator = (position, text, type) => {
            const fighterElement =
                position === 'left'
                    ? document.querySelector('.arena___left-fighter')
                    : document.querySelector('.arena___right-fighter');

            if (!fighterElement) return;

            const indicator = document.createElement('div');
            indicator.className = `arena___damage-indicator arena___damage-${type}`;
            indicator.innerText = text;

            const randomOffset = Math.floor(Math.random() * 40) - 20;
            indicator.style.left = `calc(50% + ${randomOffset}px)`;

            fighterElement.append(indicator);

            setTimeout(() => {
                indicator.remove();
            }, 1000);
        };

        const handleFighterDefeat = winner => {
            cleanup();
            resolve(winner);
        };

        const handleKeyDown = event => {
            if (event.repeat) return;
            pressedKeys.add(event.code);

            const now = Date.now();

            // Player One Critical Combo
            const isP1Crit = controls.PlayerOneCriticalHitCombination.every(key => pressedKeys.has(key));
            if (isP1Crit && now - playerOneCritTime >= 10000) {
                playerOneCritTime = now;
                const damage = 2 * firstFighter.attack;
                secondHealth -= damage;
                updateHealthBar('right', secondHealth, secondFighter.health);
                showDamageIndicator('right', `-${Math.round(damage)} CRIT!`, 'crit');
                if (secondHealth <= 0) handleFighterDefeat(firstFighter);
                return;
            }

            // Player Two Critical Combo
            const isP2Crit = controls.PlayerTwoCriticalHitCombination.every(key => pressedKeys.has(key));
            if (isP2Crit && now - playerTwoCritTime >= 10000) {
                playerTwoCritTime = now;
                const damage = 2 * secondFighter.attack;
                firstHealth -= damage;
                updateHealthBar('left', firstHealth, firstFighter.health);
                showDamageIndicator('left', `-${Math.round(damage)} CRIT!`, 'crit');
                if (firstHealth <= 0) handleFighterDefeat(secondFighter);
                return;
            }

            // Player One Attack
            if (event.code === controls.PlayerOneAttack && !pressedKeys.has(controls.PlayerOneBlock)) {
                const isBlocked = pressedKeys.has(controls.PlayerTwoBlock);
                const damage = isBlocked ? getDamage(firstFighter, secondFighter) : getHitPower(firstFighter);
                secondHealth -= damage;
                updateHealthBar('right', secondHealth, secondFighter.health);

                if (isBlocked && damage === 0) {
                    showDamageIndicator('right', 'BLOCKED', 'blocked');
                } else {
                    showDamageIndicator('right', `-${Math.round(damage)}`, 'hit');
                }

                if (secondHealth <= 0) handleFighterDefeat(firstFighter);
            }

            // Player Two Attack
            if (event.code === controls.PlayerTwoAttack && !pressedKeys.has(controls.PlayerTwoBlock)) {
                const isBlocked = pressedKeys.has(controls.PlayerOneBlock);
                const damage = isBlocked ? getDamage(secondFighter, firstFighter) : getHitPower(secondFighter);
                firstHealth -= damage;
                updateHealthBar('left', firstHealth, firstFighter.health);

                if (isBlocked && damage === 0) {
                    showDamageIndicator('left', 'BLOCKED', 'blocked');
                } else {
                    showDamageIndicator('left', `-${Math.round(damage)}`, 'hit');
                }

                if (firstHealth <= 0) handleFighterDefeat(secondFighter);
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
