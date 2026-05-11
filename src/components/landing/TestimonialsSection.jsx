import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    content:
      "I finally have one place to check cash flow before making business purchases. The dashboard is fast, calm, and easy to trust.",
    author: "Maya Patel",
    role: "Independent consultant",
    avatar: "https://i.pravatar.cc/150?img=44",
    rating: 5,
  },
  {
    content:
      "The budget alerts helped me catch recurring expenses I had stopped noticing. It saves me a review meeting with myself every week.",
    author: "Daniel Kim",
    role: "Product engineer",
    avatar: "https://i.pravatar.cc/150?img=11",
    rating: 5,
  },
  {
    content:
      "The reports are clear enough to share with my partner without explaining a spreadsheet. That changed how we plan each month.",
    author: "Elena Brooks",
    role: "Operations lead",
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 5,
  },
  {
    content:
      "It gives me a quick read on spending without turning personal finance into a second job. That balance is exactly what I needed.",
    author: "Jordan Reyes",
    role: "Studio owner",
    avatar: "https://i.pravatar.cc/150?img=32",
    rating: 5,
  },
];

function TestimonialCard({ testimonial, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <motion.div
        animate={{ scale: isHovered ? 1.02 : 1 }}
        transition={{ duration: 0.3 }}
        className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/8 to-white/3 p-7 shadow-xl backdrop-blur-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 sm:p-8"
      >
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10"
        />

        <div className="relative z-10 flex h-full flex-col">
          <div className="mb-5 flex gap-1">
            {[...Array(testimonial.rating)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + i * 0.05 }}
              >
                <Star size={15} className="fill-amber-400 text-amber-400" />
              </motion.div>
            ))}
          </div>

          <motion.p
            animate={{ y: isHovered ? -2 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 text-[1.02rem] font-medium leading-8 text-slate-200"
          >
            “{testimonial.content}”
          </motion.p>

          <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
            <motion.img
              animate={{ scale: isHovered ? 1.08 : 1 }}
              transition={{ duration: 0.3 }}
              className="h-12 w-12 rounded-full border-2 border-white/20 object-cover shadow-lg"
              src={testimonial.avatar}
              alt={testimonial.author}
            />
            <div>
              <h4 className="font-display font-semibold tracking-tight text-white">
                {testimonial.author}
              </h4>
              <p className="text-sm font-medium text-slate-400">
                {testimonial.role}
              </p>
            </div>
          </div>
        </div>

        <motion.div
          animate={{ width: isHovered ? "100%" : "0%" }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400"
        />
      </motion.div>
    </motion.div>
  );
}

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-slate-950 pt-14 pb-24 sm:pt-16 sm:pb-32"
    >
      <div className="absolute top-1/4 right-1/4 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="section-container">
        <div className="mx-auto mb-16 max-w-3xl text-center sm:mb-20">
          <p className="section-kicker mb-4">Customer notes</p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="section-title text-balance mb-6"
          >
            Built for people who want a clearer
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}money routine.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="section-copy mx-auto max-w-2xl text-pretty"
          >
            Smart Finance is made for regular reviews, quick decisions, and
            better conversations about where money is going.
          </motion.p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.author}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
