import QRCode from "qrcode";
import { format } from "date-fns";

export const generateQRCode = async (spotId: string, date: Date): Promise<string> => {
  const dateStr = format(date, "yyyy-MM-dd");
  const qrData = `${process.env.NEXT_PUBLIC_APP_URL}/scan?spot=${spotId}&date=${dateStr}`;

  try {
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error("QRコード生成エラー:", error);
    throw error;
  }
};

export const generateDailyQRString = (spotId: string, date: Date): string => {
  const dateStr = format(date, "yyyy-MM-dd");
  return `stamp-rally:${spotId}:${dateStr}`;
};
