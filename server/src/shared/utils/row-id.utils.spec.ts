import { parseRowId } from './row-id.utils';

describe('parseRowId', () => {
  it('should parse a positive integer id', () => {
    expect(parseRowId('7')).toBe(7);
  });

  it.each(['abc', '7abc', '1.5', '-1', '0', '', '2147483648'])(
    'should answer %p with a 404',
    (id) => {
      expect(() => parseRowId(id)).toThrow('Not Found');
    }
  );
});
