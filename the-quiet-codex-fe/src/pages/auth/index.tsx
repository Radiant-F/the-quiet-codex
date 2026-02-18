import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import AuthHeader from "../../features/auth/components/AuthHeader";
import AuthForm from "../../features/auth/components/AuthForm";

export default function AuthPage() {
  return (
    <>
      <Helmet>
        <title>Sign In — The Quiet Codex</title>
        <meta
          name="description"
          content="Sign in to The Quiet Codex to start writing and sharing your articles."
        />
      </Helmet>

      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <AuthHeader />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <AuthForm />
        </motion.div>
      </div>
    </>
  );
}
