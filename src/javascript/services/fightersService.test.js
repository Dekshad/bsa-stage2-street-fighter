import { describe, it, expect, vi } from 'vitest';
import fighterService from './fightersService';
import callApi from '../helpers/apiHelper';

vi.mock('../helpers/apiHelper', () => {
    return {
        default: vi.fn()
    };
});

describe('FighterService', () => {
    describe('getFighterDetails', () => {
        it('should call callApi with the correct endpoint', async () => {
            const mockDetails = { _id: '1', name: 'Ryu', health: 45 };
            vi.mocked(callApi).mockResolvedValue(mockDetails);

            const details = await fighterService.getFighterDetails('1');

            expect(callApi).toHaveBeenCalledWith('details/fighter/1.json');
            expect(details).toEqual(mockDetails);
        });
    });
});
