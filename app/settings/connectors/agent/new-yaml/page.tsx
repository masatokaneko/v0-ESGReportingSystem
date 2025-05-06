import { YamlUpload } from "@/components/connectors/yaml-upload"

export default function NewYamlPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">YAMLコネクタ設定</h1>
      <YamlUpload />
    </main>
  )
}
