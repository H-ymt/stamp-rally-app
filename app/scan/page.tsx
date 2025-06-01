"use client";

import { useState, useEffect, useRef } from "react";
import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";
import QrScanner from "qr-scanner";

// 内部ロジックを別コンポーネントに分離
function ScanPageInner() {
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    checkUser();

    // URLパラメータから直接スキャンを処理
    const spotId = searchParams.get("spot");
    const date = searchParams.get("date");
    if (spotId && date) {
      handleDirectScan(spotId, date);
    }

    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }
    setUser(user);
  };

  const handleDirectScan = async (spotId: string, date: string) => {
    if (!user) return;

    try {
      // 今日の日付チェック
      const today = new Date().toISOString().split("T")[0];
      if (date !== today) {
        setMessage("このQRコードは期限切れです。");
        return;
      }

      await processStampCollection(spotId, date);
    } catch (error) {
      console.error("スキャンエラー:", error);
      setMessage("エラーが発生しました。");
    }
  };

  const startScanning = async () => {
    if (!videoRef.current || !user) return;

    try {
      setScanning(true);
      setMessage("");

      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => handleScanResult(result.data),
        {
          onDecodeError: (error) => {
            console.log("スキャンエラー:", error);
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await qrScannerRef.current.start();
    } catch (error) {
      console.error("カメラ起動エラー:", error);
      setMessage("カメラの起動に失敗しました。");
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setScanning(false);
  };

  const handleScanResult = async (data: string) => {
    try {
      // QRコードの形式: stamp-rally:spotId:date
      if (data.startsWith("stamp-rally:")) {
        const parts = data.split(":");
        if (parts.length === 3) {
          const spotId = parts[1];
          const date = parts[2];

          stopScanning();
          await processStampCollection(spotId, date);
        } else {
          setMessage("無効なQRコードです。");
        }
      } else {
        setMessage("スタンプラリー用のQRコードではありません。");
      }
    } catch (error) {
      console.error("QRコード処理エラー:", error);
      setMessage("QRコードの処理中にエラーが発生しました。");
    }
  };

  const processStampCollection = async (spotId: string, date: string) => {
    try {
      if (!user) {
        setMessage("ユーザー情報が取得できませんでした。");
        return;
      }
      // 今日の日付チェック
      const today = new Date().toISOString().split("T")[0];
      if (date !== today) {
        setMessage("このQRコードは期限切れです。");
        return;
      }

      // QRコードの存在確認
      const { data: qrCodeData, error: qrError } = await supabase
        .from("daily_qr_codes")
        .select("id, spot_id")
        .eq("spot_id", spotId)
        .eq("valid_date", date)
        .single();

      if (qrError || !qrCodeData) {
        setMessage("無効なQRコードです。");
        return;
      }

      // 重複チェック
      const { data: existingStamp } = await supabase
        .from("user_stamps")
        .select("id")
        .eq("user_id", user.id)
        .eq("qr_code_id", qrCodeData.id)
        .single();

      if (existingStamp) {
        setMessage("このスタンプは既に取得済みです。");
        return;
      }

      // スタンプ取得
      const { error: insertError } = await supabase.from("user_stamps").insert({
        user_id: user.id,
        spot_id: spotId,
        qr_code_id: qrCodeData.id,
      });

      if (insertError) {
        setMessage("スタンプの取得に失敗しました。");
        return;
      }

      // スポット名を取得
      const { data: spotData } = await supabase
        .from("stamp_spots")
        .select("name")
        .eq("id", spotId)
        .single();

      setMessage(`🎉 「${spotData?.name || "スポット"}」のスタンプを取得しました！`);

      // 3秒後にダッシュボードに戻る
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (error) {
      console.error("スタンプ処理エラー:", error);
      setMessage("エラーが発生しました。");
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">読み込み中...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">QRコードスキャン</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        {!scanning ? (
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              スタンプラリーのQRコードをスキャンしてスタンプを取得しましょう！
            </p>
            <button
              onClick={startScanning}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700"
            >
              スキャン開始
            </button>
          </div>
        ) : (
          <div>
            <div className="relative mb-4">
              <video
                ref={videoRef}
                className="w-full max-w-md mx-auto rounded-lg"
                style={{ maxHeight: "400px" }}
              />
            </div>
            <div className="text-center">
              <button
                onClick={stopScanning}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
              >
                スキャン停止
              </button>
            </div>
          </div>
        )}

        {message && (
          <div
            className={`mt-6 p-4 rounded-lg text-center ${
              message.includes("🎉")
                ? "bg-green-100 text-green-800"
                : message.includes("エラー") ||
                  message.includes("無効") ||
                  message.includes("期限切れ")
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            ダッシュボードに戻る
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">読み込み中...</div>
      }
    >
      <ScanPageInner />
    </Suspense>
  );
}
