"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { generateQRCode, generateDailyQRString } from "@/lib/qr-utils";
import { format } from "date-fns";

interface StampSpot {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  is_active: boolean;
}

export default function AdminDashboard() {
  const [spots, setSpots] = useState<StampSpot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpots();
  }, []);

  const fetchSpots = async () => {
    try {
      const { data, error } = await supabase
        .from("stamp_spots")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSpots(data || []);
    } catch (error) {
      console.error("スポット取得エラー:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateTodayQRCodes = async () => {
    setLoading(true);
    const today = new Date();
    const todayStr = format(today, "yyyy-MM-dd");

    try {
      for (const spot of spots) {
        if (!spot.is_active) continue;

        const qrString = generateDailyQRString(spot.id, today);

        // 既存の今日のQRコードをチェック
        const { data: existing } = await supabase
          .from("daily_qr_codes")
          .select("id")
          .eq("spot_id", spot.id)
          .eq("valid_date", todayStr)
          .single();

        if (!existing) {
          // 新しいQRコードを生成
          const { error } = await supabase.from("daily_qr_codes").insert({
            spot_id: spot.id,
            qr_code: qrString,
            valid_date: todayStr,
          });

          if (error) throw error;
        }
      }

      alert("本日のQRコードを生成しました");
    } catch (error) {
      console.error("QRコード生成エラー:", error);
      alert("QRコード生成に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">読み込み中...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">管理者ダッシュボード</h1>
        <button
          onClick={generateTodayQRCodes}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          disabled={loading}
        >
          本日のQRコード生成
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {spots.map((spot) => (
          <div key={spot.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">{spot.name}</h3>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  spot.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}
              >
                {spot.is_active ? "アクティブ" : "非アクティブ"}
              </span>
            </div>
            {spot.description && <p className="text-gray-600 mb-2">{spot.description}</p>}
            {spot.location && <p className="text-sm text-gray-500 mb-4">📍 {spot.location}</p>}
            <QRCodeDisplay spotId={spot.id} spotName={spot.name} />
          </div>
        ))}
      </div>
    </div>
  );
}

function QRCodeDisplay({ spotId, spotName }: { spotId: string; spotName: string }) {
  const [qrCode, setQrCode] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const generateQR = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const qrCodeDataURL = await generateQRCode(spotId, today);
      setQrCode(qrCodeDataURL);
    } catch (error) {
      console.error("QRコード表示エラー:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      {qrCode ? (
        <div>
          <img src={qrCode} alt={`${spotName}のQRコード`} className="mx-auto mb-2" />
          <p className="text-xs text-gray-500">
            {format(new Date(), "yyyy年MM月dd日")}のQRコード
          </p>
        </div>
      ) : (
        <button
          onClick={generateQR}
          disabled={loading}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          {loading ? "生成中..." : "QRコード表示"}
        </button>
      )}
    </div>
  );
}
