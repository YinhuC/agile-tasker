import { sortByIndex, sortByUpdateTime, sortByCreateTime } from '../sort.utils';

describe('Sort Utils', () => {
  describe('sortByIndex', () => {
    test('should sort items by index in ascending order', () => {
      const items = [
        { index: 3 },
        { index: 1 },
        { index: 2 },
        { index: 5 },
        { index: 4 },
      ];
      const expectedResult = [
        { index: 1 },
        { index: 2 },
        { index: 3 },
        { index: 4 },
        { index: 5 },
      ];

      const result = sortByIndex(items);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('sortByUpdateTime', () => {
    test('should sort items by updatedAt in descending order', () => {
      const items = [
        { updatedAt: '2022-01-01T10:00:00Z' },
        { updatedAt: '2023-01-01T10:00:00Z' },
        { updatedAt: '2021-01-01T10:00:00Z' },
      ];
      const expectedResult = [
        { updatedAt: '2023-01-01T10:00:00Z' },
        { updatedAt: '2022-01-01T10:00:00Z' },
        { updatedAt: '2021-01-01T10:00:00Z' },
      ];

      const result = sortByUpdateTime(items);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('sortByCreateTime', () => {
    test('should sort items by createdAt in descending order', () => {
      const items = [
        { createdAt: '2022-01-01T10:00:00Z' },
        { createdAt: '2023-01-01T10:00:00Z' },
        { createdAt: '2021-01-01T10:00:00Z' },
      ];
      const expectedResult = [
        { createdAt: '2023-01-01T10:00:00Z' },
        { createdAt: '2022-01-01T10:00:00Z' },
        { createdAt: '2021-01-01T10:00:00Z' },
      ];

      const result = sortByCreateTime(items);

      expect(result).toEqual(expectedResult);
    });
  });
});
