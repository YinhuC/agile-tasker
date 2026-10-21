type MockQueryResults = {
  getOne?: unknown;
  getMany?: unknown;
  getCount?: number;
  getExists?: boolean;
};

/** A chainable query builder stub whose terminal calls resolve to the given results. */
export const generateMockQueryBuilder = (results: MockQueryResults = {}) => ({
  innerJoin: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  addOrderBy: jest.fn().mockReturnThis(),
  setLock: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  getOne: jest.fn().mockResolvedValue(results.getOne),
  getMany: jest.fn().mockResolvedValue(results.getMany),
  getCount: jest.fn().mockResolvedValue(results.getCount),
  getExists: jest.fn().mockResolvedValue(results.getExists),
  execute: jest.fn().mockResolvedValue({ affected: 1 }),
});

export type MockQueryBuilder = ReturnType<typeof generateMockQueryBuilder>;

/** An entity manager stub that hands out the given query builders in call order. */
export const generateMockEntityManager = (
  queryBuilders: MockQueryBuilder[]
) => {
  const createQueryBuilder = jest.fn();
  queryBuilders.forEach((queryBuilder) =>
    createQueryBuilder.mockReturnValueOnce(queryBuilder)
  );
  return {
    createQueryBuilder,
    create: jest.fn((_target: unknown, data: unknown) => data),
    save: jest.fn(async (data: unknown) => data),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };
};
