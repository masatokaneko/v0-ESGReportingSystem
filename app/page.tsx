import { redirect } from "next/navigation"

export default function HomePage() {
  // ダッシュボードページにリダイレクト
  redirect("/dashboard")
}
