/**
 * Promiseをラップして、エラーハンドリングを強制するユーティリティ関数
 * @param promise 元のPromise
 * @returns [結果, エラー] のタプル
 */
export async function safeAwait<T>(promise: Promise<T>): Promise<[T | null, Error | null]> {
  try {
    const data = await promise
    return [data, null]
  } catch (error) {
    return [null, error instanceof Error ? error : new Error(String(error))]
  }
}

/**
 * 複数のPromiseを安全に実行し、すべての結果とエラーを返す
 * @param promises Promiseの配列
 * @returns 結果とエラーの配列
 */
export async function safePromiseAll<T>(promises: Promise<T>[]): Promise<{
  results: (T | null)[]
  errors: (Error | null)[]
}> {
  const results: (T | null)[] = []
  const errors: (Error | null)[] = []

  await Promise.all(
    promises.map(async (promise, index) => {
      const [result, error] = await safeAwait(promise)
      results[index] = result
      errors[index] = error
    }),
  )

  return { results, errors }
}

/**
 * Promiseをリトライする関数
 * @param fn Promiseを返す関数
 * @param retries リトライ回数
 * @param delay リトライ間の遅延（ミリ秒）
 * @param backoff バックオフ係数（遅延を増やす倍率）
 * @returns Promise
 */
export async function retry<T>(fn: () => Promise<T>, retries = 3, delay = 300, backoff = 2): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (retries <= 0) {
      throw error
    }

    await new Promise((resolve) => setTimeout(resolve, delay))
    return retry(fn, retries - 1, delay * backoff, backoff)
  }
}

/**
 * Promiseにタイムアウトを設定する関数
 * @param promise 元のPromise
 * @param timeoutMs タイムアウト時間（ミリ秒）
 * @param errorMessage タイムアウト時のエラーメッセージ
 * @returns Promise
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage = "Operation timed out",
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(errorMessage))
    }, timeoutMs)
  })

  return Promise.race([promise, timeoutPromise])
}
