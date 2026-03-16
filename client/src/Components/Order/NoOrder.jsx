import { PackageSearch } from "lucide-react"
import { motion } from "framer-motion"


function NoOrder({ type }) {
  const messages = {
    current: {
      title: "No Current Orders",
      description: "You don't have any active orders at the moment.",
    },
    past: {
      title: "No Past Orders",
      description: "Your order history is empty.",
    },
    prepared: {
      title: "No Prepared Orders",
      description: "No prepared orders available at the moment."
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center  justify-center min-h-[500px] p-8 rounded-lg border border-dashed"
    >
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="relative">
        <div className="absolute -inset-1 rounded-full bg-muted/50 blur-sm" />
        <div className="relative bg-background p-4 rounded-full">
          <PackageSearch className="w-12 h-12 text-muted-foreground" />
        </div>
      </motion.div>
      <h3 className="mt-6 text-2xl font-semibold text-foreground">{messages[type].title}</h3>
      <p className="mt-2 text-center text-muted-foreground">{messages[type].description}</p>
    </motion.div>
  )
}



export default NoOrder;