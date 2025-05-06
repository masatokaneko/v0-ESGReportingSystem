import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Save, Globe, Bell, Shield, Mail, User } from "lucide-react"

export default function SettingsPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">設定</h1>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="general">一般</TabsTrigger>
          <TabsTrigger value="notifications">通知</TabsTrigger>
          <TabsTrigger value="security">セキュリティ</TabsTrigger>
          <TabsTrigger value="api">API設定</TabsTrigger>
          <TabsTrigger value="advanced">詳細設定</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                システム基本設定
              </CardTitle>
              <CardDescription>システムの基本的な設定を行います</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">会社名</Label>
                    <Input id="company-name" defaultValue="株式会社サンプル" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fiscal-year">会計年度開始月</Label>
                    <Select defaultValue="4">
                      <SelectTrigger id="fiscal-year">
                        <SelectValue placeholder="会計年度開始月を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1月</SelectItem>
                        <SelectItem value="4">4月</SelectItem>
                        <SelectItem value="10">10月</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="system-language">システム言語</Label>
                  <Select defaultValue="ja">
                    <SelectTrigger id="system-language">
                      <SelectValue placeholder="システム言語を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ja">日本語</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">タイムゾーン</Label>
                  <Select defaultValue="Asia/Tokyo">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="タイムゾーンを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo (GMT+9:00)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (GMT-5:00)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT+0:00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="auto-calculate" defaultChecked />
                  <Label htmlFor="auto-calculate">CO2排出量の自動計算を有効にする</Label>
                </div>

                <div className="flex justify-end">
                  <Button className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    設定を保存
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                ユーザー設定
              </CardTitle>
              <CardDescription>ユーザー関連の設定を行います</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="default-role">新規ユーザーのデフォルトロール</Label>
                  <Select defaultValue="user">
                    <SelectTrigger id="default-role">
                      <SelectValue placeholder="デフォルトロールを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">管理者</SelectItem>
                      <SelectItem value="approver">承認者</SelectItem>
                      <SelectItem value="user">一般ユーザー</SelectItem>
                      <SelectItem value="viewer">閲覧のみ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="auto-approve-users" />
                  <Label htmlFor="auto-approve-users">新規ユーザー登録を自動承認する</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="allow-self-registration" defaultChecked />
                  <Label htmlFor="allow-self-registration">ユーザーのセルフ登録を許可する</Label>
                </div>

                <div className="flex justify-end">
                  <Button className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    設定を保存
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                通知設定
              </CardTitle>
              <CardDescription>システム通知の設定を行います</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">メール通知</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-data-submission">データ登録時</Label>
                      <Switch id="notify-data-submission" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-data-approval">データ承認時</Label>
                      <Switch id="notify-data-approval" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-report-generation">レポート生成時</Label>
                      <Switch id="notify-report-generation" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-system-error">システムエラー発生時</Label>
                      <Switch id="notify-system-error" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">通知先設定</h3>
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">管理者メールアドレス</Label>
                    <Input id="admin-email" type="email" defaultValue="admin@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="error-notification-email">エラー通知先メールアドレス</Label>
                    <Input id="error-notification-email" type="email" defaultValue="error@example.com" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">通知スケジュール</h3>
                  <div className="space-y-2">
                    <Label htmlFor="notification-schedule">サマリーレポート送信頻度</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger id="notification-schedule">
                        <SelectValue placeholder="送信頻度を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">毎日</SelectItem>
                        <SelectItem value="weekly">毎週</SelectItem>
                        <SelectItem value="monthly">毎月</SelectItem>
                        <SelectItem value="never">送信しない</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    設定を保存
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                セキュリティ設定
              </CardTitle>
              <CardDescription>システムのセキュリティ設定を行います</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">パスワードポリシー</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="min-password-length">最小パスワード長</Label>
                      <Input
                        id="min-password-length"
                        type="number"
                        defaultValue="8"
                        min="6"
                        max="20"
                        className="w-20"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="require-uppercase">大文字を必須にする</Label>
                      <Switch id="require-uppercase" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="require-numbers">数字を必須にする</Label>
                      <Switch id="require-numbers" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="require-symbols">記号を必須にする</Label>
                      <Switch id="require-symbols" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password-expiry-days">パスワード有効期限（日数）</Label>
                      <Input
                        id="password-expiry-days"
                        type="number"
                        defaultValue="90"
                        min="0"
                        max="365"
                        className="w-20"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">セッション設定</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="session-timeout">セッションタイムアウト（分）</Label>
                      <Input id="session-timeout" type="number" defaultValue="30" min="5" max="120" className="w-20" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="max-login-attempts">最大ログイン試行回数</Label>
                      <Input id="max-login-attempts" type="number" defaultValue="5" min="3" max="10" className="w-20" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">二要素認証</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enable-2fa">二要素認証を有効にする</Label>
                      <Switch id="enable-2fa" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="require-2fa-for-admins">管理者に二要素認証を必須にする</Label>
                      <Switch id="require-2fa-for-admins" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    設定を保存
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                API設定
              </CardTitle>
              <CardDescription>APIの設定を行います</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="api-key">APIキー</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="api-key"
                      defaultValue="sk_live_51KjLqWJhXnJLsdfghjklzxcvbnm1234567890"
                      readOnly
                      className="font-mono"
                    />
                    <Button variant="outline">再生成</Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    このAPIキーは外部システムからのアクセスに使用されます。安全に保管してください。
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-rate-limit">APIレート制限（リクエスト/分）</Label>
                  <Input id="api-rate-limit" type="number" defaultValue="60" min="10" max="1000" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allowed-origins">許可されたオリジン</Label>
                  <Textarea
                    id="allowed-origins"
                    defaultValue="https://example.com
https://api.example.com"
                    placeholder="各オリジンを改行で区切って入力してください"
                    className="font-mono"
                  />
                  <p className="text-sm text-gray-500">
                    CORSで許可するオリジンを入力してください。空白の場合はすべてのオリジンからのアクセスを許可します。
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="enable-api" defaultChecked />
                  <Label htmlFor="enable-api">APIアクセスを有効にする</Label>
                </div>

                <div className="flex justify-end">
                  <Button className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    設定を保存
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>詳細設定</CardTitle>
              <CardDescription>システムの詳細設定を行います</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="data-retention-period">データ保持期間（月）</Label>
                  <Input id="data-retention-period" type="number" defaultValue="36" min="1" max="120" />
                  <p className="text-sm text-gray-500">
                    この期間を過ぎたデータは自動的にアーカイブされます。0を指定すると無期限に保持します。
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="log-level">ログレベル</Label>
                  <Select defaultValue="info">
                    <SelectTrigger id="log-level">
                      <SelectValue placeholder="ログレベルを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debug">デバッグ</SelectItem>
                      <SelectItem value="info">情報</SelectItem>
                      <SelectItem value="warn">警告</SelectItem>
                      <SelectItem value="error">エラー</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backup-schedule">バックアップスケジュール</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger id="backup-schedule">
                      <SelectValue placeholder="バックアップスケジュールを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">毎時</SelectItem>
                      <SelectItem value="daily">毎日</SelectItem>
                      <SelectItem value="weekly">毎週</SelectItem>
                      <SelectItem value="monthly">毎月</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-css">カスタムCSS</Label>
                  <Textarea id="custom-css" placeholder="カスタムCSSを入力してください" className="font-mono h-32" />
                  <p className="text-sm text-gray-500">システムのスタイルをカスタマイズするためのCSSを入力できます。</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="maintenance-mode" />
                  <Label htmlFor="maintenance-mode">メンテナンスモードを有効にする</Label>
                </div>

                <div className="flex justify-end">
                  <Button className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    設定を保存
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
