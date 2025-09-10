import * as React from "react";
import SvgIcon from "@mui/material/SvgIcon";

export default function GasPriceCheckerLogo() {
  return (
    <SvgIcon
      viewBox="0 0 400 120"
      sx={{ width: 220, height: 60 }}
    >
      {/* Blue rounded square background */}
      <rect x="0" y="0" width="120" height="120" rx="20" fill="#0056A6" />

      {/* Gas pump icon (clean vector) */}
      <g transform="translate(20,20) scale(3.5)">
        <path
          d="M6 2v20h9v-7h2v7h3v-9.5c0-.83-.67-1.5-1.5-1.5S17 11.67 17 12.5V13h-2V2H6zm2 2h5v12H8V4z"
          fill="white"
        />
      </g>

      {/* Text block to the right */}
      <text
        x="150"
        y="55"
        textAnchor="start"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="bold"
        fontSize="28"
        fill="#0056A6"
      >
        GAS PRICE
      </text>
      <text
        x="150"
        y="95"
        textAnchor="start"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="bold"
        fontSize="28"
        fill="#0056A6"
      >
        CHECKER
      </text>
    </SvgIcon>
  );
}
