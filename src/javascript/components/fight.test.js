import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getHitPower, getBlockPower, getDamage } from './fight';

describe('fight helpers', () => {
    let mockMathRandom;

    beforeEach(() => {
        mockMathRandom = vi.spyOn(Math, 'random');
    });

    afterEach(() => {
        mockMathRandom.mockRestore();
    });

    describe('getHitPower', () => {
        it('should calculate hit power correctly based on attack and random chance', () => {
            const fighter = { attack: 10 };
            mockMathRandom.mockReturnValue(0.5); // criticalHitChance = 1.5

            const power = getHitPower(fighter);
            expect(power).toBe(15);
        });
    });

    describe('getBlockPower', () => {
        it('should calculate block power correctly based on defense and random chance', () => {
            const fighter = { defense: 6 };
            mockMathRandom.mockReturnValue(0.2); // dodgeChance = 1.2

            const power = getBlockPower(fighter);
            expect(power).toBeCloseTo(7.2);
        });
    });

    describe('getDamage', () => {
        it('should return calculated damage if hit power is greater than block power', () => {
            const attacker = { attack: 10 };
            const defender = { defense: 4 };

            // First call to Math.random() is for getHitPower (returns 0.5 -> power = 15)
            // Second call is for getBlockPower (returns 0.5 -> power = 6)
            mockMathRandom.mockReturnValueOnce(0.5).mockReturnValueOnce(0.5);

            const damage = getDamage(attacker, defender);
            expect(damage).toBe(9); // 15 - 6 = 9
        });

        it('should return 0 if block power is greater than or equal to hit power', () => {
            const attacker = { attack: 10 };
            const defender = { defense: 15 };

            // First call returns 0.1 -> hit power = 11
            // Second call returns 0.9 -> block power = 28.5
            mockMathRandom.mockReturnValueOnce(0.1).mockReturnValueOnce(0.9);

            const damage = getDamage(attacker, defender);
            expect(damage).toBe(0);
        });
    });
});
