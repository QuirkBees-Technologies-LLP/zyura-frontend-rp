import { Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules"; 
interface Testimonial {
  id: number;
  name: string;
  field: string;
  review: string;
  rating: number;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    field: "Medical Student",
    review:
      "Zyura-E changed how I think clinically—not just how I study.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    name: "Dr. Ahmed Khan",
    field: "Resident Doctor",
    review:
      "The clinical case simulator is incredibly realistic. It helped me build confidence before my board exams. Highly recommend!",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    name: "Emma Williams",
    field: "Nursing Student",
    review:
      "The viva exam practice with AI has been a game-changer. I feel much more prepared and confident in my clinical reasoning.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
  {
    id: 4,
    name: "Dr. Michael Chen",
    field: "Pharmacist",
    review:
      "The drug interaction tool and AI explanations have made my study sessions more efficient. Great value for the money!",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  },
  {
    id: 5,
    name: "Dr. Lisa Patel",
    field: "Dentist",
    review:
      "Connecting theoretical knowledge with practical scenarios has been invaluable. The platform is user-friendly and effective.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1517849845537-1d51a20414de?w=100&h=100&fit=crop",
  },
  {
    id: 6,
    name: "Dr. James Wilson",
    field: "Medical Resident",
    review:
      "Outstanding platform for clinical thinking development. The AI feedback is accurate and helps identify knowledge gaps.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
  },
];

export const TestimonialSection = () => {
  return (
    <section className="pt-25 lg:pt-36 pb-10" data-aos="fade-up">
      <div className="mx-auto container px-5">
        {/* Section Title */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="font-sora text-3xl md:text-4xl lg:text-[48px] font-semibold text-dark mb-4">
            What Our Students Say
          </h2>
          <p className="mx-auto max-w-2xl font-sora text-[16px] lg:text-[18px] text-[#29434c]">
            Join thousands of medical professionals who trust Zyura-E for their learning journey
          </p>
        </div>

        {/* Testimonials Swiper */}
        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
           
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={false}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          className="testimonial-swiper px-5 mb-10"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <article className="flex flex-col rounded-2xl p-6 mb-6 bg-gradient-to-br from-slate-50 to-slate-200 h-full hover:shadow-lg transition-all duration-300">
                {/* Stars Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-[15px] leading-relaxed text-[#4d6070] mb-6 flex-grow italic min-h-20">
                  "{testimonial.review}"
                </p>

                {/* Divider */}
                <div className="w-full h-[1px] bg-slate-200 mb-6" />

                {/* Profile Section */}
                <div className="flex items-center gap-4">
                  {/* Profile Image */}
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  {/* Name and Field */}
                  <div className="flex-1">
                    <h4 className="font-sora font-semibold text-[#141923] text-base">
                      {testimonial.name}
                    </h4>
                    <p className="text-[13px] text-[#7a8a93]">
                      {testimonial.field}
                    </p>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

  
    </section>
  );
};
