declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace globalThis {
    // eslint-disable-next-line no-var
    var __COUNTERS__: object;
  }
}

export const getCounter = (key: string): number => {
  if (key in global.__COUNTERS__) {
    global.__COUNTERS__[key as keyof typeof global.__COUNTERS__]++;

    return global.__COUNTERS__[key as keyof typeof global.__COUNTERS__];
  }

  (global.__COUNTERS__[key as keyof typeof global.__COUNTERS__] as number) = 0;

  return global.__COUNTERS__[key as keyof typeof global.__COUNTERS__];
};

export const restartCounters = (): void => {
  global.__COUNTERS__ = Object.keys(global.__COUNTERS__).reduce(
    (prev, curr) => ({ ...prev, [curr]: 0 }),
    {}
  );
};
