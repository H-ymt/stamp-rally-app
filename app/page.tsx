import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">スタンプラリーアプリ</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              QRコードをスキャンして楽しいスタンプラリーに参加しよう！
            </p>
            <div className="space-x-4">
              <Link
                href="/auth/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 inline-block"
              >
                今すぐ始める
              </Link>
              <Link
                href="/auth/login"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 inline-block"
              >
                ログイン
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 特徴セクション */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">アプリの特徴</h2>
            <p className="text-xl text-gray-600">
              簡単で楽しいスタンプラリー体験をお届けします
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">簡単QRスキャン</h3>
              <p className="text-gray-600">
                スマートフォンでQRコードをスキャンするだけ。
                誰でも簡単にスタンプを取得できます。
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📍</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">リアルタイム進捗</h3>
              <p className="text-gray-600">
                取得したスタンプはリアルタイムで反映。 進捗状況をいつでも確認できます。
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">達成感</h3>
              <p className="text-gray-600">
                プログレスバーやバッジで達成感を味わえます。 コンプリートを目指しましょう！
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 使い方セクション */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">使い方</h2>
            <p className="text-xl text-gray-600">
              3つのステップで簡単にスタンプラリーを楽しめます
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8 relative">
              <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center absolute -top-5 left-8 font-bold text-lg">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4 mt-4">アカウント作成</h3>
              <p className="text-gray-600">
                メールアドレスとパスワードでアカウントを作成します。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 relative">
              <div className="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center absolute -top-5 left-8 font-bold text-lg">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4 mt-4">QRコードスキャン</h3>
              <p className="text-gray-600">
                スタンプラリーのスポットでQRコードをスキャンします。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 relative">
              <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center absolute -top-5 left-8 font-bold text-lg">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4 mt-4">スタンプ取得</h3>
              <p className="text-gray-600">
                スタンプを取得してダッシュボードで進捗を確認できます。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA セクション */}
      <div className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            今すぐスタンプラリーを始めよう！
          </h2>
          <p className="text-xl mb-8 opacity-90">
            アカウントを作成して、楽しいスタンプラリーの世界へ
          </p>
          <Link
            href="/auth/register"
            className="bg-white text-blue-600 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 inline-block"
          >
            無料で始める
          </Link>
        </div>
      </div>
    </div>
  );
}
