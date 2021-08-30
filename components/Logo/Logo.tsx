import { SVGProps } from 'react';

function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 100 100"
      {...props}
    >
      <path
        fill="#fff"
        d="M5.28 79.08L1.04 75l5.44-50.72 4.24-3.36L51.92 27l-1.04 7.52L13.52 29 9.04 71.08l44.72-4.8.8 7.52-49.28 5.28zM64 78.92l-2.24-7.2 18.72-5.44-1.12-36.8-12.4-.96.64-7.44 31.36 2.16-.48 7.6-11.52-.8 1.2 38.88-2.72 3.76L64 78.92z"
      />
    </svg>
  );
}

export default Logo;
