import Image from "next/image";

export function ProfileBasicInfo() {
  return (
    <div className="flex flex-col gap-6">
      {/* Profile Picture */}
      <div className="relative w-[78px] h-[73px]">
        <div className="w-[68px] h-[68px]">
          <Image
            src="/images/default-avatar.png"
            width={68}
            height={68}
            alt="Profile"
            className="rounded-full object-cover"
          />
        </div>
        <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-[#e5e7eb] rounded-full flex items-center justify-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.334 2.00004C11.5091 1.82494 11.7169 1.68605 11.9457 1.59129C12.1745 1.49653 12.4197 1.44775 12.6673 1.44775C12.9149 1.44775 13.1601 1.49653 13.3889 1.59129C13.6177 1.68605 13.8256 1.82494 14.0007 2.00004C14.1758 2.17513 14.3147 2.383 14.4094 2.61178C14.5042 2.84055 14.553 3.08575 14.553 3.33337C14.553 3.58099 14.5042 3.82619 14.4094 4.05497C14.3147 4.28374 14.1758 4.49161 14.0007 4.66671L5.00065 13.6667L1.33398 14.6667L2.33398 11L11.334 2.00004Z"
              stroke="#6B7280"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Email Field */}
      <div className="flex flex-col gap-2 w-full">
        <label className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
          가입 이메일
        </label>
        <input
          type="email"
          value="tirrilee00.google.com"
          readOnly
          className="w-full h-10 px-3.5 py-2.5 bg-white border border-[#e5e7eb] rounded-lg text-sm text-[#111827] leading-[1.7]"
        />
        <p className="text-sm text-[#9ca3af] leading-[1.7]">
          이메일 수정 시 재인증이 필요합니다.
        </p>
      </div>

      {/* Withdraw Link */}
      <button className="text-sm font-medium text-[#9ca3af] underline text-left mt-auto pt-96">
        탈퇴하기
      </button>
    </div>
  );
}
