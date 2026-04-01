import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
} from "framer-motion";
import { useEffect, useRef } from "react";

// Premium easing curve for smoother animations (only one, not complex)
const PREMIUM_EASE = [0.25, 0.1, 0.25, 1]; // smooth easeOutBack

// Enhanced fadeInUp with subtle blur for depth
export const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 25,
    filter: "blur(2px)", // subtle blur for depth
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: PREMIUM_EASE,
      filter: { duration: 0.4 }, // blur clears faster
    },
  },
};

// Clean fadeIn for simple elements
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Scale with subtle spring for interactive feel
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: PREMIUM_EASE,
    },
  },
};

// Stagger container with better timing
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12, // slightly slower for premium feel
      delayChildren: 0.25,
    },
  },
};

// Stagger item with subtle blur
export const staggerItem = {
  hidden: {
    opacity: 0,
    y: 15,
    filter: "blur(1px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

// Premium section with parallax-like effect
export const AnimatedSection = ({
  children,
  className = "",
  variants = fadeInUp,
  once = true,
  threshold = 0.15, // slightly more visible before animation
  delay = 0,
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={variants}
      className={className}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};

// Enhanced card with shadow animation
export const AnimatedCard = ({
  children,
  className = "",
  glowEffect = false, // optional gold glow
}) => {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
        boxShadow: glowEffect
          ? "0 20px 40px rgba(212, 175, 55, 0.15)"
          : "0 20px 40px rgba(0, 0, 0, 0.1)",
        transition: {
          duration: 0.3,
          ease: "easeOut",
        },
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Premium button animation (100% must-have)
export const AnimatedButton = ({ children, className = "", glow = true }) => {
  return (
    <motion.button
      whileHover={{
        scale: 1.05,
        boxShadow: glow
          ? "0 10px 25px rgba(212, 175, 55, 0.4)"
          : "0 10px 25px rgba(0, 0, 0, 0.2)",
        transition: {
          duration: 0.3,
          ease: "easeOut",
        },
      }}
      whileTap={{ scale: 0.96 }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

// Icon hover rotation (simple but premium)
export const AnimatedIcon = ({ children, className = "" }) => {
  return (
    <motion.div
      whileHover={{
        rotate: 360,
        transition: { duration: 0.6, ease: "easeInOut" },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Subtle float for CTAs (makes them stand out)
export const FloatAnimation = {
  animate: {
    y: [0, -4, 0],
    transition: {
      duration: 2.5,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
};

// Text reveal for premium headings (optional but nice)
export const TextReveal = ({ text, className = "", as: Component = "p" }) => {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
        delayChildren: 0.1,
      },
    },
  };

  const child = {
    hidden: { opacity: 0, y: 5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const words = text.split(" ");

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
    >
      <Component>
        {words.map((word, i) => (
          <motion.span
            key={i}
            variants={child}
            style={{ display: "inline-block", marginRight: "0.25em" }}
          >
            {word}
          </motion.span>
        ))}
      </Component>
    </motion.div>
  );
};

// Counter animation component
export const AnimatedCounter = ({
  value,
  suffix = "",
  duration = 2,
  className = "",
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.floor(latest));

  useEffect(() => {
    if (isInView) {
      animate(count, value, {
        duration: duration,
        ease: "easeOut",
      });
    }
  }, [isInView, count, value, duration]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
};

// Stat card with counter animation
export const AnimatedStatCard = ({
  number,
  label,
  duration = 2,
  className = "",
  statClassName = "",
  labelClassName = "",
}) => {
  // Extract numeric value and suffix (like +, %, etc.)
  const numericValue = parseInt(number.replace(/[^0-9]/g, "")) || 0;
  const suffix = number.replace(/[0-9]/g, "");

  return (
    <motion.div variants={staggerItem} className={className}>
      <motion.div
        className={`text-3xl md:text-4xl font-bold text-gold-600 mb-2 ${statClassName}`}
        whileHover={{
          scale: 1.1,
          transition: { type: "spring", stiffness: 300 },
        }}
      >
        <AnimatedCounter
          value={numericValue}
          suffix={suffix}
          duration={duration}
        />
      </motion.div>
      <div
        className={`text-gray-600 dark:text-gray-400 font-medium ${labelClassName}`}
      >
        {label}
      </div>
    </motion.div>
  );
};

// Stats container with counters
export const AnimatedStatsContainer = ({
  stats,
  className = "",
  duration = 2,
}) => {
  return (
    <motion.div
      variants={staggerContainer}
      className={`grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 ${className}`}
    >
      {stats.map((stat, index) => (
        <AnimatedStatCard
          key={index}
          number={stat.number}
          label={stat.label}
          duration={duration}
        />
      ))}
    </motion.div>
  );
};

export const marqueeAnimation = (from, to) => ({
  initial: { x: from },
  animate: { x: to },
  transition: {
    duration: 60,
    repeat: Infinity,
    ease: "linear",
  },
});

// Export motion for direct use
export { motion };
