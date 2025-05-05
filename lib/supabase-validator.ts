/**
 * Supabaseのキーが有効なJWTトークン形式かどうかを検証する
 */
export function isValidSupabaseKey(key: string | undefined): boolean {
  if (!key) return false

  // JWTトークンの基本的な形式チェック（3つのセクションがドットで区切られている）
  const parts = key.split(".")
  if (parts.length !== 3) return false

  try {
    // ヘッダー部分をデコードして検証
    const header = JSON.parse(atob(parts[0]))
    if (!header.alg || !header.typ) return false

    // ペイロード部分をデコードして検証
    const payload = JSON.parse(atob(parts[1]))
    if (!payload.iss || !payload.role) return false

    return true
  } catch (e) {
    return false
  }
}

/**
 * サービスロールキーが有効かどうかを検証する
 */
export function isValidServiceRoleKey(key: string | undefined): boolean {
  if (!isValidSupabaseKey(key)) return false

  try {
    // ペイロード部分をデコードして検証
    const payload = JSON.parse(atob(key!.split(".")[1]))

    // サービスロールキーは role: 'service_role' を含む必要がある
    return payload.role === "service_role"
  } catch (e) {
    return false
  }
}

/**
 * 匿名キーが有効かどうかを検証する
 */
export function isValidAnonKey(key: string | undefined): boolean {
  if (!isValidSupabaseKey(key)) return false

  try {
    // ペイロード部分をデコードして検証
    const payload = JSON.parse(atob(key!.split(".")[1]))

    // 匿名キーは role: 'anon' を含む必要がある
    return payload.role === "anon"
  } catch (e) {
    return false
  }
}
