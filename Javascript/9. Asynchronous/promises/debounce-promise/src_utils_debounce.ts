export const debouncePromise = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  ms: number = 0
) => {
  let timeoutId: NodeJS.Timeout | null = null;
  const pending: Array<{
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
  }> = [];

  return (...args: Parameters<T>): Promise<ReturnType<T>> =>
    new Promise((res, rej) => {
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        const currentPending = [...pending];
        pending.length = 0;
        Promise.resolve(fn.apply(null, args)).then(
          (data) => {
            currentPending.forEach(({ resolve }) => resolve(data));
          },
          (error) => {
            currentPending.forEach(({ reject }) => reject(error));
          }
        );
      }, ms);

      pending.push({ resolve: res, reject: rej });
    });
};

