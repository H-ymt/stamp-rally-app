"use client";

import type { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface UserStamp {
  id: string;
  collected_at: string;
  stamp_spots: {
    id: string;
    name: string;
    description: string | null;
    location: string | null;
  };
}

interface StampSpot {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
}

export default function Dashboard() {
  const [userStamps, setUserStamps] = useState<UserStamp[]>([]);
  const [allSpots, setAllSpots] = useState<StampSpot[]>([]);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }
    setUser(user);
    await Promise.all([fetchUserStamps(user.id), fetchAllSpots()]);
    setLoading(false);
  };

  const fetchUserStamps = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_stamps")
        .select(
          `
          id,
          collected_at,
          stamp_spots (
            id,
            name,
            description,
            location
          )
        `
        )
        .eq("user_id", userId)
        .order("collected_at", { ascending: false });

      if (error) throw error;
      setUserStamps(
        (data || []).map((item: any) => ({
          ...item,
          stamp_spots: Array.isArray(item.stamp_spots)
            ? item.stamp_spots[0]
            : item.stamp_spots,
        }))
      );
    } catch (error) {
      console.error("スタンプ取得エラー:", error);
    }
  };

  const fetchAllSpots = async () => {
    try {
      const { data, error } = await supabase
        .from("stamp_spots")
        .select("id, name, description, location")
        .eq("is_active", true);

      if (error) throw error;
      setAllSpots(data || []);
    } catch (error) {
      console.error("スポット取得エラー:", error);
    }
  };

  const collectedSpotIds = new Set(userStamps.map((stamp) => stamp.stamp_spots.id));
  const progressPercentage =
    allSpots.length > 0 ? (userStamps.length / allSpots.length) * 100 : 0;

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">読み込み中...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">マイダッシュボード</h1>

        {/* プログレスバー */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold">進捗状況</span>
            <span className="text-sm text-gray-600">
              {userStamps.length} / {allSpots.length} スポット
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{progressPercentage.toFixed(1)}% 完了</p>
        </div>

        {/* QRスキャンボタン */}
        <button
          onClick={() => router.push("/scan")}
          className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 mb-8"
        >
          QRコードをスキャン
        </button>
      </div>

      {/* 取得済みスタンプ */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">取得済みスタンプ</h2>
        {userStamps.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userStamps.map((stamp) => (
              <div key={stamp.id} className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-2">{stamp.stamp_spots.name}</h3>
                {stamp.stamp_spots.description && (
                  <p className="text-gray-600 text-sm mb-2">{stamp.stamp_spots.description}</p>
                )}
                {stamp.stamp_spots.location && (
                  <p className="text-gray-500 text-sm mb-2">📍 {stamp.stamp_spots.location}</p>
                )}
                <p className="text-xs text-gray-400">
                  取得日時: {new Date(stamp.collected_at).toLocaleString("ja-JP")}
                </p>
                <div className="mt-2">
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    ✓ 取得済み
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            まだスタンプを取得していません。QRコードをスキャンして始めましょう！
          </p>
        )}
      </div>

      {/* 未取得スポット */}
      <div>
        <h2 className="text-2xl font-bold mb-4">未取得スポット</h2>
        {allSpots.filter((spot) => !collectedSpotIds.has(spot.id)).length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allSpots
              .filter((spot) => !collectedSpotIds.has(spot.id))
              .map((spot) => (
                <div key={spot.id} className="bg-gray-50 rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold mb-2">{spot.name}</h3>
                  {spot.description && (
                    <p className="text-gray-600 text-sm mb-2">{spot.description}</p>
                  )}
                  {spot.location && (
                    <p className="text-gray-500 text-sm mb-2">📍 {spot.location}</p>
                  )}
                  <div className="mt-2">
                    <span className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                      未取得
                    </span>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-green-600 font-semibold">
            🎉 すべてのスタンプを取得しました！おめでとうございます！
          </p>
        )}
      </div>
    </div>
  );
}
