import React, { forwardRef, memo, useImperativeHandle, useRef } from "react";

import { getQRData, QRCodeSVG, type QRPropsSVG } from "~/lib";

interface QRCodeProps extends Omit<QRPropsSVG, "value"> {
  url: string;
  hideLogo?: boolean;
  logo?: string;
}

export interface QRCodeRef {
  svgElement: SVGSVGElement | null;
  qrData: ReturnType<typeof getQRData>;
}

const _QRCode = forwardRef<QRCodeRef, QRCodeProps>(
  ({ url, hideLogo, logo, scale = 1, ...restProps }, ref) => {
    const qrData = getQRData({ url, hideLogo, logo, ...restProps });

    const qrDataRef = useRef<SVGSVGElement | null>(null);

    useImperativeHandle(ref, () => ({
      svgElement: qrDataRef.current,
      qrData,
    }));

    return (
      <QRCodeSVG
        ref={qrDataRef}
        value={qrData.value}
        size={(qrData.size / 8) * +scale}
        bgColor={qrData.bgColor}
        fgColor={qrData.fgColor}
        level={qrData.level}
        margin={qrData.margin}
        {...(qrData.imageSettings && {
          imageSettings: {
            ...qrData.imageSettings,
            height: qrData.imageSettings
              ? (qrData.imageSettings.height / 8) * +scale
              : 0,
            width: qrData.imageSettings
              ? (qrData.imageSettings.width / 8) * +scale
              : 0,
          },
        })}
      />
    );
  },
);

_QRCode.displayName = "QRCode";

// Wrap the forwardRef component with memo
export const QRCode = memo(_QRCode);
