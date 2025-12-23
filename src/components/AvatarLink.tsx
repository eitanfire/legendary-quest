import React from "react";

type AvatarLinkProps = {
  href: string,
  avatarSrc: string,
  text?: string,
  size?: number,
};

export const AvatarLink: React.FC<AvatarLinkProps> = ({
  href,
  avatarSrc,
  text = "connect with me",
  size = 70,
}) => {
  const center = size / 2;
  const avatarRadius = size * 0.18;
  const avatarSize = avatarRadius * 2;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="avatar-link"
      aria-label={text}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ display: "block" }}
      >
        <defs>
          {/* Circular path for text */}
          <path
            id="circlePath"
            d={`
              M ${center},${center}
              m -${center - 7},0
              a ${center - 7},${center - 7} 0 1,1 ${(center - 7) * 2},0
              a ${center - 7},${center - 7} 0 1,1 -${(center - 7) * 2},0
            `}
          />

          {/* Clip path for avatar */}
          <clipPath id="avatarClip">
            <circle cx={center} cy={center} r={avatarRadius} />
          </clipPath>
        </defs>

        {/* Avatar */}
        <image
          href={avatarSrc}
          x={center - avatarRadius}
          y={center - avatarRadius}
          width={avatarSize}
          height={avatarSize}
          clipPath="url(#avatarClip)"
        />

        {/* Curved text */}
        <text
          fontSize={size * 0.11}
          fontWeight="700"
          fill="white"
          stroke="#00B894"
          strokeWidth="0.5"
          letterSpacing="1.2"
          style={{
            filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.8))",
          }}
        >
          <textPath href="#circlePath" startOffset="23%">
            {text}
          </textPath>
        </text>
      </svg>
    </a>
  );
};
