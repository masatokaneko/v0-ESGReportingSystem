export default function AdminPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">管理者ダッシュボード</h1>

      <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-md mb-6">
        <p>Neonデータベースに接続されています。</p>
        <p>管理機能はNeonデータベースに合わせて最適化されました。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">データ管理</h2>
          <p className="text-gray-600 mb-4">データエントリの管理、承認、検索などの機能にアクセスできます。</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>データエントリの検索と編集</li>
            <li>データの承認と拒否</li>
            <li>レポート生成</li>
          </ul>
        </div>

        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">設定</h2>
          <p className="text-gray-600 mb-4">システム設定、マスターデータの管理などの機能にアクセスできます。</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>ロケーション管理</li>
            <li>部門管理</li>
            <li>排出係数管理</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
