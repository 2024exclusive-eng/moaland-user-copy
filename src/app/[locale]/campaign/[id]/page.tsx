import Image from "next/image";

import { FloatingInquiryButton } from "@/components/FloatingInquiryButton";
import { Button } from "@/components/ui/button";
import { initLingui } from "@/lib/i18n.server";

// Mock data - replace with real data from API
const mockCampaignData = {
  id: "1",
  platform: "인스타",
  daysLeft: 1,
  title: "[서울 강남구] 빌라드블랑",
  subtitle: "250,000원 상당 두피스케일링, 헤어크리닉, 헤어크리닉제 증정",
  mainImage:
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
  additionalImages: [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop",
  ],
  provisionDetails:
    "250,000원 상당 두피스케일링, 헤어크리닉, 헤어크리닉제 증정",
  storeLocation: "서울 강남구 논현로 149길",
  applicationPeriod: "08.22~08.28",
  announcementDate: "08.30",
  visitPeriod: "08.31~09.10",
  registrationPeriod: "08.31~09.13",
  applicants: {
    current: 10,
    total: 2,
  },
};

interface PageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function CampaignDetailPage(props: PageProps) {
  const params = await props.params;
  const lang = params.locale;
  initLingui(lang);

  return (
    <>
      <div className="container mx-auto px-4 bg-white">
        <div className="grid grid-cols-4 gap-10">
          {/* Main Content - Left Side */}
          <div className="col-span-3 border-r pt-10 border-[#e5e7eb] pr-10">
            {/* Header Section */}
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex flex-col items-start gap-1.5">
                <div className="flex items-center">
                  <div className="border border-[#e5e7eb] flex items-center gap-1 px-2.75 py-1.5 rounded-full">
                    <div className="relative w-4 h-4 bg-white rounded overflow-hidden">
                      <Image
                        src="/images/instagram-logo.webp"
                        alt="Instagram"
                        width={16}
                        height={16}
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-semibold text-black leading-5">
                      {mockCampaignData.platform}
                    </span>
                  </div>
                  <div className="border border-[#e5e7eb] px-2.75 py-1.5 rounded-full">
                    <span className="text-sm font-semibold text-black leading-5">
                      {mockCampaignData.daysLeft}일 남음
                    </span>
                  </div>
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-[#111827] leading-[1.7]">
                    {mockCampaignData.title}
                  </h1>

                  <p className="text-sm text-[#6b7280] leading-5">
                    {mockCampaignData.subtitle}
                  </p>
                </div>
              </div>

              <div className="h-px bg-[#e5e7eb] my-6" />

              {/* Main Image Section */}
              <div className="mb-6">
                <div className="relative h-125.5 w-full overflow-hidden">
                  <Image
                    src={mockCampaignData.mainImage}
                    alt={mockCampaignData.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white to-transparent" />
                </div>

                <Button
                  variant="outline"
                  className="w-full cursor-pointer h-10 border-[#111827] text-[#111827] shadow-[0px_2px_6px_0px_rgba(0,0,0,0.34)]"
                >
                  상세이미지 더보기
                </Button>
              </div>

              {/* Provision Details */}
              <div className="flex gap-4 py-4">
                <div className="w-29.5 shrink-0">
                  <h3 className="text-base font-semibold text-[#111827] leading-[1.7]">
                    제공 내역
                  </h3>
                </div>
                <div className="flex-1">
                  <p className="text-base text-[#111827] leading-[1.7]">
                    {mockCampaignData.provisionDetails}
                  </p>
                </div>
              </div>

              <div className="h-px bg-[#e5e7eb] my-6" />

              {/* Store Location */}
              <div className="flex gap-4 py-4">
                <div className="w-29.5 shrink-0">
                  <h3 className="text-base font-semibold text-[#111827] leading-[1.7]">
                    매장 위치
                  </h3>
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  <p className="text-base text-[#111827] leading-[1.7]">
                    {mockCampaignData.storeLocation}
                  </p>
                  <div className="relative h-86.75 w-full bg-gray-100 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-base font-bold text-[#111827] tracking-[-0.3px]">
                        구글 api 사용예정
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-[#e5e7eb] my-6" />

              {/* Guideline */}
              <div className="flex gap-4 py-4">
                <div className="w-29.5 shrink-0">
                  <h3 className="text-base font-semibold text-[#111827] leading-[1.7]">
                    가이드라인
                  </h3>
                </div>
                <div className="flex-1">
                  <div className="text-base text-[#111827] leading-[1.7] whitespace-pre-wrap">
                    {`[방문 가이드]
캠페인 신청 시 방문 기간 내에 방문 가능하신 날짜와 시간을 입력해주세요.

[영상/편집 가이드]
- (필수) 매장 외관 및 내부 촬영
- (필수) 헤어크리닉 시술 1회 이상 노출

[본문 가이드]
- (필수) 방문 후 솔직 후기 2~3줄 작성
- (선택) 주소, 주차 팁 등 작성
- (선택) 브랜드 계정을 태그 @vb.hair.official

[주의사항]
- 타 매장 비교·비방 금지`}
                  </div>
                </div>
              </div>

              <div className="h-px bg-[#e5e7eb] my-6" />

              {/* Shooting/Editing Mission */}
              <div className="flex gap-4 py-4">
                <div className="w-29.5 shrink-0">
                  <h3 className="text-base font-semibold text-[#111827] leading-[1.7]">
                    촬영/ 편집 미션
                  </h3>
                </div>
                <div className="flex-1">
                  <div className="text-base text-[#111827] leading-[1.7]">
                    <p className="mb-0">촬영 미션</p>
                    <ul className="list-disc mb-0 ml-6">
                      <li className="mb-0">화질 : HD 1080P 이상</li>
                      <li className="mb-0">
                        분량 : 15초 이상 (해당 캠페인의 가이드라인 기준이 우선)
                      </li>
                      <li className="mb-0">
                        본인 얼굴 노출이 아닌 타인의 얼굴을 노출 시키지
                        말아주세요. (협의된 지인은 노출 가능)
                      </li>
                      <li className="mb-0">
                        체험단 단독 리뷰 영상만 가능합니다. (브이로그 형태의
                        중간 소개 불가)
                      </li>
                      <li className="mb-0">
                        단순 사진 이어 붙이기 형식의 영상 금지 (전체 영상에서
                        2장 이상인 사진 리뷰는 수정 보완 대상이며, 사진은 리뷰
                        분량에서 제외됩니다.)
                      </li>
                      <li className="mb-0">
                        가이드에 맞지 않은 리뷰로 확인되는 경우, 재업로드 요청
                        및 페널티 부여
                      </li>
                    </ul>
                    <p className="mb-0 mt-4">편집 미션</p>
                    <ul className="list-disc ml-6">
                      <li className="mb-0">
                        영상 내 편집 프로그램 워터마크가 박힌 영상은 불가합니다.
                      </li>
                      <li className="mb-0">
                        라이선스 문제없는 편집 프로그램을 사용해주세요.
                      </li>
                      <li className="mb-0">
                        자막 및 전환, 애니메이션 효과를 넣어 편집해주세요.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="h-px bg-[#e8e8e8] border-t border-[#f0f0f0] my-6" />

              {/* Additional Information */}
              <div className="flex gap-4 py-4 pb-16">
                <div className="w-29.5 shrink-0">
                  <h3 className="text-base font-semibold text-[#111827] leading-[1.7]">
                    추가 안내사항
                  </h3>
                </div>
                <div className="flex-1">
                  <div className="text-base text-[#111827] leading-[1.7]">
                    <p className="mb-0">공통 안내</p>
                    <ul className="list-disc mb-0 ml-6">
                      <li className="mb-0">
                        리뷰 콘텐츠는 반드시 전체 공개 상태여야 합니다.
                      </li>
                      <li className="mb-0">
                        일부 공개 · 비공개 등의 사유로 신청하신 계정에 노출되지
                        않는 경우, 전체 공개 전환 요청을 드립니다. 수정 요청을
                        받으시면, 요청 즉시 전체 공개로 변경해 주셔야 합니다.
                      </li>
                      <li className="mb-0">
                        캠페인 선정 후 취소는 내부 규정에 의해 페널티 발생할 수
                        있습니다.
                      </li>
                    </ul>
                    <p className="mb-0 mt-4">매장 방문</p>
                    <ul className="list-disc ml-6">
                      <li className="mb-0">
                        가이드라인을 지키지 않은 경우, 수정 요청이 있을 수
                        있습니다.
                      </li>
                      <li className="mb-0">
                        공정위 가이드라인에 따라 협찬 사실을 고지해주세요.
                      </li>
                      <li className="mb-0">
                        작성하신 리뷰 콘텐츠는 서비스 홍보를 위해 활용될 수
                        있습니다.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Sidebar - Right Side */}
          <div className="col-span-1 pt-10">
            <div className="flex flex-col gap-5">
              {/* Campaign Info */}
              <div className="flex flex-col gap-3">
                <InfoRow
                  label="캠페인 신청기간"
                  value={mockCampaignData.applicationPeriod}
                />
                <InfoRow
                  label="인플루언서 발표"
                  value={mockCampaignData.announcementDate}
                />
                <InfoRow
                  label="방문기간"
                  value={mockCampaignData.visitPeriod}
                />
                <InfoRow
                  label="콘텐츠 등록기간"
                  value={mockCampaignData.registrationPeriod}
                />
                <div className="flex items-start pt-[1.63px]">
                  <div className="w-35 shrink-0">
                    <p className="text-base font-semibold text-[#111827] leading-[1.7]">
                      신청자{" "}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold leading-[1.7]">
                      <span className="text-[#ea3a50]">
                        {mockCampaignData.applicants.current}
                      </span>
                      <span className="text-[#111827]">
                        {" "}
                        / {mockCampaignData.applicants.total}명
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              <Button className="w-full text-[14px] h-10 bg-[#ea3a50] hover:bg-[#d63447] text-white rounded-lg">
                캠페인 신청하기
              </Button>

              {/* Banner Area */}
              <div className="h-23 bg-[#eae5e2] rounded-lg flex items-center justify-center">
                <p className="text-xl font-medium text-[#111827]">
                  banner here
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Inquiry Button */}
      <FloatingInquiryButton />
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start pt-[1.63px]">
      <div className="w-35 shrink-0">
        <p className="text-[14px] font-semibold text-[#111827] leading-[1.7]">
          {label}
        </p>
      </div>
      <div className="flex-1">
        <p className="text-[14px] font-semibold text-[#111827] leading-[1.7]">
          {value}
        </p>
      </div>
    </div>
  );
}
