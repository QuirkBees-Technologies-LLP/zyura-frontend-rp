
import { createElement } from "react";
import { ArrowUpRight, type IconNode } from "lucide";
import { Swiper, SwiperSlide, } from "swiper/react";
import doctorOne from "../../assets/home/doctor-1.png";
import doctorTwo from "../../assets/home/doctor-2.png";
import doctorThree from "../../assets/home/doctor-3.png";

type Mentor = {
  name: string;
  specialty: string;
  bio: string;
  image: string;
  isDummy?: boolean;
};

const mentorGroups: { title: string; mentors: Mentor[] }[] = [
  {
    title: "Featured Mentors",
    mentors: [
      {
        name: "Dr. Laila Kibria",
        specialty: "Dermatology Mentor",
        bio: "Specializes in diagnostic dermatology and board-focused case reviews for clinical confidence.",
        image: doctorOne,
      },
      {
        name: "Dr. Samuel N. Carter",
        specialty: "Internal Medicine Mentor",
        bio: "Guides students through evidence-based decision-making and high-yield internal medicine pathways.",
        image: doctorTwo,
      },
    ],
  },
  {
    title: "Clinical Specialists",
    mentors: [
      {
        name: "Dr. Elena R. Miles",
        specialty: "Clinical Skills Mentor",
        bio: "Focuses on bedside reasoning, patient communication, and practical exam performance strategy.",
        image: doctorThree,
      },
    ],
  },
];

const dummyMentorPool: Mentor[] = [
  {
    name: "Dr. Mentor Slot",
    specialty: "Specialty Mentor",
    bio: "More expert-led sessions are being added to this category soon.",
    image: doctorOne,
    isDummy: true,
  },
  {
    name: "Dr. Mentor Slot",
    specialty: "Specialty Mentor",
    bio: "A new specialist profile will appear here in the next update.",
    image: doctorTwo,
    isDummy: true,
  },
  {
    name: "Dr. Mentor Slot",
    specialty: "Specialty Mentor",
    bio: "Upcoming mentor sessions are being prepared for this section.",
    image: doctorThree,
    isDummy: true,
  },
  {
    name: "Dr. Mentor Slot",
    specialty: "Specialty Mentor",
    bio: "We are onboarding additional experts for this mentoring track.",
    image: doctorOne,
    isDummy: true,
  },
  {
    name: "Dr. Mentor Slot",
    specialty: "Specialty Mentor",
    bio: "We are onboarding additional experts for this mentoring track.",
    image: doctorOne,
    isDummy: true,
  },
  {
    name: "Dr. Mentor Slot",
    specialty: "Specialty Mentor",
    bio: "We are onboarding additional experts for this mentoring track.",
    image: doctorOne,
    isDummy: true,
  },
  {
    name: "Dr. Mentor Slot",
    specialty: "Specialty Mentor",
    bio: "We are onboarding additional experts for this mentoring track.",
    image: doctorOne,
    isDummy: true,
  },
  {
    name: "Dr. Mentor Slot",
    specialty: "Specialty Mentor",
    bio: "We are onboarding additional experts for this mentoring track.",
    image: doctorOne,
    isDummy: true,
  },
  {
    name: "Dr. Mentor Slot",
    specialty: "Specialty Mentor",
    bio: "We are onboarding additional experts for this mentoring track.",
    image: doctorOne,
    isDummy: true,
  },
];

const padMentors = (mentors: Mentor[], targetCount = 4): Mentor[] => {
  if (mentors.length >= targetCount) {
    return mentors.slice(0, targetCount);
  }

  const needed = targetCount - mentors.length;
  const fillers = Array.from({ length: needed }, (_, index) => ({
    ...dummyMentorPool[index % dummyMentorPool.length],
    name: `${dummyMentorPool[index % dummyMentorPool.length].name} ${index + 1}`,
  }));

  return [...mentors, ...fillers];
};

const LucideIcon = ({
  icon,
  size = 42,
  className = "",
}: {
  icon: IconNode;
  size?: number;
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {icon.map(([tag, attrs], index) =>
      createElement(tag, { ...attrs, key: `${tag}-${index}` }),
    )}
  </svg>
);

export const MentorsSection = () => {
  return (
    <section className="pt-25 lg:pt-36" data-aos="fade-up">
      <div className="mx-auto mb-16 max-w-[980px] px-6" data-aos="fade-up">
        <h2 className="mx-auto text-center font-sora text-2xl font-semibold text-dark md:text-3xl lg:text-[48px]">
          Expert Mentorship from Leading Professionals
        </h2>
      </div>

      <div className="mx-auto container px-5">
        <div className="space-y-8">
          {mentorGroups.map((group, groupIndex) => (
            <div key={group.title} className="space-y-4">
              <h3
                className="font-sora text-2xl font-semibold text-[#1c2330] md:text-3xl"
                data-aos="fade-up"
                data-aos-delay={groupIndex * 90}
              >
                {group.title}
              </h3>

              <Swiper
                spaceBetween={16}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  1024: { slidesPerView: 3 },
                }}
                className="h-full"
              >
                {padMentors(group.mentors).map((mentor, index) => (
                  <SwiperSlide key={`${group.title}-${mentor.name}`} className="h-auto">
                    <article
                      className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white ${mentor.isDummy
                          ? "border-dashed border-[#c9d3e6]"
                          : "border-[#d4dbe7]"
                        }`}
                      data-aos="fade-up"
                      data-aos-delay={index * 90}
                    >
                      <div className="relative h-[500px]">
                        <img
                          src={mentor.image}
                          alt={`${mentor.name} - ${mentor.specialty}`}
                          className="h-full w-full object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <div>
                          <h4 className="font-sora text-xl font-semibold text-[#171c25]">
                            {mentor.name}
                          </h4>
                          <p className="mt-1 font-sora text-base font-medium text-brand">
                            {mentor.specialty}
                          </p>
                          <p className="mt-3 font-sora text-[15px] leading-relaxed text-[#3a4453] min-h-12">
                            {mentor.bio}
                          </p>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-lg border border-[#1f2a3a] px-4 py-2.5 font-sora text-[14px] font-medium text-[#1f2a3a] transition hover:border-brand hover:text-brand"
                          >
                            View Profile
                            <LucideIcon
                              icon={ArrowUpRight}
                              size={18}
                              className="shrink-0"
                            />
                          </button>
                          <button
                            type="button"
                            className="flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 font-sora font-light text-sm text-white transition bg-brand-gradient hover:bg-brand-gradient-hover"
                          >
                            Book a Session
                          </button>
                        </div>
                      </div>
                    </article>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
