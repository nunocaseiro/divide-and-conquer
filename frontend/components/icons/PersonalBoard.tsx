import React from "react";
import { CSSProps } from "../../stitches.config";
import Svg from "../Primitives/Svg";

const PersonalBoardIcon = ({ css }: CSSProps) => {
  return (
    <Svg
      width="31"
      height="32"
      viewBox="0 0 31 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={css}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.36621 30.2746C14.1157 34.7636 25.2683 29.9783 28.9954 21.8554C32.7226 13.7325 30.8344 7.60134 23.0849 3.11237C15.3354 -1.37661 6.20395 -1.62868 2.47678 6.4942C-1.25039 14.6171 -1.3833 25.7857 6.36621 30.2746Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.8018 12.8032C12.8018 11.5606 13.8091 10.5532 15.0518 10.5532C16.2944 10.5532 17.3018 11.5606 17.3018 12.8032C17.3018 14.0459 16.2944 15.0532 15.0518 15.0532C13.8091 15.0532 12.8018 14.0459 12.8018 12.8032ZM15.0518 9.05322C12.9807 9.05322 11.3018 10.7322 11.3018 12.8032C11.3018 14.8743 12.9807 16.5532 15.0518 16.5532C17.1228 16.5532 18.8018 14.8743 18.8018 12.8032C18.8018 10.7322 17.1228 9.05322 15.0518 9.05322ZM12.0518 18.0532C11.0572 18.0532 10.1034 18.4483 9.40011 19.1516C8.69685 19.8548 8.30176 20.8087 8.30176 21.8032V23.3032C8.30176 23.7174 8.63754 24.0532 9.05176 24.0532C9.46597 24.0532 9.80176 23.7174 9.80176 23.3032V21.8032C9.80176 21.2065 10.0388 20.6342 10.4608 20.2122C10.8827 19.7903 11.455 19.5532 12.0518 19.5532H18.0518C18.6485 19.5532 19.2208 19.7903 19.6427 20.2122C20.0647 20.6342 20.3018 21.2065 20.3018 21.8032V23.3032C20.3018 23.7174 20.6375 24.0532 21.0518 24.0532C21.466 24.0532 21.8018 23.7174 21.8018 23.3032V21.8032C21.8018 20.8087 21.4067 19.8548 20.7034 19.1516C20.0001 18.4483 19.0463 18.0532 18.0518 18.0532H12.0518Z"
        fill="currentColor"
      />
    </Svg>
  );
};

export default PersonalBoardIcon;